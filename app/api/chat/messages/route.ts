import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatService } from '@/services/chatService'

// GET /api/chat/messages - Get messages for a group
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') ? new Date(searchParams.get('before')!) : undefined

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Check if user is a member of the group
    const group = await chatService.getGroupById(groupId)
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const isMember = group.members.some(member => member.userId === session.user.id)
    if (!isMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get messages
    const messages = await chatService.getGroupMessages(groupId, page, limit, before)

    // Format messages for response
    const formattedMessages = messages.map(message => ({
      id: message._id?.toString(),
      content: message.content,
      senderId: message.senderId,
      groupId: message.groupId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      readBy: message.readBy,
      type: message.type,
      metadata: message.metadata
    }))

    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { groupId, content, type = 'text', metadata } = body

    if (!groupId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group ID and content are required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Check if user is a member of the group
    const group = await chatService.getGroupById(groupId)
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const isMember = group.members.some(member => member.userId === session.user.id)
    if (!isMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create the message
    const message = await chatService.sendMessage({
      content: content.trim(),
      senderId: session.user.id,
      groupId,
      type,
      metadata
    })

    // Format for response
    const formattedMessage = {
      id: message._id?.toString(),
      content: message.content,
      senderId: message.senderId,
      groupId: message.groupId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      readBy: message.readBy,
      type: message.type,
      metadata: message.metadata
    }

    return NextResponse.json({
      success: true,
      message: formattedMessage
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PATCH /api/chat/messages - Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, groupId, markAll } = body

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    if (markAll && groupId) {
      // Mark all messages in group as read
      await chatService.markAllMessagesAsRead(session.user.id, groupId)
    } else if (messageId) {
      // Mark specific message as read
      await chatService.markMessageAsRead(session.user.id, messageId)
    } else {
      return NextResponse.json(
        { error: 'Either messageId or (groupId + markAll) is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
