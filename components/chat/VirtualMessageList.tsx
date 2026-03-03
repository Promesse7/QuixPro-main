"use client"

import React, { useRef, useEffect, useMemo, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Reply,
  MessageSquare,
  Pin,
  Edit,
  Copy,
  Share2,
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageReactions } from "./MessageReactions"
import { RichMediaEmbed } from "./RichMediaEmbed"
import { formatDistanceToNow } from "date-fns"

interface EnhancedMessage {
  _id: string
  content: string
  sender: {
    _id: string
    name: string
    avatar?: string
    email?: string
  }
  type: "text" | "image" | "file" | "math" | "voice" | "embed" | "announcement"
  metadata?: {
    fileUrl?: string
    fileName?: string
    fileType?: string
    fileSize?: number
    latex?: string
    embedUrl?: string
    embedType?: string
    duration?: number
  }
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
}

interface VirtualMessageListProps {
  messages: EnhancedMessage[]
  onReply?: (messageId: string) => void
  onThread?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  enableReactions?: boolean
  enableThreads?: boolean
  enableVirtualization?: boolean
  className?: string
}

// Message item component
const MessageItem: React.FC<{
  message: EnhancedMessage
  isCurrentUser: boolean
  onReply?: (messageId: string) => void
  onThread?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  enableReactions?: boolean
  enableThreads?: boolean
}> = ({
  message,
  isCurrentUser,
  onReply,
  onThread,
  onReaction,
  enableReactions = true,
  enableThreads = true
}) => {
    const [showActions, setShowActions] = React.useState(false)
    const [showReactions, setShowReactions] = React.useState(false)

    const formatMessageTime = useCallback((timestamp: string) => {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    }, [])

    const getDeliveryIcon = useCallback((status: string) => {
      switch (status) {
        case "sending":
          return <Clock className="w-3 h-3 text-muted-foreground" />
        case "sent":
          return <Check className="w-3 h-3 text-muted-foreground" />
        case "delivered":
          return <CheckCheck className="w-3 h-3 text-muted-foreground" />
        case "read":
          return <CheckCheck className="w-3 h-3 text-blue-500" />
        case "failed":
          return <Clock className="w-3 h-3 text-destructive" />
        default:
          return null
      }
    }, [])

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "group relative flex gap-3 p-4 hover:bg-muted/30 transition-colors",
          isCurrentUser && "flex-row-reverse"
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Avatar */}
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback className="text-xs">
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Message content */}
        <div className={cn("flex-1 max-w-[70%]", isCurrentUser && "flex-1")}>
          {/* Sender name for non-current users */}
          {!isCurrentUser && (
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {message.sender.name}
            </p>
          )}

          {/* Message bubble */}
          <div
            className={cn(
              "rounded-2xl p-3 relative",
              isCurrentUser
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted rounded-bl-sm"
            )}
          >
            {/* Pinned indicator */}
            {message.isPinned && (
              <div className="absolute -top-2 -right-2">
                <Pin className="w-3 h-3 text-primary" />
              </div>
            )}

            {/* Message content */}
            <div className="text-sm">
              {message.type === "text" && <p>{message.content}</p>}
              {message.type === "image" && message.metadata?.fileUrl && (
                <RichMediaEmbed url={message.metadata.fileUrl} type="image" />
              )}
              {message.type === "embed" && message.metadata?.embedUrl && (
                <RichMediaEmbed url={message.metadata.embedUrl} type={message.metadata.embedType as any} />
              )}
              {message.type === "file" && message.metadata?.fileUrl && (
                <RichMediaEmbed url={message.metadata.fileUrl} type="document" />
              )}
            </div>

            {/* Message metadata */}
            <div className={cn(
              "flex items-center gap-2 mt-1 text-xs",
              isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              <span>{formatMessageTime(message.createdAt)}</span>
              {message.isEdited && <span>(edited)</span>}
              {isCurrentUser && getDeliveryIcon(message.deliveryStatus)}
            </div>
          </div>

          {/* Reply preview */}
          {message.replyTo && (
            <div className="mt-1 p-2 bg-muted/50 rounded-lg border-l-2 border-primary">
              <p className="text-xs text-muted-foreground">Replying to message...</p>
            </div>
          )}

          {/* Reactions */}
          {enableReactions && message.reactions.length > 0 && (
            <div className="mt-2">
              <MessageReactions
                messageId={message._id}
                reactions={message.reactions.map(r => ({
                  ...r,
                  users: r.users.map(u => typeof u === 'string' ? { id: u, name: u } : u)
                }))}
                onAddReaction={onReaction || (() => { })}
                onRemoveReaction={onReaction || (() => { })}
                compact
              />
            </div>
          )}
        </div>

        {/* Message actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "absolute top-4 flex gap-1 p-1 bg-background border rounded-md shadow-sm z-10",
                isCurrentUser ? "-right-20" : "-left-20"
              )}
            >
              {enableThreads && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onThread?.(message._id)}
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onReply?.(message._id)}
              >
                <Reply className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

export function VirtualMessageList({
  messages,
  onReply,
  onThread,
  onReaction,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  enableReactions = true,
  enableThreads = true,
  enableVirtualization = true,
  className = ""
}: VirtualMessageListProps) {
  const { ref: loadMoreRef, inView } = useInView()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = "current" // This would come from auth context

  // Group messages by date for better UX
  const groupedMessages = useMemo(() => {
    const groups: Record<string, EnhancedMessage[]> = {}

    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Load more messages when scrolling to top
  useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="flex-1 overflow-y-auto" role="log" aria-live="polite" aria-atomic="false">
        {/* Load more trigger at top */}
        {hasMore && (
          <div ref={loadMoreRef} className="h-1" aria-hidden="true">
            {isLoading && (
              <div className="text-center text-xs text-muted-foreground py-2">
                Loading earlier messages...
              </div>
            )}
          </div>
        )}

        {/* Messages grouped by date */}
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <Separator className="flex-1" />
                <Badge variant="secondary" className="mx-2 text-xs">
                  {date === new Date().toDateString() ? "Today" :
                    date === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
                      date}
                </Badge>
                <Separator className="flex-1" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-2">
                <AnimatePresence>
                  {dateMessages.map((message) => (
                    <MessageItem
                      key={message._id}
                      message={message}
                      isCurrentUser={message.sender._id === currentUserId}
                      onReply={onReply}
                      onThread={onThread}
                      onReaction={onReaction}
                      enableReactions={enableReactions}
                      enableThreads={enableThreads}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
    </div>
  )
}
