"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Reply,
  MoreVertical,
  Pin,
  Copy,
  Share2,
  Trash2,
  Edit,
  Users,
  Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { MessageReactions } from "./MessageReactions"
import { RichMediaEmbed } from "./RichMediaEmbed"
import { formatDistanceToNow } from "date-fns"

interface Reaction {
  emoji: string
  users: Array<{
    id: string
    name: string
    avatar?: string
  }>
  count: number
  isFromCurrentUser: boolean
}

interface ThreadMessage {
  _id: string
  content: string
  sender: {
    _id: string
    name: string
    avatar?: string
    email?: string
  }
  type: "text" | "image" | "file" | "math" | "voice" | "embed"
  metadata?: any
  reactions: Reaction[]
  createdAt: string
  isEdited: boolean
  editedAt?: string
  isPinned: boolean
}

interface MessageThreadProps {
  threadId: string
  onClose: () => void
  enableAI?: boolean
  className?: string
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  onClose,
  enableAI = false,
  className = ""
}) => {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([])
  const [threadInfo, setThreadInfo] = useState<any>(null)
  const [showActions, setShowActions] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendMessage } = useChat(threadId)

  // Load thread messages
  useEffect(() => {
    // This would fetch thread messages from your API
    const loadThreadMessages = async () => {
      try {
        // Mock data for now
        const mockMessages: ThreadMessage[] = [
          {
            _id: "1",
            content: "This is the original message that started this thread. It's about discussing the new features we want to implement.",
            sender: {
              _id: "user1",
              name: "Alex Chen",
              avatar: "/avatars/alex.jpg"
            },
            type: "text",
            reactions: [
              { emoji: "👍", users: [{ id: "user1", name: "User 1" }, { id: "user2", name: "User 2" }], count: 2, isFromCurrentUser: false },
              { emoji: "❤️", users: [{ id: "user3", name: "User 3" }], count: 1, isFromCurrentUser: true }
            ],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isEdited: false,
            isPinned: true
          },
          {
            _id: "2",
            content: "I think we should focus on improving the chat UI first. The current design feels a bit outdated.",
            sender: {
              _id: "user2",
              name: "Sarah Johnson",
              avatar: "/avatars/sarah.jpg"
            },
            type: "text",
            reactions: [],
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            isEdited: false,
            isPinned: false
          },
          {
            _id: "3",
            content: "Great point! I especially like the idea of adding message threading and reactions. It would make conversations much more organized.",
            sender: {
              _id: "current",
              name: "You",
              avatar: "/avatars/you.jpg"
            },
            type: "text",
            reactions: [
              { emoji: "🎉", users: [{ id: "user1", name: "User 1" }], count: 1, isFromCurrentUser: false }
            ],
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            isEdited: false,
            isPinned: false
          }
        ]

        setThreadMessages(mockMessages)
        setThreadInfo({
          title: "Chat UI Improvements",
          participants: ["Alex Chen", "Sarah Johnson", "You"],
          messageCount: mockMessages.length,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        })
      } catch (error) {
        console.error("Error loading thread messages:", error)
      }
    }

    loadThreadMessages()
  }, [threadId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [threadMessages])

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(message, "text", { threadId })

      const newMessage: ThreadMessage = {
        _id: Date.now().toString(),
        content: message,
        sender: {
          _id: "current",
          name: "You",
          avatar: "/avatars/you.jpg"
        },
        type: "text",
        reactions: [],
        createdAt: new Date().toISOString(),
        isEdited: false,
        isPinned: false
      }

      setThreadMessages(prev => [...prev, newMessage])
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }, [message, isSending, sendMessage, threadId])

  const handleReaction = useCallback(async (messageId: string, emoji: string) => {
    // Handle reaction logic
    setThreadMessages(prev => prev.map(msg => {
      if (msg._id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, isFromCurrentUser: true }
                : r
            )
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: [{ id: "current", name: "Current User" }], count: 1, isFromCurrentUser: true }]
          }
        }
      }
      return msg
    }))
  }, [])

  const handleRemoveReaction = useCallback(async (messageId: string, emoji: string) => {
    // Handle reaction removal
    setThreadMessages(prev => prev.map(msg => {
      if (msg._id === messageId) {
        return {
          ...msg,
          reactions: msg.reactions.filter(r => r.emoji !== emoji)
        }
      }
      return msg
    }))
  }, [])

  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
    setShowActions(null)
  }, [])

  const formatMessageTime = useCallback((timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }, [])

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Thread Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="font-semibold">{threadInfo?.title || "Thread"}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{threadInfo?.participants?.length || 0} participants</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{threadInfo?.messageCount || 0} messages</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {enableAI && (
            <Badge variant="secondary" className="text-xs">
              AI Enhanced
            </Badge>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Thread Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {threadMessages.map((msg) => (
            <div
              key={msg._id}
              className={cn(
                "group relative",
                msg.sender._id === "current" && "ml-auto max-w-[80%]"
              )}
              onMouseEnter={() => setShowActions(msg._id)}
              onMouseLeave={() => setShowActions(null)}
            >
              {/* Message content */}
              <div className={cn(
                "rounded-lg p-3 relative",
                msg.sender._id === "current"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                {/* Pinned indicator */}
                {msg.isPinned && (
                  <div className="absolute -top-2 -right-2">
                    <Pin className="w-3 h-3 text-primary" />
                  </div>
                )}

                {/* Sender info */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={msg.sender.avatar} />
                    <AvatarFallback className="text-xs">
                      {msg.sender.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{msg.sender.name}</p>
                    <p className="text-xs opacity-70">
                      {formatMessageTime(msg.createdAt)}
                      {msg.isEdited && " (edited)"}
                    </p>
                  </div>
                </div>

                {/* Message content */}
                <div className="text-sm">
                  {msg.type === "text" && <p>{msg.content}</p>}
                  {msg.type === "image" && (
                    <img
                      src={msg.metadata?.fileUrl}
                      alt="Shared image"
                      className="rounded max-w-full"
                    />
                  )}
                  {msg.type === "embed" && (
                    <RichMediaEmbed
                      url={msg.metadata?.embedUrl}
                      type={msg.metadata?.embedType}
                    />
                  )}
                </div>

                {/* Reactions */}
                {msg.reactions.length > 0 && (
                  <div className="mt-2">
                    <MessageReactions
                      messageId={msg._id}
                      reactions={msg.reactions}
                      onAddReaction={handleReaction}
                      onRemoveReaction={handleRemoveReaction}
                      compact
                    />
                  </div>
                )}
              </div>

              {/* Message actions */}
              <AnimatePresence>
                {showActions === msg._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "absolute top-0 flex gap-1 p-1 bg-background border rounded-md shadow-sm",
                      msg.sender._id === "current" ? "-left-32" : "-right-32"
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyMessage(msg.content)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <Reply className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                    {msg.sender._id === "current" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Thread Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Reply in thread..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim() || isSending}>
            Reply
          </Button>
        </form>
      </div>
    </div>
  )
}
