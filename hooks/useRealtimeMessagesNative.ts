"use client";

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, push, serverTimestamp, off, update, set } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUserId, getFirebaseId } from '@/lib/userUtils';
import { normalizeId } from '@/lib/identifiers';
import { get } from 'firebase/database';

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  senderEmail?: string;
  senderName?: string;
  content: string;
  type: string;
  createdAt: string | number;
  read: boolean;
}

export function useRealtimeMessages(otherUserIdInput: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const currentUserId = getCurrentUserId();
  const otherUserId = getFirebaseId(otherUserIdInput);
  const messagesRef = useRef<any>(null);

  // Discover actual conversation ID (handles legacy nodes)
  useEffect(() => {
    if (!currentUserId || !otherUserId || !database) return;

    const discoverConversationId = async () => {
      const defaultId = [currentUserId, otherUserId].sort().join('_');
      const normalizedCurrentId = normalizeId(currentUserId);
      const normalizedOtherId = normalizeId(otherUserId);

      try {
        const conversationsRef = ref(database, 'conversations');
        const snapshot = await get(conversationsRef);
        const data = snapshot.val();

        if (data) {
          // Find any conversation node where these two are participants (fuzzy matched)
          const match = Object.entries(data).find(([id, conv]: [string, any]) => {
            const pIds = Object.keys(conv.participants || {});
            if (pIds.length !== 2) return false;

            const normalizedPIds = pIds.map(pid => normalizeId(pid));
            return normalizedPIds.includes(normalizedCurrentId) &&
              normalizedPIds.includes(normalizedOtherId);
          });

          if (match) {
            console.log('Discovered existing conversation node:', match[0]);
            setConversationId(match[0]);
          } else {
            console.log('No existing conversation node found, using default:', defaultId);
            setConversationId(defaultId);
          }
        } else {
          setConversationId(defaultId);
        }
      } catch (error) {
        console.error('Error discovering conversation ID:', error);
        setConversationId(defaultId);
      }
    };

    discoverConversationId();
  }, [currentUserId, otherUserId]);

  // Firebase messages effect - simplified and native
  useEffect(() => {
    if (!conversationId || !database || !currentUserId) {
      console.log('Real-time messages hook - missing data:', {
        hasConversationId: !!conversationId,
        hasDatabase: !!database,
        hasCurrentUserId: !!currentUserId
      });
      setLoading(false);
      return;
    }

    console.log('Setting up Firebase native messages listener for:', {
      conversationId,
      currentUserId,
      otherUserId
    });

    setLoading(true);

    // Listen for messages using Firebase native real-time
    const messagesRef = ref(database, `messages/${conversationId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      console.log('Firebase native messages snapshot received:', snapshot.exists());
      const data = snapshot.val();

      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          _id: key,
          ...value,
          // Ensure consistent timestamp format
          createdAt: typeof value.createdAt === 'object' ? value.createdAt : (value.createdAt || Date.now())
        })).sort((a, b) => {
          const timeA = typeof a.createdAt === 'object' ? a.createdAt : new Date(a.createdAt).getTime();
          const timeB = typeof b.createdAt === 'object' ? b.createdAt : new Date(b.createdAt).getTime();
          return timeA - timeB;
        });

        console.log('Messages loaded from Firebase native:', messageList.length);
        setMessages(messageList);
      } else {
        console.log('No messages found');
        setMessages([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading messages:', error);
      setLoading(false);
    });

    return () => {
      off(messagesRef, 'value', unsubscribe);
    };
  }, [conversationId, currentUserId, database]);

  // Send message using Firebase native functions
  const sendMessage = async (content: string, type = 'text') => {
    if (!content.trim() || !conversationId || !database || !currentUserId) {
      console.error('Cannot send message - missing data');
      return false;
    }

    try {
      console.log('Sending message via Firebase native:', { conversationId, content });

      // Get current user info
      const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');

      // Add message to Firebase
      const messagesRef = ref(database, `messages/${conversationId}`);
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        senderId: currentUserId,
        recipientId: otherUserId,
        senderEmail: currentUserData.email || 'unknown@example.com',
        senderName: currentUserData.name || 'Unknown User',
        content: content.trim(),
        type,
        createdAt: serverTimestamp(),
        read: false
      });

      // Update conversation metadata
      const conversationRef = ref(database, `conversations/${conversationId}`);
      await update(conversationRef, {
        participants: {
          [currentUserId]: true,
          [otherUserId]: true
        },
        lastMessage: content.trim(),
        lastMessageTime: serverTimestamp(),
        lastMessageSender: currentUserId,
        updatedAt: serverTimestamp()
      });

      console.log('Message sent successfully via Firebase native');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    if (!conversationId || !database || !currentUserId) return;

    try {
      const messageRef = ref(database, `messages/${conversationId}/${messageId}`);
      await update(messageRef, {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    conversationId
  };
}
