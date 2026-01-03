import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatService } from '@/services/chatService'

// GET /api/chat/groups - Get user's groups
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includePublic = searchParams.get('includePublic') === 'true'

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Get user's groups
    const userGroups = await chatService.getUserGroups(session.user.id)

    // If requested, also include public groups
    if (includePublic) {
      // This would require additional method in ChatService
      // For now, just return user groups
    }

    return NextResponse.json({
      groups: userGroups,
      total: userGroups.length
    })
  } catch (error) {
    console.error('Error fetching user groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

// POST /api/chat/groups - Create a new group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, isPublic = false, settings } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Create the group
    const group = await chatService.createGroup({
      name: name.trim(),
      description: description?.trim(),
      createdBy: session.user.id,
      isPublic,
      settings: {
        allowMemberInvites: settings?.allowMemberInvites ?? true,
        readReceipts: settings?.readReceipts ?? true,
        messageEditWindow: settings?.messageEditWindow ?? 15
      },
      members: [{
        userId: session.user.id,
        role: 'admin',
        joinedAt: new Date()
      }]
    })

    // Add creator to user groups
    await chatService.joinGroup(session.user.id, group._id?.toString() || '', 'admin')

    return NextResponse.json({
      success: true,
      group
    })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}
