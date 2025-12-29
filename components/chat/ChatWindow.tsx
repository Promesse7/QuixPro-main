"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MathInput } from "@/components/math/MathInput"
import { Button } from "@/components/ui/button"
import { Send, Loader } from "lucide-react"

interface ChatWindowProps {
  groupId: string
  className?: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId, className = "" }) => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMathMode, setIsMathMode] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const _sessionHook = useSession()
  const session = _sessionHook?.data
  const userEmail = session?.user?.email

  const { messages, typingUsers, sendMessage, setTyping, currentUserId } = useChat(groupId)

  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      if (isMathMode) {
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
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId || msg._id === currentUserId ? "justify-end" : "justify-start"}`}
                role="article"
                aria-label={`${msg.sender?.name || "User"} message at ${new Date(msg.createdAt).toLocaleTimeString()}`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2 ${msg.senderId === currentUserId ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender?.image || msg.sender?.avatar} alt={msg.sender?.name} />
                    <AvatarFallback>{msg.sender?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.senderId === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.type === "math" ? (
                      <MathPreview latex={msg.content} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
