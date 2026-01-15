"use client"
// hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { chatService } from '@/lib/services/chatService';

export const useChat = (groupId?: string) => {
  const { isConnected, sendMessage, setTyping, markAsRead, onEvent } = useWebSocketContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages 
  const loadMessages = useCallback(async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/chat?action=getMessages&groupId=${groupId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages');
      }
      
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  // Send a new message
  const sendNewMessage = useCallback(async (content: string, type = 'text', metadata = {}) => {
    if (!groupId) return;
    
    try {
      sendMessage(groupId, content, type, metadata);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  }, [groupId, sendMessage]);

  // Handle typing indicator
  const handleTyping = useCallback((isUserTyping: boolean) => {
    if (!groupId) return;
    setTyping(groupId, isUserTyping);
  }, [groupId, setTyping]);

  // Handle message read
  const handleMessageRead = useCallback((messageId: string) => {
    markAsRead(messageId);
  }, [markAsRead]);

  // Set up event listeners
  useEffect(() => {
    if (!groupId) return;

    // Join the group room
    if (isConnected) {
      onEvent('joinGroups', (groupIds: string[]) => {
        console.log('Joined groups:', groupIds);
      });
    }

    // Listen for new messages
    const cleanupNewMessage = onEvent('newMessage', (message) => {
      if (message.groupId === groupId) {
        setMessages(prev => [message, ...prev]);
      }
    });

    // Listen for typing indicators
    const cleanupTyping = onEvent('userTyping', (data) => {
      if (data.groupId === groupId) {
        setIsTyping(prev => ({
          ...prev,
          [data.userId]: data.isTyping
        }));

        // Clear typing indicator after 3 seconds
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping(prev => ({
              ...prev,
              [data.userId]: false
            }));
          }, 3000);
        }
      }
    });

    // Initial load
    loadMessages();

    return () => {
      cleanupNewMessage?.();
      cleanupTyping?.();
    };
  }, [groupId, isConnected, loadMessages, onEvent]);

  return {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage: sendNewMessage,
    setTyping: handleTyping,
    markAsRead: handleMessageRead,
    refreshMessages: loadMessages,
  };
};
