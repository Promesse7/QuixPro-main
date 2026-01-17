"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Message } from "@/models/Chat"
import { database, authenticateWithFirebase } from "@/lib/firebaseClient"
import { getCurrentUserId, getFirebaseId } from "@/lib/userUtils"
import { ref, onChildAdded, off, push, set, get } from "firebase/database"
import { useMessagePagination } from "@/hooks/useMessagePagination"
import { usePushNotifications } from "@/hooks/usePushNotifications"

interface EnrichedMessage extends Omit<Message, "senderId"> {
  sender: { _id: string; name: string; avatar?: string; image?: string; email?: string }
}

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<EnrichedMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserFirebaseId, setCurrentUserFirebaseId] = useState<string | null>(null)
  const isFetching = useRef(false)

  const pagination = useMessagePagination(50)
  const pushNotifications = usePushNotifications()

  useEffect(() => {
    async function setup() {
      if (isFetching.current) return
      isFetching.current = true

      try {
        const userId = getCurrentUserId()
        setCurrentUserId(userId)

        if (userId) {
          const firebaseId = getFirebaseId(userId)
          setCurrentUserFirebaseId(firebaseId)
          await authenticateWithFirebase(firebaseId)
        }

        // Load initial messages from Firebase
        if (conversationId && database) {
          const messagesRef = ref(database, `chats/${conversationId}/messages`)
          const snapshot = await get(messagesRef)
          const data = snapshot.val()

          if (data) {
            const messagesList = Object.entries(data).map(([_, msg]: [string, any]) => ({
              ...msg,
              sender: {
                _id: msg.senderId || msg.senderEmail, // Use unique ID if available
                name: msg.senderName || msg.senderId?.split("_")[0] || msg.senderEmail?.split("@")[0] || "Unknown",
                email: msg.senderEmail,
              },
            }))

            setMessages(messagesList)
            console.log("[v0] Initial messages loaded:", messagesList.length)
          }
        }
      } catch (err: any) {
        console.error("[v0] Setup error:", err)
        setError(err.message)
      } finally {
        isFetching.current = false
      }
    }

    setup()
  }, [conversationId])

  // Listen for new messages
  useEffect(() => {
    if (!conversationId || !database) return

    const messagesRef = ref(database, `chats/${conversationId}/messages`)

    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const newMessage = snapshot.val()

      if (newMessage) {
        const enrichedMessage: EnrichedMessage = {
          ...newMessage,
          sender: {
            _id: newMessage.senderId || newMessage.senderEmail, // Use unique ID if available
            name:
              newMessage.senderName ||
              newMessage.senderId?.split("_")[0] ||
              newMessage.senderEmail?.split("@")[0] ||
              "Unknown",
            email: newMessage.senderEmail,
          },
        }

        setMessages((prev) => {
          const exists = prev.some((m) => m._id === enrichedMessage._id)
          if (exists) return prev
          return [...prev, enrichedMessage]
        })
      }
    })

    return () => {
      off(messagesRef, "child_added", unsubscribe as any)
    }
  }, [conversationId, database])

  // Listen for typing indicators
  useEffect(() => {
    if (!conversationId || !database) return

    const typingRef = ref(database, `chats/${conversationId}/typing`)

    const unsubscribe = onChildAdded(typingRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.isTyping) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userEmail]: true,
        }))

        // Auto-clear typing after 3 seconds
        setTimeout(() => {
          setTypingUsers((prev) => {
            const updated = { ...prev }
            delete updated[data.userEmail]
            return updated
          })
        }, 3000)
      }
    })

    return () => {
      off(typingRef, "child_added", unsubscribe as any)
    }
  }, [conversationId, database])

  const sendMessage = useCallback(
    async (content: string, type = "text", metadata?: any) => {
      if (!conversationId || !database || !currentUserId) return

      try {
        const messagesRef = ref(database, `chats/${conversationId}/messages`)
        const newMessageRef = push(messagesRef)

        const messageData = {
          _id: newMessageRef.key,
          content,
          type,
          senderEmail: currentUserId,
          senderName: currentUserId.includes("@") ? currentUserId.split("@")[0] : currentUserId.split("_")[0], // Handle both email and unique ID
          senderId: getFirebaseId(currentUserId),
          createdAt: new Date().toISOString(),
          metadata,
        }

        await set(newMessageRef, messageData)

        if (pushNotifications.isSubscribed) {
          pushNotifications.sendNotification(`New message from ${messageData.senderName}`, {
            body: content.substring(0, 100),
            tag: `chat-${conversationId}`,
          })
        }

        console.log("[v0] Message sent successfully")
      } catch (err: any) {
        console.error("[v0] Error sending message:", err)
        setError(err.message)
      }
    },
    [conversationId, database, currentUserId, pushNotifications],
  )

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!conversationId || !database || !currentUserId || !currentUserFirebaseId) return

      try {
        const typingRef = ref(database, `chats/${conversationId}/typing/${currentUserFirebaseId}`)
        if (isTyping) {
          await set(typingRef, {
            userEmail: currentUserId,
            isTyping: true,
          })
        } else {
          await set(typingRef, null)
        }
      } catch (err: any) {
        console.warn("[v0] Error setting typing indicator:", err)
      }
    },
    [conversationId, database, currentUserId, currentUserFirebaseId],
  )

  return {
    messages,
    typingUsers,
    sendMessage,
    setTyping,
    error,
    currentUserId,
    pagination,
    pushNotifications,
  }
}
