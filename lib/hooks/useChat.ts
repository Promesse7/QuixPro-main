'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/models/Chat';
import { database, authenticateWithFirebase } from '@/lib/firebaseClient';
import { getCurrentUserId } from '@/lib/userUtils';
import { ref, onChildAdded, off } from 'firebase/database';

// Enriched message type that includes the full sender object
interface EnrichedMessage extends Omit<Message, 'senderId'> {
  sender: { _id: string; name: string; avatar?: string };
}

// A simple cache for user data
const userCache = new Map<string, any>();

// Function to fetch user data for a set of IDs
async function fetchUsers(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(id => !userCache.has(id)))];
  if (uniqueIds.length === 0) return;

  try {
    const response = await fetch(`/api/users?ids=${uniqueIds.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch user data');
    const users = await response.json();
    users.forEach((user: any) => userCache.set(user._id, user));
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const enrichMessages = async (messages: Message[]): Promise<EnrichedMessage[]> => {
    const senderIds = messages.map(m => m.senderId);
    await fetchUsers(senderIds);
    return messages.map(msg => ({
      ...msg,
      sender: userCache.get(msg.senderId) || { _id: msg.senderId, name: 'Unknown User' },
    }));
  };

  // Initialize Firebase and fetch initial messages
  useEffect(() => {
    async function setup() {
      if (isFetching.current) return;
      isFetching.current = true;
      try {
        const userId = getCurrentUserId();
        if (userId) {
          await authenticateWithFirebase(userId);
        }

        const response = await fetch(`/api/groups/${groupId}/messages`);
        if (!response.ok) throw new Error('Failed to fetch initial messages');
        const data = await response.json();

        const enriched = await enrichMessages(data.messages);
        setMessages(enriched);
      } catch (err: any) {
        setError(err.message);
      } finally {
        isFetching.current = false;
      }
    }

    if (groupId) setup();
  }, [groupId]);

  // Listen for real-time updates
  useEffect(() => {
    if (!groupId || !database) return;

    const messagesRef = ref(database, `messages/${groupId}`);
    const unsubscribeFromMessages = onChildAdded(messagesRef, async (snapshot) => {
      const newMessage = snapshot.val();
      const [enrichedNewMessage] = await enrichMessages([newMessage]);
      setMessages((prevMessages) => [...prevMessages, enrichedNewMessage]);
    });

    const typingRef = ref(database, `typingIndicators/${groupId}`);
    const unsubscribeFromTyping = onChildAdded(typingRef, (snapshot) => {
      const typingData = { [snapshot.key as string]: snapshot.val() };
      const newTypingUsers = Object.keys(typingData).filter(userId => typingData[userId].isTyping);
      setTypingUsers(newTypingUsers);
    });

    return () => {
      off(messagesRef);
      off(typingRef);
    };
  }, [groupId, database]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!groupId) return;
      try {
        await fetch(`/api/groups/${groupId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
      } catch (err: any) {
        setError(err.message);
      }
    },
    [groupId]
  );

  const sendTypingNotification = useCallback(
    async (isTyping: boolean) => {
      if (!groupId) return;
      try {
        await fetch(`/api/groups/${groupId}/typing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isTyping }),
        });
      } catch (err: any) {
        setError(err.message);
      }
    },
    [groupId]
  );

  return { messages, typingUsers, sendMessage, sendTypingNotification, error };
}
