"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, ArrowLeft, Phone, Video, MoreVertical, MessageCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import MessageList from '@/components/chat/MessageList'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessagesNative'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useTypingIndicator } from '@/hooks/useTypingIndicatorNative'
import { getCurrentUserWithId, getCurrentUserId, getFirebaseId, ensureCurrentUserUniqueId } from '@/lib/userUtils'
import { database } from '@/lib/firebaseClient'
import { MathInput } from '@/components/math/MathInput'

interface Message {
  _id: string
  senderId: string
  recipientId: string
  senderEmail?: string
  senderName?: string
  recipientEmail?: string
  content: string
  type: string
  createdAt: string
  read: boolean
}

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  school: string
  level: string
  isOnline?: boolean
}

export default function DirectChatPage() {
  const params = useParams()
  const router = useRouter()
  const urlUserId = params?.id as string

  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [showMathKeyboard, setShowMathKeyboard] = useState(false)

  // Mobile sidebar toggle
  const [showSidebar, setShowSidebar] = useState(false)

  // Ensure current user has unique ID
  const currentUserEmail = getCurrentUser()?.email || 'unknown@example.com'
  const currentUserId = ensureCurrentUserUniqueId(currentUserEmail, getCurrentUser()?.name)
  
  // Get current user with ID
  const currentUser = getCurrentUserWithId(currentUserId)

  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Convert URL email to user ID (handle both email and MongoDB ObjectId)
  const decodedEmail = decodeURIComponent(urlUserId)
  let otherUserId: string

  // Check if the URL parameter is an email or already a MongoDB ObjectId
  if (decodedEmail.includes('@')) {
    // It's an email, convert to MongoDB ObjectId (would need lookup in production)
    // For now, use the emailToId mapping for compatibility
    otherUserId = getFirebaseId(decodedEmail)
  } else {
    // It's already an ID (MongoDB ObjectId or Firebase-safe ID)
    otherUserId = decodedEmail
  }

  // Real-time messaging (Firebase Native)
  const { messages, loading, sendMessage: sendRealtimeMessage, conversationId } = useRealtimeMessages(otherUserId)

  // Real-time online status
  const { isOnline, lastSeenText, loading: statusLoading } = useOnlineStatus(otherUserId)

  // Typing indicator (Firebase Native)
  const { setTyping, isSomeoneTyping, getTypingUsersArray } = useTypingIndicator(conversationId || '')

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Load other user info only
    loadOtherUser()
  }, [urlUserId])

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const success = await sendRealtimeMessage(newMessage.trim())

      if (success) {
        setNewMessage('')
        setTyping(false) // Stop typing indicator when message is sent
      } else {
        console.error('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleTypingChange = (value: string) => {
    setNewMessage(value)
    // Set typing indicator when user starts typing
    if (value.trim()) {
      setTyping(true)
    } else {
      setTyping(false)
    }
  }

  const loadOtherUser = async () => {
    try {
      setUserLoading(true)

      // Create a fallback user immediately to prevent long loading
      const fallbackUser: User = {
        _id: otherUserId,
        name: decodedEmail.split('@')[0] || 'User',
        email: decodedEmail,
        school: 'Unknown',
        level: 'Unknown',
        isOnline: false
      }
      setOtherUser(fallbackUser)

      // Skip MongoDB API calls - use Firebase data only
      // The conversation list will provide user details when available

    } catch (error) {
      console.error('Failed to load user info:', error)
    } finally {
      setUserLoading(false)
    }
  }

  // Decoded active ID for rendering the list active state
  const activeId = decodeURIComponent(otherUserId);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link href="/chat">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>

            {otherUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {otherUser.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{otherUser.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {!statusLoading && isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    <p className="text-xs text-muted-foreground">
                      {statusLoading ? 'Loading...' : isOnline ? 'Online' : lastSeenText ? `Last seen ${lastSeenText}` : 'Offline'} • {otherUser.level}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" title="Audio Call">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Video Call">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" title="More Options">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-muted-foreground mt-10">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
              <MessageCircle className="w-16 h-16 mb-4" />
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          {/* Typing Indicator */}
          {isSomeoneTyping && (
            <div className="mb-2 text-sm text-muted-foreground italic">
              {getTypingUsersArray().join(', ')} is typing...
            </div>
          )}
          
          {showMathKeyboard ? (
            <div className="mb-3">
              <MathInput
                value={newMessage}
                onChange={handleTypingChange}
                placeholder="Enter math expression..."
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setShowMathKeyboard(false)} variant="outline" size="sm">
                  Close
                </Button>
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="sm">
                  Send Math
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center max-w-4xl mx-auto w-full">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => handleTypingChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 rounded-full px-4"
              />
              <Button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                size="icon"
                className="rounded-full w-10 h-10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowMathKeyboard(true)}
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 shrink-0"
                title="Open Math Keyboard"
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
