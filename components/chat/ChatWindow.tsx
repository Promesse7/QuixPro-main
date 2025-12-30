"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MathInput } from "@/components/math/MathInput"
import { Button } from "@/components/ui/button"
import { Send, Loader, ImageIcon, Paperclip, Heart } from "lucide-react"
import { LovedOnesManager } from "@/lib/lovedOnes"
import { getCurrentUserId } from "@/lib/userUtils"

interface ChatWindowProps {
  groupId: string
  className?: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId, className = "" }) => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMathMode, setIsMathMode] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const _sessionHook = useSession()
  const session = _sessionHook?.data
  const userEmail = session?.user?.email
  const currentUserId = getCurrentUserId()

  const { messages, typingUsers, sendMessage, setTyping } = useChat(groupId)

  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] ChatWindow initialized:", {
      groupId,
      userEmail,
      currentUserId,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    })
  }, [])

  useEffect(() => {
    console.log("[v0] Messages updated:", {
      count: messages.length,
      groupId,
      currentUserId,
      messages: messages.map((m) => ({
        _id: m._id,
        senderId: m.senderId,
        senderName: m.sender?.name,
        currentUserMatch: m.senderId === currentUserId,
        isFromCurrent: m.senderId === currentUserId,
      })),
      timestamp: new Date().toISOString(),
    })
  }, [messages, groupId, currentUserId])

  const addToLovedOnes = (user: { email: string; name: string; image?: string }) => {
    LovedOnesManager.addLovedOne({
      id: user.email,
      email: user.email,
      name: user.name,
      avatar: user.image,
      specialColor: "#ff69b4",
    })
    setDeliveryStatus(`${user.name} added to loved ones 💕`)
    setTimeout(() => setDeliveryStatus(null), 3000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    // For now, return a placeholder URL. In production, you'd upload to a service like Cloudinary, AWS S3, etc.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !selectedFile) || isSending) return

    setIsSending(true)
    try {
      if (selectedFile) {
        const fileUrl = await uploadFile(selectedFile)
        const messageType = selectedFile.type.startsWith("image/") ? "image" : "file"
        await sendMessage(message || `Shared ${selectedFile.name}`, messageType, {
          fileUrl,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        })
        clearFile()
      } else if (isMathMode) {
        await sendMessage(message, "math", { latex: message })
      } else {
        await sendMessage(message)
      }
      setMessage("")
      setTyping(false)
      setIsTyping(false)
      setDeliveryStatus("Message sent")
      setTimeout(() => setDeliveryStatus(null), 3000)
    } catch (error) {
      console.error("[v0] Error submitting message:", error)
      setDeliveryStatus("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = () => {
    if (!isTyping) {
      setTyping(true)
      setIsTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false)
      setIsTyping(false)
    }, 2000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const getTypingText = () => {
    const typingUserIds = Object.entries(typingUsers)
      .filter(([_, isTyping]) => isTyping)
      .map(([userId]) => userId)

    if (typingUserIds.length === 0) return null
    if (typingUserIds.length === 1) return `${typingUserIds[0]} is typing...`
    if (typingUserIds.length < 4) return `${typingUserIds.length} people are typing...`
    return "Several people are typing..."
  }

  const MathPreview: React.FC<{ latex: string }> = ({ latex }) => {
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
      let mounted = true
      ;(async () => {
        try {
          const katex = await import("katex")
          if (!mounted) return
          const rendered = katex.renderToString(latex || "", { throwOnError: false })
          setHtml(rendered)
        } catch (err) {
          setHtml(null)
        }
      })()
      return () => {
        mounted = false
      }
    }, [latex])

    if (html) return <div dangerouslySetInnerHTML={{ __html: html }} />
    return <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{latex}</pre>
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-atomic="false">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isLovedOne = msg.sender?.email && LovedOnesManager.isLovedOne(msg.sender.email)
              const lovedOneInfo = msg.sender?.email ? LovedOnesManager.getLovedOne(msg.sender.email) : null
              const isSentByCurrentUser = msg.senderId === currentUserId

              return (
                <div
                  key={msg._id}
                  className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                  role="article"
                  aria-label={`${msg.sender?.name || "User"} message at ${new Date(msg.createdAt).toLocaleTimeString()}`}
                >
                  <div className={`flex max-w-[80%] space-x-2 ${isSentByCurrentUser ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8 relative">
                      <AvatarImage src={msg.sender?.image || msg.sender?.avatar} alt={msg.sender?.name} />
                      <AvatarFallback>{msg.sender?.name?.charAt(0) || "U"}</AvatarFallback>
                      {isLovedOne && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5">
                          <Heart className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isSentByCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      } ${isLovedOne ? "ring-2 ring-pink-300 ring-opacity-50" : ""}`}
                    >
                      {isLovedOne && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Heart className="h-3 w-3 text-pink-500 fill-pink-500" />
                          <span className="text-xs text-pink-600 font-medium">Loved One 💕</span>
                        </div>
                      )}
                      {msg.type === "math" ? (
                        <MathPreview latex={msg.content} />
                      ) : msg.type === "image" ? (
                        <img
                          src={msg.content || "/placeholder.svg"}
                          alt="Shared image"
                          className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(msg.content, "_blank")}
                        />
                      ) : msg.type === "file" ? (
                        <div className="flex items-center space-x-2 p-2 bg-background/50 rounded">
                          <span className="text-sm">📎</span>
                          <div className="flex-1">
                            <p className="text-sm truncate">{msg.metadata?.fileName || "File"}</p>
                            {msg.metadata?.fileSize && (
                              <p className="text-xs text-muted-foreground">
                                {(msg.metadata.fileSize / 1024).toFixed(1)} KB
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          isSentByCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!isSentByCurrentUser && msg.sender?.email && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          addToLovedOnes({
                            email: msg.sender!.email,
                            name: msg.sender!.name || "Unknown",
                            image: msg.sender?.image,
                          })
                        }
                        className={`h-8 w-8 p-0 ${isLovedOne ? "text-pink-500" : "text-gray-400"}`}
                        title={isLovedOne ? "Already in loved ones" : "Add to loved ones"}
                      >
                        <Heart className={`h-4 w-4 ${isLovedOne ? "fill-current" : ""}`} />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground mb-2 h-4">{getTypingText()}</div>
        <div className="sr-only" aria-live="polite">
          {getTypingText() || ""}
        </div>
        <div className="sr-only" aria-live="polite">
          {deliveryStatus || ""}
        </div>

        {/* File Preview */}
        {previewUrl && (
          <div className="mb-2 p-2 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-16 w-16 object-cover rounded" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile && `${(selectedFile.size / 1024).toFixed(1)} KB`}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearFile}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1">
            {isMathMode ? (
              <MathInput value={message} onChange={(val) => setMessage(val || "")} />
            ) : (
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1"
                disabled={isSending}
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex space-x-1">
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                className="p-2.5"
                disabled={isSending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Send image"
                className="p-2.5"
                disabled={isSending}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-1">
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                title="Send message"
                className="p-2.5"
                disabled={isSending}
              >
                {isSending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                size="icon"
                onClick={() => setIsMathMode((s) => !s)}
                title={isMathMode ? "Switch to text" : "Switch to math"}
                aria-pressed={isMathMode}
                aria-label={isMathMode ? "Switch to text mode" : "Switch to math mode"}
                className="p-2.5"
              >
                <span aria-hidden className="text-sm">
                  Σ
                </span>
              </Button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
