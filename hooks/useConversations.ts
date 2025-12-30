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
      console.log("[v0] useConversations - Missing userId or database:", { userId, database: !!database })
      setIsLoading(false)
      return
    }

    const normalizedUserId = getFirebaseId(userId)
    console.log("[v0] useConversations setup:", {
      originalUserId: userId,
      normalizedUserId,
      dbInitialized: !!database,
      timestamp: new Date().toISOString(),
    })

    const conversationsRef = ref(database, `user_conversations/${normalizedUserId}`)

    console.log("[v0] Firebase path being used:", `user_conversations/${normalizedUserId}`)

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        console.log("[v0] Conversations Firebase snapshot:", {
          exists: snapshot.exists(),
          key: snapshot.key,
          size: snapshot.size,
          path: `user_conversations/${normalizedUserId}`,
          timestamp: new Date().toISOString(),
        })

        const data = snapshot.val()
        console.log("[v0] Raw conversations data:", {
          data,
          dataKeys: data ? Object.keys(data) : [],
          normalizedUserId,
        })

        if (!data) {
          console.log("[v0] No conversations found in Firebase")
          setConversations([])
          setIsLoading(false)
          return
        }

        const conversationList: Conversation[] = Object.entries(data).map(([firebaseId, convData]: [string, any]) => {
          console.log("[v0] Processing conversation:", {
            firebaseId,
            convData,
            hasEmail: !!convData.otherUserEmail,
          })

          const email = convData.otherUserEmail || firebaseId
          const name = convData.otherUserName || email.split("@")[0] || "User"

          return {
            _id: firebaseId,
            otherUserId: firebaseId,
            otherUserEmail: email,
            lastMessage: convData.lastMessage || "No messages yet",
            lastMessageTime: convData.lastMessageTime || new Date().toISOString(),
            unreadCount: convData.unreadCount || 0,
            otherUser: {
              name: name,
              email: email,
              image: convData.otherUserImage,
              isOnline: convData.isOnline || false,
              school: convData.school,
              level: convData.level,
            },
          }
        })

        conversationList.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

        console.log("[v0] Conversations transformed:", {
          count: conversationList.length,
          normalizedUserId,
          conversations: conversationList.map((c) => ({
            _id: c._id,
            otherUserEmail: c.otherUserEmail,
            lastMessage: c.lastMessage,
          })),
        })

        setConversations(conversationList)
        setIsLoading(false)
      },
      (err) => {
        console.error("[v0] Conversations Firebase error:", {
          code: err.code,
          message: err.message,
          normalizedUserId,
          originalUserId: userId,
          path: `user_conversations/${normalizedUserId}`,
        })
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
