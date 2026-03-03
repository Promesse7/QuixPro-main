"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTheme } from "next-themes"

interface CachedMessage {
  _id: string
  content: string
  sender: {
    _id: string
    name: string
    avatar?: string
    email?: string
  }
  type: "text" | "image" | "file" | "math" | "voice" | "embed"
  metadata?: any
  reactions: Array<{
    emoji: string
    users: string[]
    count: number
    isFromCurrentUser: boolean
  }>
  threadId?: string
  replyTo?: string
  isPinned: boolean
  isEdited: boolean
  editedAt?: string
  createdAt: string
  read: boolean
  deliveryStatus: "sending" | "sent" | "delivered" | "read" | "failed"
  cachedAt: string
  expiresAt?: string
}

interface CacheConfig {
  maxSize: number
  maxAge: number // in milliseconds
  compressionEnabled: boolean
  encryptionEnabled: boolean
}

const defaultConfig: CacheConfig = {
  maxSize: 1000,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  compressionEnabled: true,
  encryptionEnabled: false
}

export function useMessageCache(chatId: string, config: Partial<CacheConfig> = {}) {
  const cacheConfig = { ...defaultConfig, ...config }
  const [cache, setCache] = useState<Map<string, CachedMessage[]>>(new Map())
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    hitRate: 0,
    totalRequests: 0,
    hits: 0
  })
  const cacheRef = useRef(cache)
  const statsRef = useRef(cacheStats)

  // Update refs when state changes
  useEffect(() => {
    cacheRef.current = cache
  }, [cache])

  useEffect(() => {
    statsRef.current = cacheStats
  }, [cacheStats])

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`chat_cache_${chatId}`)
      if (cached) {
        const parsedCache = JSON.parse(cached)
        setCache(new Map(Object.entries(parsedCache)))
      }
    } catch (error) {
      console.warn("Failed to load cache from localStorage:", error)
    }
  }, [chatId])

  // Save cache to localStorage when it changes
  useEffect(() => {
    if (cache.size > 0) {
      try {
        const cacheObject = Object.fromEntries(cache)
        localStorage.setItem(`chat_cache_${chatId}`, JSON.stringify(cacheObject))
      } catch (error) {
        console.warn("Failed to save cache to localStorage:", error)
      }
    }
  }, [cache, chatId])

  // Clean expired messages
  const cleanExpiredMessages = useCallback(() => {
    const now = Date.now()
    const cleanedCache = new Map<string, CachedMessage[]>()

    for (const [key, messages] of cacheRef.current) {
      const validMessages = messages.filter(msg => 
        !msg.expiresAt || new Date(msg.expiresAt).getTime() > now
      )
      
      if (validMessages.length > 0) {
        cleanedCache.set(key, validMessages)
      }
    }

    setCache(cleanedCache)
  }, [])

  // Clean expired messages periodically
  useEffect(() => {
    const interval = setInterval(cleanExpiredMessages, 60000) // Every minute
    return () => clearInterval(interval)
  }, [cleanExpiredMessages])

  // Enforce cache size limit
  const enforceSizeLimit = useCallback(() => {
    const currentCache = cacheRef.current
    let totalMessages = 0

    for (const messages of currentCache.values()) {
      totalMessages += messages.length
    }

    if (totalMessages > cacheConfig.maxSize) {
      const sortedEntries = Array.from(currentCache.entries())
        .sort(([, a], [, b]) => {
          const oldestA = Math.min(...a.map(msg => new Date(msg.cachedAt).getTime()))
          const oldestB = Math.min(...b.map(msg => new Date(msg.cachedAt).getTime()))
          return oldestA - oldestB
        })

      const newCache = new Map<string, CachedMessage[]>()
      let removedCount = 0

      for (const [key, messages] of sortedEntries) {
        if (totalMessages - removedCount <= cacheConfig.maxSize) {
          newCache.set(key, messages)
        } else {
          removedCount += messages.length
        }
      }

      setCache(newCache)
    }
  }, [cacheConfig.maxSize])

  // Enforce size limit when cache changes
  useEffect(() => {
    enforceSizeLimit()
  }, [cache, enforceSizeLimit])

  // Add messages to cache
  const addToCache = useCallback((messages: CachedMessage[]) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + cacheConfig.maxAge)

    const cachedMessages: CachedMessage[] = messages.map(msg => ({
      ...msg,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    }))

    setCache(prev => {
      const newCache = new Map(prev)
      const existing = newCache.get(chatId) || []
      const combined = [...existing, ...cachedMessages]
      
      // Remove duplicates by _id
      const unique = combined.filter((msg, index, arr) => 
        arr.findIndex(m => m._id === msg._id) === index
      )
      
      newCache.set(chatId, unique)
      return newCache
    })

    // Update stats
    setCacheStats(prev => ({
      ...prev,
      size: cacheRef.current.size
    }))
  }, [chatId, cacheConfig.maxAge])

  // Get messages from cache
  const getFromCache = useCallback((messageIds?: string[]): CachedMessage[] => {
    statsRef.current.totalRequests++
    
    const cachedMessages = cacheRef.current.get(chatId) || []
    
    let messages = cachedMessages
    if (messageIds) {
      messages = cachedMessages.filter(msg => messageIds.includes(msg._id))
    }

    if (messages.length > 0) {
      statsRef.current.hits++
    }

    const hitRate = statsRef.current.totalRequests > 0 
      ? (statsRef.current.hits / statsRef.current.totalRequests) * 100 
      : 0

    setCacheStats(prev => ({
      ...prev,
      hitRate,
      totalRequests: statsRef.current.totalRequests,
      hits: statsRef.current.hits
    }))

    return messages
  }, [chatId])

  // Remove specific messages from cache
  const removeFromCache = useCallback((messageIds: string[]) => {
    setCache(prev => {
      const newCache = new Map(prev)
      const existing = newCache.get(chatId) || []
      const filtered = existing.filter(msg => !messageIds.includes(msg._id))
      
      if (filtered.length === 0) {
        newCache.delete(chatId)
      } else {
        newCache.set(chatId, filtered)
      }
      
      return newCache
    })

    setCacheStats(prev => ({
      ...prev,
      size: cacheRef.current.size
    }))
  }, [chatId])

  // Clear entire cache for this chat
  const clearCache = useCallback(() => {
    setCache(prev => {
      const newCache = new Map(prev)
      newCache.delete(chatId)
      return newCache
    })

    setCacheStats(prev => ({
      ...prev,
      size: 0
    }))

    localStorage.removeItem(`chat_cache_${chatId}`)
  }, [chatId])

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const currentCache = cacheRef.current
    let totalMessages = 0
    let totalSize = 0

    for (const messages of currentCache.values()) {
      totalMessages += messages.length
      totalSize += JSON.stringify(messages).length
    }

    return {
      ...statsRef.current,
      totalMessages,
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      chatCount: currentCache.size
    }
  }, [])

  // Compress cache if enabled
  const compressCache = useCallback(async () => {
    if (!cacheConfig.compressionEnabled) return

    // This would implement compression logic
    // For now, just log that compression would happen
    console.log("Cache compression would happen here")
  }, [cacheConfig.compressionEnabled])

  // Encrypt cache if enabled
  const encryptCache = useCallback(async () => {
    if (!cacheConfig.encryptionEnabled) return

    // This would implement encryption logic
    // For now, just log that encryption would happen
    console.log("Cache encryption would happen here")
  }, [cacheConfig.encryptionEnabled])

  // Sync cache with server
  const syncWithServer = useCallback(async () => {
    try {
      // This would sync cached messages with server
      console.log("Cache sync would happen here")
    } catch (error) {
      console.error("Failed to sync cache with server:", error)
    }
  }, [])

  return {
    addToCache,
    getFromCache,
    removeFromCache,
    clearCache,
    getCacheStats,
    compressCache,
    encryptCache,
    syncWithServer,
    cacheStats: getCacheStats()
  }
}
