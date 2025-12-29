"use client"

import { useState, useEffect, useCallback } from "react"
import { database } from "@/lib/firebaseClient"
import { ref, onValue, off } from "firebase/database"
import { emailToId } from "@/lib/userUtils"

export interface User {
  _id?: string
  name: string
  email: string
  image?: string
  school?: string
  level?: string
  isOnline?: boolean
}

export interface Conversation {
  _id: string
  otherUserId: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  otherUser?: User
}

export const useConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getDirectConversations",
          data: { userId },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }

      const data = await response.json()
      console.log("[v0] Conversations fetched from MongoDB:", data.conversations)
      setConversations(data.conversations || [])
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching conversations:", err)
      setError("Failed to load conversations")
      setConversations([]) // Set to empty array on error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Initial Fetch from MongoDB
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (!userId || !database) return

    const safeUserId = emailToId(userId)
    const convsRef = ref(database, `user_conversations/${safeUserId}`)

    const handleUpdate = (snapshot: any) => {
      const data = snapshot.val()
      console.log("[v0] Firebase conversations update:", data)

      if (!data) return

      // Convert Firebase data to conversation format
      const firebaseConvs = Object.entries(data).map(([otherUserId, convData]: [string, any]) => ({
        _id: otherUserId,
        otherUserId: otherUserId,
        lastMessage: convData.lastMessage || "No messages",
        lastMessageTime: convData.lastMessageTime || new Date().toISOString(),
        unreadCount: convData.unreadCount || 0,
        otherUser: {
          name: convData.otherUserName || otherUserId.replace(/[^a-zA-Z0-9@.]/g, "").split("@")[0] || "User",
          email: otherUserId,
          image: convData.otherUserImage,
          isOnline: convData.isOnline || false,
        },
      }))

      // Merge with MongoDB conversations
      setConversations((prev) => {
        const merged = [...prev]

        firebaseConvs.forEach((firebaseConv) => {
          const existingIndex = merged.findIndex((c) => c.otherUserId === firebaseConv.otherUserId)

          if (existingIndex > -1) {
            // Update existing conversation with Firebase data
            merged[existingIndex] = {
              ...merged[existingIndex],
              lastMessage: firebaseConv.lastMessage,
              lastMessageTime: firebaseConv.lastMessageTime,
              unreadCount: firebaseConv.unreadCount,
              otherUser: {
                ...merged[existingIndex].otherUser,
                isOnline: firebaseConv.otherUser?.isOnline,
              },
            }
          } else {
            // Add new conversation from Firebase
            merged.push(firebaseConv)
          }
        })

        // Sort by last message time (descending)
        return merged.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
      })
    }

    const unsubscribe = onValue(convsRef, handleUpdate, (error) => {
      console.warn("[v0] Firebase conversations listener error:", error)
    })

    return () => {
      off(convsRef, "value", handleUpdate)
    }
  }, [userId, database])

  return {
    conversations,
    isLoading,
    error,
    refreshConversations: fetchConversations,
  }
}
