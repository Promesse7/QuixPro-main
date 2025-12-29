"use client";

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, push, serverTimestamp, off } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUser } from '@/lib/auth';
import { getFirebaseId } from '@/lib/userUtils';

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export function useRealtimeMessages(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const messagesRef = useRef<any>(null);

  useEffect(() => {
    if (!otherUserId || !database || !currentUser?.id) {
      console.log('Realtime messages hook - missing data:', { 
        hasOtherUserId: !!otherUserId, 
        hasDatabase: !!database,
        hasCurrentUserId: !!currentUser?.id
      });
      setLoading(false);
      return;
    }

    // Create a unique chat ID using MongoDB ObjectIds (sorted to ensure same ID for both users)
    const chatId = [currentUser.id, otherUserId].sort().join('_');
    
    // Use Firebase-safe IDs for the path
    const currentFirebaseId = getFirebaseId(currentUser.id);
    const otherFirebaseId = getFirebaseId(otherUserId);
    const firebaseChatId = [currentFirebaseId, otherFirebaseId].sort().join('_');
    
    const chatRef = ref(database, `chats/${firebaseChatId}/messages`);

    console.log('Setting up real-time messages listener for:', { 
      chatId: firebaseChatId, 
      currentUserId: currentUser.id, 
      otherUserId,
      currentFirebaseId,
      otherFirebaseId
    });

    setLoading(true);

    // Listen for real-time messages
    const unsubscribe = onValue(chatRef, (snapshot) => {
      console.log('Real-time messages snapshot received:', snapshot.exists());
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          _id: key,
          ...value,
        })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        console.log('Messages loaded:', messageList.length);
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

    messagesRef.current = chatRef;

    return () => {
      if (messagesRef.current) {
        off(messagesRef.current);
      }
      unsubscribe();
    };
  }, [otherUserId, currentUser?.id, database]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !otherUserId || !database || !currentUser?.id) return;

    try {
      const chatId = [currentUser.id, otherUserId].sort().join('_');
      const chatRef = ref(database, `chats/${chatId}/messages`);

      const newMessage = {
        senderId: currentUser.id,
        recipientId: otherUserId,
        senderEmail: currentUser.email, // Keep email for display purposes
        recipientEmail: otherUserId, // This might be email in some cases
        content: content.trim(),
        type: 'text',
        createdAt: serverTimestamp(),
        read: false,
      };

      await push(chatRef, newMessage);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  return { messages, loading, sendMessage };
}
