"use client"

import React, { useState, useEffect } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useNotificationBadgeCount } from '@/lib/notificationFirebase'

interface NotificationBellProps {
  onClick: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function NotificationBell({ onClick, className = "", size = 'md' }: NotificationBellProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const { counts, loading } = useNotificationBadgeCount(userId || '')

  useEffect(() => {
    // Get current user ID from session or auth context
    // This is a placeholder - you'll need to implement based on your auth system
    const getCurrentUserId = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserId(data.user?.id || null)
        }
      } catch (error) {
        console.error('Error getting user ID:', error)
      }
    }

    getCurrentUserId()
  }, [])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const hasUnread = counts.total > 0
  const Icon = hasUnread ? BellRing : Bell

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={cn(
          sizeClasses[size],
          "relative rounded-full hover:bg-gray-100 transition-colors",
          className
        )}
        aria-label={`Notifications ${hasUnread ? `(${counts.total} unread)` : ''}`}
      >
        <Icon className={cn(
          iconSizes[size],
          hasUnread ? "text-blue-600 animate-pulse" : "text-gray-600"
        )} />
        
        {/* Badge for unread count */}
        {hasUnread && !loading && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 min-w-[20px] h-5 text-xs flex items-center justify-center p-0 rounded-full"
          >
            {counts.total > 99 ? '99+' : counts.total}
          </Badge>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Tooltip showing breakdown */}
      {hasUnread && !loading && (
        <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-50 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="space-y-1">
            {counts.chat > 0 && <div>💬 Chat: {counts.chat}</div>}
            {counts.academic > 0 && <div>📚 Academic: {counts.academic}</div>}
            {counts.social > 0 && <div>👥 Social: {counts.social}</div>}
            {counts.system > 0 && <div>⚙️ System: {counts.system}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for notification bell state
export function useNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)

  const openNotifications = () => setIsOpen(true)
  const closeNotifications = () => setIsOpen(false)
  const toggleNotifications = () => setIsOpen(!isOpen)

  return {
    isOpen,
    openNotifications,
    closeNotifications,
    toggleNotifications
  }
}
