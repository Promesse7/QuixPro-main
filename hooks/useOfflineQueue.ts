"use client"

import { useState, useCallback, useEffect } from "react"

interface QueuedMessage {
  id: string
  content: string
  timestamp: number
  type?: string
  metadata?: any
}

const STORAGE_KEY = "quix_offline_queue"

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const [isOnline, setIsOnline] = useState(true)

  // Initialize offline queue from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setQueue(JSON.parse(stored))
      } catch (error) {
        console.error("[v0] Error loading offline queue:", error)
      }
    }

    // Setup online/offline listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Persist queue to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }, [queue])

  const addToQueue = useCallback((content: string, type = "text", metadata?: any) => {
    const message: QueuedMessage = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      timestamp: Date.now(),
      type,
      metadata,
    }

    setQueue((prev) => [...prev, message])
    return message
  }, [])

  const removeFromQueue = useCallback((messageId: string) => {
    setQueue((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    queue,
    isOnline,
    addToQueue,
    removeFromQueue,
    clearQueue,
    hasQueuedMessages: queue.length > 0,
  }
}
