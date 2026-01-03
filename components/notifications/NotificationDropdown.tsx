"use client"

import React, { useState, useEffect, useRef } from 'react'
import { X, Check, CheckCheck, Trash2, ExternalLink, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { INotification, getTimeAgo } from '@/models/Notification'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  className?: string
}

interface NotificationItemProps {
  notification: INotification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onClick: (notification: INotification) => void
}

// Individual notification item
function NotificationItem({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getNotificationIcon = (type: string, event: string) => {
    switch (type) {
      case 'chat':
        return '💬'
      case 'quiz':
        return event === 'certificate_earned' ? '🎉' : '📚'
      case 'group':
        return '👥'
      case 'site':
        return '🌐'
      case 'system':
        return '⚙️'
      default:
        return '📢'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'normal':
        return 'border-l-blue-500'
      case 'low':
        return 'border-l-gray-400'
      default:
        return 'border-l-gray-400'
    }
  }

  const handleClick = () => {
    onClick(notification)
    if (!notification.isRead) {
      onMarkAsRead(notification._id?.toString() || '')
    }
  }

  return (
    <div
      className={cn(
        "relative p-4 border-l-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer",
        getPriorityColor(notification.priority),
        !notification.isRead && "bg-blue-50",
        isHovered && "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Icon */}
          <div className="text-2xl flex-shrink-0">
            {getNotificationIcon(notification.type, notification.event)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={cn(
                "text-sm font-medium truncate",
                !notification.isRead && "font-semibold"
              )}>
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {notification.message}
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{getTimeAgo(notification.createdAt)}</span>
              {notification.priority === 'high' && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  High
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center space-x-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead(notification._id?.toString() || '')
              }}
              className="w-8 h-8 p-0"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 p-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(notification._id?.toString() || '')
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(notification._id?.toString() || '')
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export function NotificationDropdown({ isOpen, onClose, userId, className = "" }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1, append = false) => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=20`
      )
      
      if (response.ok) {
        const data = await response.json()
        const formattedNotifications = data.notifications.map((notif: any) => ({
          ...notif,
          createdAt: new Date(notif.createdAt),
          readAt: notif.readAt ? new Date(notif.readAt) : undefined,
          expiresAt: notif.expiresAt ? new Date(notif.expiresAt) : undefined
        }))

        if (append) {
          setNotifications(prev => [...prev, ...formattedNotifications])
        } else {
          setNotifications(formattedNotifications)
        }
        
        setHasMore(data.pagination.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n._id?.toString() === notificationId
              ? { ...n, isRead: true, readAt: new Date() }
              : n
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n._id?.toString() !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: INotification) => {
    // Navigate to the relevant entity
    let navigationPath = ''

    switch (notification.entityType) {
      case 'message':
        navigationPath = `/chat/direct/${notification.entityId}`
        break
      case 'quiz':
        navigationPath = `/quiz/${notification.entityId}`
        break
      case 'group':
        navigationPath = `/groups/${notification.entityId}`
        break
      case 'post':
        navigationPath = `/sites/post/${notification.entityId}`
        break
      case 'certificate':
        navigationPath = `/certificates/${notification.entityId}`
        break
      default:
        return
    }

    if (navigationPath) {
      window.location.href = navigationPath
      onClose()
    }
  }

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, true)
    }
  }

  // Initial fetch and refetch on open
  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications(1, false)
    }
  }, [isOpen, userId])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.isRead) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-500">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <div className="text-4xl mb-2">📬</div>
            <div className="text-sm text-gray-500 text-center">
              No notifications yet
            </div>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id?.toString()}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onClick={handleNotificationClick}
                />
              ))}
              
              {/* Load More */}
              {hasMore && (
                <div className="p-4">
                  <Button
                    variant="ghost"
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
