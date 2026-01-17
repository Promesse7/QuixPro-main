"use client"

import { useState, useCallback } from "react"

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "✨", "🎉"]

export function useMessageReactions() {
  const [reactions, setReactions] = useState<Record<string, Record<string, string[]>>>({})

  const addReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setReactions((prev) => {
      const messageReactions = prev[messageId] || {}
      const emojiUsers = messageReactions[emoji] || []

      return {
        ...prev,
        [messageId]: {
          ...messageReactions,
          [emoji]: emojiUsers.includes(userId) ? emojiUsers.filter((id) => id !== userId) : [...emojiUsers, userId],
        },
      }
    })
  }, [])

  const removeReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setReactions((prev) => {
      const messageReactions = prev[messageId] || {}
      const emojiUsers = messageReactions[emoji] || []

      return {
        ...prev,
        [messageId]: {
          ...messageReactions,
          [emoji]: emojiUsers.filter((id) => id !== userId),
        },
      }
    })
  }, [])

  const getMessageReactions = useCallback(
    (messageId: string) => {
      return reactions[messageId] || {}
    },
    [reactions],
  )

  return {
    reactions,
    addReaction,
    removeReaction,
    getMessageReactions,
    EMOJI_REACTIONS,
  }
}
