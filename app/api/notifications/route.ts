import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Db } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { NotificationService } from '@/models/Notification'
import { createNotificationService } from '@/services/notificationService'

// GET /api/notifications - Get user's notifications with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') as any

    const db: Db = await connectToDatabase()
    const notificationService = new NotificationService(db)

    const notifications = await notificationService.findByUserPaginated(
      session.user.id,
      page,
      limit,
      type
    )

    // Format notifications for response
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id?.toString(),
      userId: notification.userId,
      type: notification.type,
      event: notification.event,
      title: notification.title,
      message: notification.message,
      entityType: notification.entityType,
      entityId: notification.entityId,
      isRead: notification.isRead,
      priority: notification.priority,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      expiresAt: notification.expiresAt,
      timeAgo: getTimeAgo(notification.createdAt)
    }))

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        page,
        limit,
        hasMore: notifications.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create a new notification (for testing/admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, type, event, title, message, entityType, entityId, priority = 'normal', metadata } = body

    if (!userId || !type || !event || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db: Db = await connectToDatabase()
    const notificationService = new NotificationService(db)

    const notification = await notificationService.create({
      userId,
      type,
      event,
      title,
      message,
      entityType,
      entityId,
      isRead: false,
      priority,
      metadata
    })

    return NextResponse.json({
      id: notification._id?.toString(),
      ...notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAll } = body

    const db: Db = await connectToDatabase()
    const notificationCreatorService = createNotificationService(db)

    if (markAll) {
      await notificationCreatorService.markAllAsRead(session.user.id)
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Promise.all(
        notificationIds.map((id: string) => 
          notificationCreatorService.markNotificationAsRead(session.user.id, id)
        )
      )
    } else {
      return NextResponse.json(
        { error: 'Either notificationIds or markAll must be provided' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    const db: Db = await connectToDatabase()
    const notificationService = new NotificationService(db)

    // First check if notification belongs to user
    const notification = await notificationService.findById(notificationId)
    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized' },
        { status: 404 }
      )
    }

    await notificationService.delete(notificationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

// Utility function
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
