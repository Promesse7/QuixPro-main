"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { getCurrentUserId } from "@/lib/userUtils"

export interface WebSocketContextType {
  isConnected: boolean
  joinGroups: (groupIds: string[]) => void
  sendMessage: (groupId: string, content: string, type?: string, metadata?: any) => void
  setTyping: (groupId: string, isTyping: boolean) => void
  markAsRead: (messageId: string) => void
  onEvent: (event: string, callback: (data: any) => void) => (() => void) | undefined
}

export const useWebSocket = (): WebSocketContextType => {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const eventListenersRef = useRef<Map<string, Set<Function>>>(new Map())

  useEffect(() => {
    const userId = getCurrentUserId()
    if (!userId) return

    // Create socket connection with proper configuration
    const socket = io(window.location.origin, {
      path: "/api/socket/io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      auth: {
        token: userId, // In production, use actual auth token
      },
    })

    // Connection event handlers
    socket.on("connect", () => {
      console.log("[v0] WebSocket connected")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("[v0] WebSocket disconnected")
      setIsConnected(false)
    })

    socket.on("connect_error", (error: any) => {
      console.warn("[v0] WebSocket connection error:", error.message)
    })

    // Re-emit all registered events
    socket.on("*", (event: string, data: any) => {
      const listeners = eventListenersRef.current.get(event)
      if (listeners) {
        listeners.forEach((callback) => callback(data))
      }
    })

    socketRef.current = socket

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const joinGroups = useCallback((groupIds: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("joinGroups", groupIds)
    }
  }, [])

  const sendMessage = useCallback((groupId: string, content: string, type?: string, metadata?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", { groupId, content, type, metadata })
    }
  }, [])

  const setTyping = useCallback((groupId: string, isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing", { groupId, isTyping })
    }
  }, [])

  const markAsRead = useCallback((messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("markAsRead", { messageId })
    }
  }, [])

  const onEvent = useCallback((event: string, callback: (data: any) => void) => {
    if (!eventListenersRef.current.has(event)) {
      eventListenersRef.current.set(event, new Set())
    }
    eventListenersRef.current.get(event)?.add(callback)

    // Return cleanup function
    return () => {
      eventListenersRef.current.get(event)?.delete(callback)
    }
  }, [])

  return {
    isConnected,
    joinGroups,
    sendMessage,
    setTyping,
    markAsRead,
    onEvent,
  }
}
