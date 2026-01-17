"use client"

import { useState, useCallback } from "react"
import type { Message } from "@/models/Chat"

interface ReplyState {
  replyingTo: Message | null
  replyContent: string
}

export function useMessageReplies() {
  const [replyState, setReplyState] = useState<ReplyState>({
    replyingTo: null,
    replyContent: "",
  })

  const startReply = useCallback((message: Message) => {
    setReplyState((prev) => ({
      ...prev,
      replyingTo: message,
    }))
  }, [])

  const cancelReply = useCallback(() => {
    setReplyState({
      replyingTo: null,
      replyContent: "",
    })
  }, [])

  const setReplyContent = useCallback((content: string) => {
    setReplyState((prev) => ({
      ...prev,
      replyContent: content,
    }))
  }, [])

  const createReplyMessage = useCallback(
    (message: Message): Partial<Message> => ({
      ...message,
      replyTo: replyState.replyingTo?._id?.toString(),
    }),
    [replyState.replyingTo],
  )

  return {
    replyingTo: replyState.replyingTo,
    replyContent: replyState.replyContent,
    startReply,
    cancelReply,
    setReplyContent,
    createReplyMessage,
  }
}
