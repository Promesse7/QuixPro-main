"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import UserSearch from '@/components/chat/UserSearch'
import ChatInvite from '@/components/chat/ChatInvite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, ArrowLeft } from 'lucide-react'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import Link from 'next/link'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  school: string
  level: string
  role?: string
  isOnline?: boolean
}

export default function ChatDiscoveryPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setShowInvite(true)
  }

  const handleSendInvite = async (user: User, message: string) => {
    try {
      // Get current user (for now, we'll use a simple approach)
      const currentUser = 'test@example.com' // In production, get from auth context
      
      // Send the first message to start the conversation
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendDirectMessage',
          data: {
            userId: currentUser, // Add userId to data
            recipientId: user.email, // Using email as user ID
            content: message,
            type: 'text'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Navigate to the chat page
      router.push(`/chat/direct/${user.email}`)
    } catch (error) {
      console.error('Failed to start chat:', error)
      // Show error message (you could add a toast notification here)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <AppBreadcrumb items={[
            { label: 'Home', href: '/dashboard' },
            { label: 'Chat', href: '/chat' },
            { label: 'Discover Users', href: '/chat/discover' }
          ]} />
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <Users className="w-8 h-8" />
            Discover Users
          </h1>
          <p className="text-muted-foreground">
            Find and connect with other users for direct conversations
          </p>
        </div>
        <Link href="/chat">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium">Active Users</div>
                <div className="text-sm text-muted-foreground">Browse and connect</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium">Direct Chat</div>
                <div className="text-sm text-muted-foreground">1-on-1 conversations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium">Smart Filters</div>
                <div className="text-sm text-muted-foreground">Find by school & level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Search Component */}
      <UserSearch onUserSelect={handleUserSelect} />

      {/* Chat Invite Dialog */}
      <ChatInvite
        user={selectedUser}
        isOpen={showInvite}
        onClose={() => {
          setShowInvite(false)
          setSelectedUser(null)
        }}
        onSendInvite={handleSendInvite}
      />
    </div>
  )
}
