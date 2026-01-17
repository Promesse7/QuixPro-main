"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import type { Message } from "@/models/Chat"

interface VirtualMessageListProps {
  messages: Message[]
  currentUserId: string
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  renderMessage: (message: Message, isCurrentUser: boolean) => React.ReactNode
}

export function VirtualMessageList({
  messages,
  currentUserId,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  renderMessage,
}: VirtualMessageListProps) {
  const { ref: loadMoreRef, inView } = useInView()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  return (
    <div className="flex flex-col h-full overflow-y-auto" role="log" aria-live="polite" aria-atomic="false">
      {/* Load more trigger at top */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-1" aria-hidden="true">
          {isLoading && (
            <div className="text-center text-xs text-muted-foreground py-2">Loading earlier messages...</div>
          )}
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message._id?.toString() || index} role="article">
              {renderMessage(message, message.sender?._id === currentUserId)}
            </div>
          ))
        )}
      </div>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  )
}
