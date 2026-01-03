"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { NotificationBell, useNotificationBell } from './NotificationBell'
import { NotificationDropdown } from './NotificationDropdown'

interface NotificationsProps {
  className?: string
  userId?: string
}

export function Notifications({ className = "", userId: propUserId }: NotificationsProps) {
  const [userId, setUserId] = useState<string | null>(propUserId || null)
  const { isOpen, openNotifications, closeNotifications, toggleNotifications } = useNotificationBell()

  // Get user ID if not provided as prop
  useEffect(() => {
    if (propUserId) {
      setUserId(propUserId)
      return
    }

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
  }, [propUserId])

  return (
    <div className={cn("relative", className)}>
      <NotificationBell
        onClick={toggleNotifications}
        className="relative"
      />
      
      <NotificationDropdown
        isOpen={isOpen}
        onClose={closeNotifications}
        userId={userId || undefined}
      />
    </div>
  )
}

// Export individual components for flexibility
export { NotificationBell } from './NotificationBell'
export { NotificationDropdown } from './NotificationDropdown'
