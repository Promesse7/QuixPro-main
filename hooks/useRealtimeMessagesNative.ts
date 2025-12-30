"use client";

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, push, serverTimestamp, off, update, set } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUserId } from '@/lib/userUtils';

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

export function useRealtimeMessages(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();
  const messagesRef = useRef<any>(null);

  // Create conversation ID using unique IDs
  const conversationId = currentUserId && otherUserId 
    ? [currentUserId, otherUserId].sort().join('_')
    : null;

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
