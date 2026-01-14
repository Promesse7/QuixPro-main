"use client"

import React, { useState } from 'react'
import { MessageCircle, X, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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

interface ChatInviteProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSendInvite: (user: User, message: string) => void
}

export default function ChatInvite({ user, isOpen, onClose, onSendInvite }: ChatInviteProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!user || !message.trim()) return

    setSending(true)
    try {
      await onSendInvite(user, message.trim())
      onClose()
      setMessage('')
    } catch (error) {
      console.error('Failed to send invite:', error)
    } finally {
      setSending(false)
    }
  }

  const defaultInviteMessage = `Hi ${user?.name}, I'd like to connect and chat with you!`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Start Chat
          </DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {user.school}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {user.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Invite Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Invite Message</label>
              <Textarea
                value={message || defaultInviteMessage}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to introduce yourself..."
                className="min-h-[100px]"
                disabled={sending}
              />
              <p className="text-xs text-muted-foreground">
                This message will be sent to start the conversation
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={sending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="flex-1 flex items-center gap-2"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Invite
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
