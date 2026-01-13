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
import { cn } from "@/lib/utils"

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
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const _sessionHook = useSession()
  const session = _sessionHook?.data
  const userEmail = session?.user?.email
  const currentUserId = getCurrentUserId()
  const { messages, typingUsers, sendMessage, setTyping } = useChat(groupId)

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
        senderId: m.sender?._id,
        senderName: m.sender?.name,
        currentUserMatch: m.sender?._id === currentUserId,
        isFromCurrent: m.sender?._id === currentUserId,
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
        ; (async () => {
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
            {messages.map((msg, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null
              const isSameSender = prevMsg?.sender?._id === msg.sender?._id
              const isLovedOne = msg.sender?.email && LovedOnesManager.isLovedOne(msg.sender.email)
              const isSentByCurrentUser = msg.sender?._id === currentUserId

              return (
                <div
                  key={msg._id?.toString() || index}
                  className={cn(
                    "flex flex-col group transition-all duration-300 animate-in fade-in slide-in-from-bottom-1",
                    msg.sender?._id === currentUserId ? "items-end" : "items-start",
                    !isSameSender && "mt-6"
                  )}
                >
                  {!isSameSender && msg.sender?._id !== currentUserId && (
                    <span className="text-[10px] font-bold text-muted-foreground/60 mb-1.5 ml-11 uppercase tracking-widest">
                      {msg.sender?.name || "Peer"}
                    </span>
                  )}

                  <div className={cn(
                    "flex max-w-[85%] sm:max-w-[75%] gap-2.5",
                    msg.sender?._id === currentUserId ? "flex-row-reverse" : "flex-row"
                  )}>
                    {!isSameSender ? (
                      <Avatar className="h-8 w-8 shrink-0 shadow-sm border border-border/50 transition-transform hover:scale-105">
                        <AvatarImage src={msg.sender?.image || msg.sender?.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                          {msg.sender?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 shrink-0" />
                    )}

                    <div className="flex flex-col space-y-1">
                      <div
                        className={cn(
                          "relative px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all",
                          msg.sender?._id === currentUserId
                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                            : "bg-card border border-border/40 text-foreground rounded-tl-none",
                          isLovedOne && "ring-2 ring-pink-400/30"
                        )}
                      >
                        {isLovedOne && !isSameSender && (
                          <div className="flex items-center gap-1 mb-1 opacity-80">
                            <Heart className="h-2.5 w-2.5 fill-pink-500 text-pink-500" />
                            <span className="text-[9px] font-black text-pink-500 uppercase">Loved One</span>
                          </div>
                        )}

                        {msg.type === "math" ? (
                          <MathPreview latex={msg.content} />
                        ) : msg.type === "image" ? (
                          <div className="rounded-xl overflow-hidden border border-border/20">
                            <img
                              src={msg.content || "/placeholder.svg"}
                              alt="Shared image"
                              className="max-w-full cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(msg.content, "_blank")}
                            />
                          </div>
                        ) : msg.type === "file" ? (
                          <div className="flex items-center gap-3 p-2 bg-background/40 rounded-xl border border-border/20">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{msg.metadata?.fileName || "File"}</p>
                              {msg.metadata?.fileSize && (
                                <p className="text-[10px] opacity-60 font-medium">
                                  {(msg.metadata.fileSize / 1024).toFixed(1)} KB
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}

                        <div className={cn(
                          "flex items-center gap-1 justify-end mt-1 text-[9px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-60 transition-opacity",
                          msg.sender?._id === currentUserId ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    {msg.sender?._id !== currentUserId && !isSameSender && msg.sender?.email && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => addToLovedOnes({
                          email: msg.sender?.email || "",
                          name: msg.sender?.name || "Unknown",
                          image: msg.sender?.image || msg.sender?.avatar,
                        })}
                        className={cn(
                          "h-6 w-6 p-0 self-center opacity-0 group-hover:opacity-100 transition-opacity",
                          isLovedOne ? "text-pink-500 hover:text-pink-600" : "text-muted-foreground/40 hover:text-pink-400"
                        )}
                      >
                        <Heart className={cn("h-3.5 w-3.5", isLovedOne && "fill-current")} />
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

      <div className="p-4 bg-background/60 backdrop-blur-xl border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-bold text-primary/70 mb-2 h-4 px-2 tracking-widest uppercase animate-pulse">
            {getTypingText()}
          </div>

          <div className="flex items-end gap-2 px-1">
            <div className="flex items-center gap-1 pb-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                disabled={isSending}
              >
                <Paperclip className="h-4.5 w-4.5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />

              <div className="relative flex items-center bg-muted/30 border border-border/40 focus-within:border-primary/40 rounded-2xl transition-all">
                {isMathMode ? (
                  <div className="flex-1 min-h-[44px] p-2">
                    <MathInput value={message} onChange={(val) => setMessage(val || "")} />
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 h-11 border-none bg-transparent focus-visible:ring-0 px-4 text-sm font-medium"
                    disabled={isSending}
                  />
                )}

                <div className="flex items-center gap-1 pr-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsMathMode((s) => !s)}
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      isMathMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <span className="text-xs font-black italic">Σ</span>
                  </Button>

                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSending || (!message.trim() && !selectedFile)}
                    className="h-8 w-8 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105"
                  >
                    {isSending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
