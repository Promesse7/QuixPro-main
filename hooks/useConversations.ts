"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebaseClient"
import { ref, onValue, off } from "firebase/database"
import { getFirebaseId } from "@/lib/userUtils"

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
  otherUserEmail: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  otherUser?: User
}

export const useConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !database) {
      setIsLoading(false)
      return
    }

    const firebaseId = getFirebaseId(userId)
    const conversationsRef = ref(database, `user_conversations/${firebaseId}`)

    console.log("[v0] Setting up conversations listener for:", userId, "Firebase ID:", firebaseId)

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        const data = snapshot.val()
        console.log("[v0] Conversations snapshot:", data)

        if (!data) {
          setConversations([])
          setIsLoading(false)
          return
        }

        const conversationList: Conversation[] = Object.entries(data).map(
          ([otherUserEmail, convData]: [string, any]) => ({
            _id: otherUserEmail,
            otherUserId: otherUserEmail,
            otherUserEmail: otherUserEmail,
            lastMessage: convData.lastMessage || "No messages yet",
            lastMessageTime: convData.lastMessageTime || new Date().toISOString(),
            unreadCount: convData.unreadCount || 0,
            otherUser: {
              name: convData.otherUserName || otherUserEmail.split("@")[0] || "User",
              email: otherUserEmail,
              image: convData.otherUserImage,
              isOnline: convData.isOnline || false,
              school: convData.school,
              level: convData.level,
            },
          }),
        )

        // Sort by last message time
        conversationList.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

        setConversations(conversationList)
        setIsLoading(false)
      },
      (err) => {
        console.error("[v0] Conversations listener error:", err)
        setError(err.message)
        setIsLoading(false)
      },
    )

    return () => {
      off(conversationsRef, "value", unsubscribe as any)
    }
  }, [userId, database])

  return {
    conversations,
    isLoading,
    error,
  }
}
