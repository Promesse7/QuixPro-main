"use client"
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { getCurrentUser } from "@/lib/auth"

export interface WebSocketContextType {
  isConnected: boolean
  joinGroups: (groupIds: string[]) => void
  sendMessage: (groupId: string, content: string, type?: string, metadata?: any) => void
  setTyping: (groupId: string, isTyping: boolean) => void
  markAsRead: (messageId: string) => void
  onEvent: (event: string, callback: (data: any) => void) => (() => void) | undefined
}

export const useWebSocket = (): WebSocketContextType => {
  // Temporarily disable WebSocket to prevent connection errors
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Mock implementation for now
  const joinGroups = (groupIds: string[]) => {
    console.log('WebSocket disabled - joinGroups called with:', groupIds);
  };

  const sendMessage = (groupId: string, content: string, type?: string, metadata?: any) => {
    console.log('WebSocket disabled - sendMessage called');
  };

  const setTyping = (groupId: string, isTyping: boolean) => {
    console.log('WebSocket disabled - setTyping called');
  };

  const markAsRead = (messageId: string) => {
    console.log('WebSocket disabled - markAsRead called');
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    console.log('WebSocket disabled - onEvent called for:', event);
    return () => {}; // Return cleanup function
  };

  return {
    isConnected,
    joinGroups,
    sendMessage,
    setTyping,
    markAsRead,
    onEvent
  };
};
