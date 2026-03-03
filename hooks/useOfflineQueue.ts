"use client"

import { useState, useCallback, useEffect, useRef } from "react"

interface QueuedMessage {
  id: string
  content: string
  timestamp: number
  type?: string
  metadata?: any
  retryCount?: number
  maxRetries?: number
  priority?: "low" | "normal" | "high"
  chatId?: string
  replyTo?: string
  threadId?: string
  status?: "pending" | "sending" | "failed" | "sent"
  error?: string
}

interface QueueConfig {
  maxRetries: number
  retryDelay: number
  maxQueueSize: number
  enableCompression: boolean
  enableEncryption: boolean
  syncInterval: number
}

const STORAGE_KEY = "quix_offline_queue"
const defaultConfig: QueueConfig = {
  maxRetries: 3,
  retryDelay: 5000,
  maxQueueSize: 100,
  enableCompression: false,
  enableEncryption: false,
  syncInterval: 30000
}

export function useOfflineQueue(config: Partial<QueueConfig> = {}) {
  const queueConfig = { ...defaultConfig, ...config }
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">("idle")
  const [stats, setStats] = useState({
    totalQueued: 0,
    totalSent: 0,
    totalFailed: 0,
    averageRetryCount: 0
  })

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Initialize offline queue from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsedQueue = JSON.parse(stored)
        setQueue(parsedQueue)

        // Calculate initial stats
        const totalQueued = parsedQueue.length
        const totalSent = parsedQueue.filter((m: QueuedMessage) => m.status === "sent").length
        const totalFailed = parsedQueue.filter((m: QueuedMessage) => m.status === "failed").length
        const avgRetry = parsedQueue.reduce((acc: number, m: QueuedMessage) => acc + (m.retryCount || 0), 0) / totalQueued || 0

        setStats({
          totalQueued,
          totalSent,
          totalFailed,
          averageRetryCount: avgRetry
        })
      } catch (error) {
        console.error("Error loading offline queue:", error)
      }
    }

    // Setup online/offline listeners
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus("syncing")
      processQueue()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus("idle")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial online status
    setIsOnline(navigator.onLine)

    // Setup periodic sync when online
    if (navigator.onLine) {
      syncIntervalRef.current = setInterval(processQueue, queueConfig.syncInterval)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
      retryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Persist queue to localStorage
  useEffect(() => {
    try {
      const queueToStore = queueConfig.enableCompression
        ? JSON.stringify(queue) // Would implement compression here
        : JSON.stringify(queue)

      localStorage.setItem(STORAGE_KEY, queueToStore)
    } catch (error) {
      console.error("Failed to save queue to localStorage:", error)
    }
  }, [queue, queueConfig.enableCompression])

  // Process queue when online
  const processQueue = useCallback(async () => {
    if (!isOnline || syncStatus === "syncing") return

    setSyncStatus("syncing")

    const pendingMessages = queue.filter(msg =>
      msg.status === "pending" || (msg.status === "failed" && (msg.retryCount || 0) < (msg.maxRetries || queueConfig.maxRetries))
    ).sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { high: 3, normal: 2, low: 1 }
      const aPriority = priorityOrder[a.priority || "normal"]
      const bPriority = priorityOrder[b.priority || "normal"]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return a.timestamp - b.timestamp
    })

    let sentCount = 0
    let failedCount = 0

    for (const message of pendingMessages) {
      try {
        // Mark as sending
        setQueue(prev => prev.map(m =>
          m.id === message.id ? { ...m, status: "sending" } : m
        ))

        // Simulate sending message (replace with actual API call)
        await sendMessageToServer(message)

        // Mark as sent
        setQueue(prev => prev.map(m =>
          m.id === message.id ? { ...m, status: "sent" } : m
        ))

        sentCount++

        // Remove from queue after successful send
        setTimeout(() => {
          removeFromQueue(message.id)
        }, 1000)

      } catch (error) {
        const retryCount = (message.retryCount || 0) + 1
        const maxRetries = message.maxRetries || queueConfig.maxRetries

        // Mark as failed
        setQueue(prev => prev.map(m =>
          m.id === message.id ? {
            ...m,
            status: retryCount >= maxRetries ? "failed" : "pending",
            retryCount,
            error: error instanceof Error ? error.message : "Unknown error"
          } : m
        ))

        failedCount++

        // Schedule retry if not max retries
        if (retryCount < maxRetries) {
          const timeout = setTimeout(() => {
            setQueue(prev => prev.map(m =>
              m.id === message.id ? { ...m, status: "pending" } : m
            ))
          }, queueConfig.retryDelay * Math.pow(2, retryCount - 1)) // Exponential backoff

          retryTimeoutsRef.current.set(message.id, timeout)
        }
      }
    }

    // Update stats
    setStats(prev => ({
      ...prev,
      totalSent: prev.totalSent + sentCount,
      totalFailed: prev.totalFailed + failedCount
    }))

    setSyncStatus("idle")
  }, [isOnline, queue, syncStatus, queueConfig])

  // Simulate sending message to server (replace with actual implementation)
  const sendMessageToServer = useCallback(async (message: QueuedMessage): Promise<void> => {
    // This would be your actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve()
        } else {
          reject(new Error("Network error"))
        }
      }, 1000 + Math.random() * 2000)
    })
  }, [])

  // Add message to queue
  const queueMessage = useCallback((messageData: {
    content: string
    type?: string
    metadata?: any
    priority?: "low" | "normal" | "high"
    chatId?: string
    replyTo?: string
    threadId?: string
  }) => {
    const message: QueuedMessage = {
      id: `${Date.now()}-${Math.random()}`,
      content: messageData.content,
      timestamp: Date.now(),
      type: messageData.type || "text",
      metadata: messageData.metadata,
      priority: messageData.priority || "normal",
      chatId: messageData.chatId,
      replyTo: messageData.replyTo,
      threadId: messageData.threadId,
      status: "pending",
      retryCount: 0,
      maxRetries: queueConfig.maxRetries
    }

    setQueue(prev => {
      const newQueue = [...prev, message]

      // Enforce max queue size
      if (newQueue.length > queueConfig.maxQueueSize) {
        // Remove oldest low priority messages first
        const sorted = newQueue.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 }
          const aPriority = priorityOrder[a.priority || "normal"]
          const bPriority = priorityOrder[b.priority || "normal"]

          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }

          return a.timestamp - b.timestamp
        })

        return sorted.slice(-queueConfig.maxQueueSize)
      }

      return newQueue
    })

    setStats(prev => ({
      ...prev,
      totalQueued: prev.totalQueued + 1
    }))

    // Try to send immediately if online
    if (isOnline) {
      processQueue()
    }

    return message
  }, [isOnline, processQueue, queueConfig])

  // Remove message from queue
  const removeFromQueue = useCallback((messageId: string) => {
    setQueue(prev => prev.filter(m => m.id !== messageId))

    // Clear any retry timeout
    const timeout = retryTimeoutsRef.current.get(messageId)
    if (timeout) {
      clearTimeout(timeout)
      retryTimeoutsRef.current.delete(messageId)
    }
  }, [])

  // Retry specific message
  const retryMessage = useCallback((messageId: string) => {
    setQueue(prev => prev.map(m =>
      m.id === messageId ? { ...m, status: "pending", retryCount: 0 } : m
    ))

    if (isOnline) {
      processQueue()
    }
  }, [isOnline, processQueue])

  // Clear entire queue
  const clearQueue = useCallback(() => {
    setQueue([])
    localStorage.removeItem(STORAGE_KEY)

    // Clear all retry timeouts
    retryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    retryTimeoutsRef.current.clear()

    setStats({
      totalQueued: 0,
      totalSent: 0,
      totalFailed: 0,
      averageRetryCount: 0
    })
  }, [])

  // Get queue statistics
  const getQueueStats = useCallback(() => {
    const pending = queue.filter(m => m.status === "pending").length
    const sending = queue.filter(m => m.status === "sending").length
    const failed = queue.filter(m => m.status === "failed").length
    const sent = queue.filter(m => m.status === "sent").length

    const avgRetry = queue.reduce((acc, m) => acc + (m.retryCount || 0), 0) / queue.length || 0

    return {
      ...stats,
      pending,
      sending,
      failed,
      sent,
      totalInQueue: queue.length,
      averageRetryCount: avgRetry
    }
  }, [queue, stats])

  // Export/import queue for backup
  const exportQueue = useCallback(() => {
    return JSON.stringify(queue)
  }, [queue])

  const importQueue = useCallback((queueData: string) => {
    try {
      const importedQueue = JSON.parse(queueData)
      setQueue(importedQueue)
      return true
    } catch (error) {
      console.error("Failed to import queue:", error)
      return false
    }
  }, [])

  return {
    queue,
    isOnline,
    syncStatus,
    queueMessage,
    removeFromQueue,
    retryMessage,
    clearQueue,
    getQueueStats,
    exportQueue,
    importQueue,
    hasQueuedMessages: queue.length > 0,
    pendingCount: queue.filter(m => m.status === "pending").length,
    failedCount: queue.filter(m => m.status === "failed").length
  }
}
