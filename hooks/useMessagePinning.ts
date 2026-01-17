"use client"

import { useState, useCallback } from "react"
import type { Message } from "@/models/Chat"

interface PinningState {
  pinnedMessages: Message[]
  isPinning: boolean
}

export function useMessagePinning() {
  const [state, setState] = useState<PinningState>({
    pinnedMessages: [],
    isPinning: false,
  })

  const togglePin = useCallback(async (message: Message, userId: string) => {
    setState((prev) => ({ ...prev, isPinning: true }))
    try {
      const isPinned = message.isPinned
      const updatedMessage = {
        ...message,
        isPinned: !isPinned,
        pinnedBy: !isPinned ? userId : undefined,
        pinnedAt: !isPinned ? new Date() : undefined,
      }

      // Update pinned messages list
      setState((prev) => ({
        isPinning: false,
        pinnedMessages: !isPinned
          ? [...prev.pinnedMessages, updatedMessage]
          : prev.pinnedMessages.filter((m) => m._id !== message._id),
      }))

      return updatedMessage
    } catch (error) {
      console.error("[v0] Error pinning message:", error)
      setState((prev) => ({ ...prev, isPinning: false }))
      throw error
    }
  }, [])

  const loadPinnedMessages = useCallback((messages: Message[]) => {
    const pinned = messages.filter((m) => m.isPinned)
    setState((prev) => ({ ...prev, pinnedMessages: pinned }))
  }, [])

  return {
    pinnedMessages: state.pinnedMessages,
    isPinning: state.isPinning,
    togglePin,
    loadPinnedMessages,
  }
}
