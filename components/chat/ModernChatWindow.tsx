"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  Loader,
  ImageIcon,
  Paperclip,
  Heart,
  Smile,
  Mic,
  MicOff,
  Bot,
  Sparkles,
  Reply,
  MoreVertical,
  Pin,
  Search,
  Moon,
  Sun,
  Layout,
  Keyboard,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { VirtualMessageList } from "./VirtualMessageList"
import { MessageReactions } from "./MessageReactions"
import { MessageThread } from "./MessageThread"
import { RichMediaEmbed } from "./RichMediaEmbed"
import { AISuggestions } from "./AISuggestions"
import { useTheme } from "next-themes"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useMessageCache } from "@/hooks/useMessageCache"
import { useOfflineQueue } from "@/hooks/useOfflineQueue"

// Enhanced message types
interface EnhancedMessage {
  _id: string
  senderId: string
  sender: {
    _id: string
    name: string
    avatar?: string
    email?: string
  }
  content: string
  type: "text" | "image" | "file" | "math" | "voice" | "embed"
  metadata?: {
    fileUrl?: string
    fileName?: string
    fileType?: string
    fileSize?: number
    latex?: string
    embedUrl?: string
    embedType?: "youtube" | "link" | "image" | "document"
    duration?: number
  }
  reactions: Array<{
    emoji: string
    users: string[]
    count: number
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

interface ModernChatWindowProps {
  groupId: string
  className?: string
  layout?: "default" | "compact" | "focused" | "split"
  enableAI?: boolean
  enableVoice?: boolean
  enableThreads?: boolean
}

export const ModernChatWindow: React.FC<ModernChatWindowProps> = ({
  groupId,
  className = "",
  layout = "default",
  enableAI = true,
  enableVoice = true,
  enableThreads = true
}) => {
  // State management
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [threadView, setThreadView] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Hooks
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { messages, typingUsers, sendMessage, setTyping } = useChat(groupId)
  const { addToCache, removeFromCache, getFromCache } = useMessageCache(groupId)
  const { queueMessage, isOnline, queue } = useOfflineQueue()
  const { shortcuts, registerShortcut } = useKeyboardShortcuts()

  // Enhanced messages with AI processing
  const enhancedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      reactions: msg.reactions || [],
      threadId: (msg as any).threadId,
      replyTo: (msg as any).replyTo,
      isPinned: (msg as any).isPinned || false,
      isEdited: (msg as any).isEdited || false,
      deliveryStatus: (msg as any).deliveryStatus || "sent",
      read: (msg as any).read || false
    }))
  }, [messages])

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return enhancedMessages
    return enhancedMessages.filter(msg =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [enhancedMessages, searchQuery])

  // Register keyboard shortcuts
  useEffect(() => {
    registerShortcut({
      key: 'k',
      ctrlKey: true,
      action: () => setShowSearch(!showSearch),
      description: "Toggle search"
    })
    registerShortcut({
      key: '/',
      ctrlKey: true,
      action: () => setShowAISuggestions(!showAISuggestions),
      description: "Toggle AI suggestions"
    })
    registerShortcut({
      key: 'Escape',
      action: () => {
        setReplyingTo(null)
        setThreadView(null)
        setShowSearch(false)
      },
      description: "Close modals"
    })
  }, [showSearch, showAISuggestions])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [filteredMessages])

  // AI-powered suggestions
  const aiSuggestions = useMemo(() => {
    if (!enableAI || !message.trim()) return []

    const suggestions = [
      "Can you explain this in simpler terms?",
      "What are the key takeaways?",
      "Can you provide an example?",
      "How does this relate to our previous discussion?",
      "What resources would you recommend?"
    ]

    return suggestions.filter(s =>
      s.toLowerCase().includes(message.toLowerCase()) ||
      message.length < 10
    ).slice(0, 3)
  }, [message, enableAI])

  // File handling
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setPreviewUrl(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    }
  }, [])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // Voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)

        await sendMessage("Voice message", "voice", {
          fileUrl: audioUrl,
          duration: 0 // Would calculate actual duration
        })

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }, [sendMessage])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  // Message sending with offline support
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !selectedFile) || isSending) return

    setIsSending(true)
    try {
      const messageData: any = {
        content: message,
        replyTo: replyingTo,
        threadId: threadView
      }

      if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile)
        const messageType = selectedFile.type.startsWith("image/") ? "image" : "file"
        messageData.type = messageType
        messageData.metadata = {
          fileUrl,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size
        }
        clearFile()
      }

      if (isOnline) {
        await sendMessage(messageData.content, messageData.type || "text", messageData.metadata)
        addToCache([{ ...messageData, _id: Date.now().toString(), createdAt: new Date().toISOString() }])
      } else {
        queueMessage({
          ...messageData,
          chatId: groupId,
          priority: "normal"
        })
      }

      setMessage("")
      setReplyingTo(null)
      setIsTyping(false)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }, [message, selectedFile, isSending, replyingTo, threadView, isOnline, sendMessage, addToCache, queueMessage, clearFile])

  // Layout classes
  const layoutClasses = useMemo(() => {
    switch (layout) {
      case "compact":
        return "max-w-2xl mx-auto"
      case "focused":
        return "max-w-4xl mx-auto"
      case "split":
        return "grid grid-cols-2 gap-4"
      default:
        return ""
    }
  }, [layout])

  return (
    <div className={cn("flex flex-col h-full bg-background", layoutClasses, className)}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">AI-Enhanced Chat</h2>
          {enableAI && <Badge variant="secondary" className="text-xs">AI Active</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Layout switcher */}
          <Button variant="ghost" size="icon">
            <Layout className="w-4 h-4" />
          </Button>

          {/* Keyboard shortcuts */}
          <Button variant="ghost" size="icon">
            <Keyboard className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b p-4"
          >
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        {threadView ? (
          <MessageThread
            threadId={threadView}
            onClose={() => setThreadView(null)}
            enableAI={enableAI}
          />
        ) : (
          <VirtualMessageList
            messages={filteredMessages.map(msg => ({
              ...msg,
              _id: msg._id?.toString() || Date.now().toString(),
              type: (msg.type === "system" || msg.type === "announcement") ? "text" : msg.type,
              createdAt: typeof msg.createdAt === 'object' ? msg.createdAt.toISOString() : msg.createdAt,
              reactions: Array.isArray(msg.reactions)
                ? msg.reactions.map((r: any) => ({
                  emoji: r.emoji || r,
                  users: Array.isArray(r.users)
                    ? r.users.map((u: any) => typeof u === 'string' ? { id: u, name: u } : u)
                    : [{ id: "current", name: "Current User" }],
                  count: r.count || 1,
                  isFromCurrentUser: r.isFromCurrentUser || false
                }))
                : []
            }))}
            onReply={(messageId) => setReplyingTo(messageId)}
            onThread={(messageId) => setThreadView(messageId)}
            onReaction={async (messageId, emoji) => {
              // Handle reaction logic
            }}
            enableReactions={true}
            enableThreads={enableThreads}
          />
        )}
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showAISuggestions && aiSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply preview */}
      {replyingTo && (
        <div className="border-t p-2 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Reply className="w-4 h-4" />
              Replying to message...
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* File preview */}
      {selectedFile && previewUrl && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message... (Ctrl+K for search, Ctrl+/ for AI)"
              className="resize-none"
              onFocus={() => setShowAISuggestions(true)}
              onBlur={() => setTimeout(() => setShowAISuggestions(false), 200)}
            />
          </div>

          {/* File attachment */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Voice recording */}
          {enableVoice && (
            <Button
              type="button"
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}

          {/* Send button */}
          <Button
            type="submit"
            disabled={(!message.trim() && !selectedFile) || isSending}
            size="icon"
          >
            {isSending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Typing indicator */}
      {typingUsers && Object.keys(typingUsers).length > 0 && (
        <div className="border-t p-2">
          <p className="text-xs text-muted-foreground">
            {Object.values(typingUsers).join(", ")} is typing...
          </p>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="border-t p-2 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Offline - Messages will be sent when connection is restored
          </p>
        </div>
      )}
    </div>
  )
}
