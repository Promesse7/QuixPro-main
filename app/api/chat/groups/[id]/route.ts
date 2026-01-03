import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatService } from '@/services/chatService'

// GET /api/chat/groups/[id] - Get group details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Get group details
    const group = await chatService.getGroupById(id)
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if user is a member
    const isMember = group.members.some(member => member.userId === session.user.id)
    if (!isMember && !group.isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    )
  }
}

// POST /api/chat/groups/[id] - Join a group
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Get group details
    const group = await chatService.getGroupById(id)
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if user is already a member
    const isMember = group.members.some(member => member.userId === session.user.id)
    if (isMember) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }

    // Check if group is public or allows member invites
    if (!group.isPublic && !group.settings.allowMemberInvites) {
      return NextResponse.json({ error: 'Group is private' }, { status: 403 })
    }

    // Join the group
    await chatService.joinGroup(session.user.id, id, 'member')

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the group'
    })
  } catch (error) {
    console.error('Error joining group:', error)
    return NextResponse.json(
      { error: 'Failed to join group' },
      { status: 500 }
    )
  }
}

// DELETE /api/chat/groups/[id] - Leave a group
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const db = await connectToDatabase()
    const chatService = new ChatService(db)

    // Get group details
    const group = await chatService.getGroupById(id)
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if user is a member
    const isMember = group.members.some(member => member.userId === session.user.id)
    if (!isMember) {
      return NextResponse.json({ error: 'Not a member' }, { status: 400 })
    }

    // Don't allow the last admin to leave
    const adminMembers = group.members.filter(member => member.role === 'admin')
    if (adminMembers.length === 1 && adminMembers[0].userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot leave group as the only admin' },
        { status: 400 }
      )
    }

    // Leave the group
    await chatService.leaveGroup(session.user.id, id)

    return NextResponse.json({
      success: true,
      message: 'Successfully left the group'
    })
  } catch (error) {
    console.error('Error leaving group:', error)
    return NextResponse.json(
      { error: 'Failed to leave group' },
      { status: 500 }
    )
  }
}
