'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { getSocket } from '@/lib/socket';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();

  // Handle incoming WebSocket messages
  const handleSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'newMessage':
          addNotification(
            'info',
            'New Message',
            `You have a new message in ${data.groupName || 'chat'}`
          );
          break;
          
        case 'messageRead':
          // Handle read receipts if needed
          break;
          
        case 'userTyping':
          // Handle typing indicators if needed
          break;
          
        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, [addNotification]);

  // Set up WebSocket connection
  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = getSocket(session.user.id);
    
    socket.onmessage = handleSocketMessage;
    
    // Join user's personal room
    socket.send(JSON.stringify({
      type: 'join',
      userId: session.user.id,
    }));

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [session?.user?.id, handleSocketMessage]);

  // Add a test notification on mount (for demo purposes)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        addNotification('info', 'Welcome to QuixPro', 'You are now connected to the notification service.');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [addNotification]);

  return <>{children}</>;
};

export default NotificationProvider;
