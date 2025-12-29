"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, User, Phone, Video, MoreVertical, Search, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import Link from 'next/link'

interface Message {
  _id: string
  senderId: string
  recipientId: string
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

interface Conversation {
  _id: string
  otherUserId: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  otherUser?: User
}

export default function DirectChatPage() {
  const params = useParams()
  const router = useRouter()
  const otherUserId = params.id as string
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSidebar, setShowSidebar] = useState(true) // Open by default

  const currentUser = 'test@example.com' // In production, get from auth context

  useEffect(() => {
    loadMessages()
    loadOtherUser()
    loadConversations()
  }, [otherUserId])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getDirectMessages',
          data: {
            userId: currentUser,
            otherUserId: otherUserId
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOtherUser = async () => {
    try {
      const response = await fetch(`/api/users/search?search=${otherUserId}&limit=1`)
      if (response.ok) {
        const data = await response.json()
        if (data.users.length > 0) {
          setOtherUser(data.users[0])
        }
      }
    } catch (error) {
      console.error('Failed to load user info:', error)
    }
  }

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getDirectConversations',
          data: { userId: currentUser }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const conversationsWithUsers = await Promise.all(
          (data.conversations || []).map(async (conv: Conversation) => {
            // Load user info for each conversation
            const userResponse = await fetch(`/api/users/search?search=${conv.otherUserId}&limit=1`)
            if (userResponse.ok) {
              const userData = await userResponse.json()
              return {
                ...conv,
                otherUser: userData.users[0] || null
              }
            }
            return conv
          })
        )
        setConversations(conversationsWithUsers)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendDirectMessage',
          data: {
            userId: currentUser,
            recipientId: otherUserId,
            content: newMessage.trim(),
            type: 'text'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        // Refresh conversations to update last message
        loadConversations()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const navigateToConversation = (userId: string) => {
    router.push(`/chat/direct/${userId}`)
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.otherUser?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-6rem)]">
      <div className="flex h-full gap-4">
        {/* Conversations Sidebar */}
        <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Direct Messages</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm ? 'No conversations found' : 'No conversations yet'}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`p-3 hover:bg-accent cursor-pointer border-b ${
                        conv.otherUserId === otherUserId ? 'bg-accent' : ''
                      }`}
                      onClick={() => navigateToConversation(conv.otherUserId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          {conv.otherUser?.avatar ? (
                            <img src={conv.otherUser.avatar} alt={conv.otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {conv.otherUser?.name || conv.otherUserId}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {!showSidebar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
              <div>
                <AppBreadcrumb items={[
                  { label: 'Home', href: '/dashboard' },
                  { label: 'Chat', href: '/chat' },
                  { label: 'Direct Chat', href: `/chat/direct/${otherUserId}` }
                ]} />
                <div className="flex items-center gap-3 mt-2">
                  <Link href="/chat/discover">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      {otherUser?.avatar ? (
                        <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {otherUser?.name || otherUserId}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {otherUser?.school && otherUser?.level 
                          ? `${otherUser.school} • ${otherUser.level}`
                          : 'Loading...'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {otherUser?.name || otherUserId}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {otherUser?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start the conversation with a message!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUser
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={sending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    size="sm"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
