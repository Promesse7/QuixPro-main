// hooks/useGroupChat.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebaseClient";
import { ref, onValue, push, set, off, update, get } from "firebase/database";
import { getCurrentUserId, getFirebaseId } from "@/lib/userUtils";
import { Group, Message, GroupRole } from "@/models/index";

interface UseGroupChatProps {
  groupId: string;
}

export function useGroupChat({ groupId }: UseGroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const currentUserId = getCurrentUserId();
  const currentUserFirebaseId = getFirebaseId(currentUserId);
  const router = useRouter();

  // Load group data
  useEffect(() => {
    if (!groupId || !database) return;

    const loadGroup = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from your API
        const groupRef = ref(database, `groups/${groupId}`);
        const snapshot = await get(groupRef);
        
        if (snapshot.exists()) {
          setGroup(snapshot.val());
        } else {
          setError("Group not found");
          router.push("/groups");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId, router]);

  // Listen for real-time messages
  useEffect(() => {
    if (!groupId || !database) return;

    const messagesRef = ref(database, `groupMessages/${groupId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
          _id: id,
          ...message,
          // Convert Firebase timestamp to Date if needed
          createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
        })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        setMessages(messageList);
      } else {
        setMessages([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading messages:", error);
      setError("Failed to load messages");
      setLoading(false);
    });

    return () => {
      off(messagesRef, "value", unsubscribe);
    };
  }, [groupId]);

    useEffect(() => {
    if (!groupId || !database) return;
    const groupRef = ref(database, `groups/${groupId}`);
    const unsubscribe = onValue(groupRef, (snapshot) => {
      const groupData = snapshot.val();
      if (groupData) {
        setGroup({
          _id: groupId,
          ...groupData,
        });
      }
    }, (error) => {
      console.error("Error loading group updates:", error);
      setError("Failed to load group updates");
    });
    return () => {
      off(groupRef, "value", unsubscribe);
    };
  }, [groupId]);
  
  // Listen for typing indicators
  useEffect(() => {
    if (!groupId || !database) return;

    const typingRef = ref(database, `groupTyping/${groupId}`);
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTypingUsers(data);
    });

    return () => {
      off(typingRef, "value", unsubscribe);
    };
  }, [groupId]);

  // Send a message to the group
  const sendMessage = useCallback(async (content: string, type = "text", metadata = {}) => {
    if (!content.trim() || !groupId || !database || !currentUserId) return false;

    try {
      const messageData = {
        content: content.trim(),
        type,
        senderId: currentUserId,
        senderName: currentUserId.split("@")[0], // Or get from user profile
        createdAt: new Date().toISOString(),
        readBy: [currentUserId],
        metadata,
      };

      // Add message to Firebase
      const messagesRef = ref(database, `groupMessages/${groupId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageData);

      // Update last message in group
      const groupRef = ref(database, `groups/${groupId}`);
      await update(groupRef, {
        lastMessage: {
          content: content.trim(),
          senderId: currentUserId,
          timestamp: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }, [groupId, currentUserId, database]);

  // Set typing indicator
  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!groupId || !database || !currentUserId) return;

    try {
      const typingRef = ref(database, `groupTyping/${groupId}/${currentUserFirebaseId}`);
      if (isTyping) {
        await set(typingRef, {
          userId: currentUserId,
          name: currentUserId.split("@")[0], // Or get from user profile
          isTyping: true,
          timestamp: Date.now(),
        });

        // Auto-clear typing after 3 seconds
        setTimeout(() => {
          setTyping(false);
        }, 3000);
      } else {
        await set(typingRef, null);
      }
    } catch (error) {
      console.error("Error setting typing indicator:", error);
    }
  }, [groupId, currentUserId, currentUserFirebaseId, database]);

  // Add member to group
  const addMember = useCallback(async (userId: string, role: GroupRole = "member") => {
    if (!groupId || !database) return false;

    try {
      // In a real app, you would call your API endpoint
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });

      if (!response.ok) {
        throw new Error("Failed to add member");
      }

      return true;
    } catch (error) {
      console.error("Error adding member:", error);
      return false;
    }
  }, [groupId]);

  // Remove member from group
  const removeMember = useCallback(async (userId: string) => {
    if (!groupId || !database) return false;

    try {
      // In a real app, you would call your API endpoint
      const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove member");
      }

      return true;
    } catch (error) {
      console.error("Error removing member:", error);
      return false;
    }
  }, [groupId]);

  // Update member role
  const updateMemberRole = useCallback(async (userId: string, role: GroupRole) => {
    if (!groupId) return false;

    try {
      // In a real app, you would call your API endpoint
      const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member role");
      }

      return true;
    } catch (error) {
      console.error("Error updating member role:", error);
      return false;
    }
  }, [groupId]);

  // Update group settings
  const updateGroupSettings = useCallback(async (updates: Partial<Group["settings"]>) => {
    if (!groupId) return false;

    try {
      // In a real app, you would call your API endpoint
      const response = await fetch(`/api/groups/${groupId}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update group settings");
      }

      return true;
    } catch (error) {
      console.error("Error updating group settings:", error);
      return false;
    }
  }, [groupId]);

  return {
    messages,
    group,
    loading,
    error,
    typingUsers,
    sendMessage,
    setTyping,
    addMember,
    removeMember,
    updateMemberRole,
    updateGroupSettings,
  };
}
