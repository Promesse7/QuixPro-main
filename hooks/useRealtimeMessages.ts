"use client";

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, push, serverTimestamp, off } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUser } from '@/lib/auth';
import { getFirebaseId, getCurrentUserId } from '@/lib/userUtils';

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  senderEmail?: string;
  senderName?: string;
  recipientEmail?: string;
  content: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export function useRealtimeMessages(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId(); // Use unique ID from session
  const messagesRef = useRef<any>(null);
  const socketRef = useRef<any>(null);

  // WebSocket connection effect
  useEffect(() => {
    if (!currentUserId) return;

    // Initialize WebSocket connection
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    
    socketRef.current.onopen = () => {
      console.log('WebSocket connected for direct messages');
      // Authenticate with current user
      socketRef.current.send(JSON.stringify({
        type: 'auth',
        token: localStorage.getItem('firebaseToken') // Use token from Firebase auth
      }));
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'newDirectMessage') {
          console.log('Received direct message via WebSocket:', data);
          setMessages(prev => {
            const exists = prev.some(m => m._id === data.message._id);
            if (exists) return prev;
            return [...prev, {
              ...data.message,
              sender: {
                _id: data.message.senderId,
                name: data.message.senderName || data.message.senderId?.split("_")[0] || "Unknown",
                email: data.message.senderEmail,
              },
            }];
          });
        } else if (data.type === 'directMessageRead') {
          console.log('Direct message read receipt:', data);
          const otherFirebaseId = getFirebaseId(otherUserId);
          setMessages(prev => prev.map(m =>
            m.senderId === otherFirebaseId ? { ...m, read: true } : m
          ));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socketRef.current.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [currentUserId, otherUserId]);

  // Firebase messages effect
  useEffect(() => {
    if (!otherUserId || !database || !currentUserId) {
      console.log('Real-time messages hook - missing data:', {
        hasOtherUserId: !!otherUserId,
        hasDatabase: !!database,
        hasCurrentUserId: !!currentUserId
      });
      setLoading(false);
      return;
    }

    // Create a unique chat ID using unique IDs
    const chatId = [currentUserId, otherUserId].sort().join('_');

    // Use Firebase-safe IDs for the path
    const currentFirebaseId = getFirebaseId(currentUserId);
    const otherFirebaseId = getFirebaseId(otherUserId);
    const firebaseChatId = [currentFirebaseId, otherFirebaseId].sort().join('_');

    const chatRef = ref(database, `chats/${firebaseChatId}/messages`);

    console.log('Setting up real-time messages listener for:', {
      chatId: firebaseChatId,
      currentUserId: currentUserId,
      otherUserId,
      currentFirebaseId,
      otherFirebaseId
    });

    setLoading(true);

    // Listen for real-time messages from Firebase
    const unsubscribeFirebase = onValue(chatRef, (snapshot) => {
      console.log('Real-time messages snapshot received:', snapshot.exists());
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          _id: key,
          ...value,
        })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        console.log('Messages loaded from Firebase:', messageList.length);
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
      if (messagesRef.current) {
        off(messagesRef.current);
      }
      unsubscribeFirebase();
    };
  }, [otherUserId, currentUserId, database]);

  const sendRealtimeMessage = async (content: string) => {
    if (!content.trim() || !otherUserId || !database || !currentUserId) return;

    try {
      const currentFirebaseId = getFirebaseId(currentUserId);
      const otherFirebaseId = getFirebaseId(otherUserId);
      const chatId = [currentFirebaseId, otherFirebaseId].sort().join('_');
      const chatRef = ref(database, `chats/${chatId}/messages`);

      // Get current user info from session
      const currentUser = getCurrentUser();
      
      const newMessage = {
        senderId: currentFirebaseId,
        recipientId: otherFirebaseId,
        senderEmail: currentUser?.email || 'unknown@example.com',
        senderName: currentUser?.name || 'Unknown User',
        recipientEmail: otherUserId.includes('@') ? otherUserId : 'unknown@example.com',
        content: content.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
        read: false,
      };

      // Send via WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'sendDirectMessage',
          recipientId: otherUserId,
          content: content.trim(),
          messageType: 'text'
        }));
      }

      // Also send via Firebase for persistence
      await push(chatRef, newMessage);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  return { messages, loading, sendMessage: sendRealtimeMessage };
}
