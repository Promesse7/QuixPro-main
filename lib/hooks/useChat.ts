"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Message } from "@/models/Chat"
import { database, authenticateWithFirebase } from "@/lib/firebaseClient"
import { getCurrentUserId } from "@/lib/userUtils"
import { ref, onValue, onChildAdded, off } from "firebase/database"

interface EnrichedMessage extends Omit<Message, "senderId"> {
  sender: { _id: string; name: string; avatar?: string; image?: string }
}

const userCache = new Map<string, any>()

async function fetchUsers(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter((id) => !userCache.has(id)))]
  if (uniqueIds.length === 0) return

  try {
    const response = await fetch(`/api/users?ids=${uniqueIds.join(",")}`)
    if (!response.ok) throw new Error("Failed to fetch user data")
    const users = await response.json()
    users.forEach((user: any) => userCache.set(user._id, user))
  } catch (error) {
    console.error("[v0] Error fetching user data:", error)
  }
}

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<EnrichedMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const isFetching = useRef(false)

  const enrichMessages = async (messages: Message[]): Promise<EnrichedMessage[]> => {
    const senderIds = messages.map((m) => m.senderId)
    await fetchUsers(senderIds)
    return messages.map((msg) => ({
      ...msg,
      sender: userCache.get(msg.senderId) || { _id: msg.senderId, name: "Unknown User" },
    }))
  }

  useEffect(() => {
    async function setup() {
      if (isFetching.current) return
      isFetching.current = true
      try {
        const userId = getCurrentUserId()
        if (userId) {
          await authenticateWithFirebase(userId)
        }

        // Fetch initial messages from MongoDB
        const response = await fetch(`/api/groups/${groupId}/messages`)
        if (!response.ok) throw new Error("Failed to fetch initial messages")
        const data = await response.json()

        const enriched = await enrichMessages(data.messages || [])
        setMessages(enriched)
        console.log("[v0] Initial messages loaded:", enriched.length)
      } catch (err: any) {
        console.error("[v0] Error fetching initial messages:", err)
        setError(err.message)
      } finally {
        isFetching.current = false
      }
    }

    if (groupId) setup()
  }, [groupId])

  useEffect(() => {
    if (!groupId || !database) return

    // Listen for NEW messages from Firebase (using onChildAdded)
    const messagesRef = ref(database, `messages/${groupId}`)
    const unsubscribeFromMessages = onChildAdded(
      messagesRef,
      async (snapshot) => {
        const newMessage = snapshot.val()
        console.log("[v0] New message received:", newMessage)

        if (newMessage && newMessage._id) {
          // Check if message already exists to avoid duplicates
          setMessages((prevMessages) => {
            const exists = prevMessages.some((m) => m._id === newMessage._id)
            if (exists) return prevMessages

            // Enrich new message with user data
            enrichMessages([newMessage]).then((enriched) => {
              setMessages((prev) => [...prev, enriched[0]])
            })

            return prevMessages
          })
        }
      },
      (error) => {
        console.error("[v0] Firebase messages listener error:", error)
      },
    )

    const typingRef = ref(database, `typingIndicators/${groupId}`)
    const unsubscribeFromTyping = onValue(
      typingRef,
      (snapshot) => {
        const typingData = snapshot.val() || {}
        const newTypingUsers = Object.entries(typingData)
          .filter(([_, data]: [string, any]) => data?.isTyping === true)
          .reduce((acc, [userId]) => ({ ...acc, [userId]: true }), {} as Record<string, boolean>)

        setTypingUsers(newTypingUsers)
      },
      (error) => {
        console.warn("[v0] Firebase typing listener error:", error)
      },
    )

    return () => {
      off(messagesRef, "child_added", unsubscribeFromMessages as any)
      off(typingRef, "value", unsubscribeFromTyping as any)
    }
  }, [groupId, database])

  const sendMessage = useCallback(
    async (content: string, type = "text", metadata?: any) => {
      if (!groupId) return
      try {
        const response = await fetch(`/api/groups/${groupId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, type, metadata }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        console.log("[v0] Message sent successfully")
      } catch (err: any) {
        console.error("[v0] Error sending message:", err)
        setError(err.message)
      }
    },
    [groupId],
  )

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!groupId) return
      try {
        await fetch(`/api/groups/${groupId}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isTyping }),
        })
      } catch (err: any) {
        console.warn("[v0] Error setting typing indicator:", err)
      }
    },
    [groupId],
  )

  return { messages, typingUsers, sendMessage, setTyping, error }
}
