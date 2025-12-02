// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const useWebSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || '', {
      path: '/api/socket/io',
      auth: {
        token: session.user.email, // Using email as token for now
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [session]);

  // Join group rooms
  const joinGroups = (groupIds: string[]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('joinGroups', groupIds);
    }
  };

  // Send a message
  const sendMessage = (groupId: string, content: string, type = 'text', metadata = {}) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', {
        groupId,
        content,
        type,
        metadata,
      });
    }
  };

  // Set typing indicator
  const setTyping = (groupId: string, isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { groupId, isTyping });
    }
  };

  // Mark message as read
  const markAsRead = (messageId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('markAsRead', { messageId });
    }
  };

  // Subscribe to events
  const onEvent = (event: string, callback: (data: any) => void) => {
    if (!socketRef.current) return;

    socketRef.current.on(event, callback);

    // Return cleanup function
    return () => {
      socketRef.current?.off(event, callback);
    };
  };

  return {
    isConnected,
    joinGroups,
    sendMessage,
    setTyping,
    markAsRead,
    onEvent,
  };
};