"use client"

import { useState, useEffect, useCallback } from 'react'
import { useNotificationBadgeCount } from '@/lib/notificationFirebase.client'

interface Notification {
  id: string
  userId: string
  type: string
  event: string
  title: string
  message: string
  entityType?: string
  entityId?: string
  isRead: boolean
  priority: string
  metadata?: Record<string, any>
  createdAt: string
  readAt?: string
  expiresAt?: string
}

// Hook for managing notifications in components
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const { counts, loading: countsLoading } = useNotificationBadgeCount(userId || '')

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=20`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (append) {
          setNotifications(prev => [...prev, ...data.notifications])
        } else {
          setNotifications(data.notifications)
        }
        
        setHasMore(data.pagination.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        )
      }
      
      return response.ok
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        )
      }
      
      return response.ok
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter((n) => n.id !== notificationId))
      }
      
      return response.ok
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  }, [])

  // Load more notifications
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, true)
    }
  }, [hasMore, loading, page, fetchNotifications])

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications(1, false)
  }, [fetchNotifications])

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications(1, false)
    }
  }, [userId, fetchNotifications])

  return {
    notifications,
    loading,
    hasMore,
    counts,
    countsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh
  }
}

// Hook for creating notifications (for admin/testing)
export function useNotificationCreator() {
  const [loading, setLoading] = useState(false)

  const createNotification = useCallback(async (notification: {
    userId: string
    type: string
    event: string
    title: string
    message: string
    entityType?: string
    entityId?: string
    priority?: string
    metadata?: Record<string, any>
  }) => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      })

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Failed to create notification')
      }
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createNotification,
    loading
  }
}

// Hook for real-time notification listening
export function useRealtimeNotifications(userId?: string) {
  const [realtimeNotification, setRealtimeNotification] = useState<Notification | null>(null)

  useEffect(() => {
    if (!userId) return

    // This would integrate with Firebase Realtime Database or WebSocket
    // For now, it's a placeholder for future implementation
    const setupRealtimeListener = () => {
      // Example Firebase listener:
      // const unsubscribe = onValue(ref(db, `notifications/${userId}`), (snapshot) => {
      //   const notification = snapshot.val()
      //   if (notification) {
      //     setRealtimeNotification(notification)
      //   }
      // })
      
      // return unsubscribe
      return () => {} // Return empty cleanup function for now
    }

    const cleanup = setupRealtimeListener()
    
    return () => {
      cleanup()
    }
  }, [userId])

  return realtimeNotification
}
