import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { chatService } from '@/lib/services/chatService';
import { firebaseAdmin } from '@/lib/services/firebase';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { action, data } = await req.json();
    const userId = session.user.email; // Using email as user ID

    switch (action) {
      case 'createGroup':
        return handleCreateGroup(userId, data);
      case 'addGroupMember':
        return handleAddGroupMember(userId, data);
      case 'sendMessage':
        return handleSendMessage(userId, data);
      case 'getMessages':
        return handleGetMessages(userId, data);
      case 'getUserGroups':
        return handleGetUserGroups(userId);
      case 'setTyping':
        return handleSetTyping(userId, data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler functions for each action
async function handleCreateGroup(userId: string, data: any) {
  const { name, description, isPublic = true, settings } = data;
  
  if (!name) {
    return NextResponse.json(
      { error: 'Group name is required' },
      { status: 400 }
    );
  }

  const group = await chatService.createGroup({
    name,
    description,
    isPublic,
    createdBy: userId,
    settings
  });

  return NextResponse.json({ group });
}

async function handleAddGroupMember(userId: string, data: any) {
  const { groupId, newMemberId, role = 'member' } = data;
  
  if (!groupId || !newMemberId) {
    return NextResponse.json(
      { error: 'Group ID and member ID are required' },
      { status: 400 }
    );
  }

  // Verify the requester is an admin of the group
  const group = await chatService.getGroup(groupId);
  const isAdmin = group.members.some(
    (m: any) => m.userId === userId && m.role === 'admin'
  );

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Only group admins can add members' },
      { status: 403 }
    );
  }

  const result = await chatService.addGroupMember(groupId, newMemberId, role);
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.message || 'Failed to add member' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

async function handleSendMessage(userId: string, data: any) {
  const { groupId, content, type = 'text', metadata } = data;
  
  if (!groupId || !content) {
    return NextResponse.json(
      { error: 'Group ID and message content are required' },
      { status: 400 }
    );
  }

  // Verify the user is a member of the group
  const group = await chatService.getGroup(groupId);
  const isMember = group?.members.some((m: any) => m.userId === userId);
  
  if (!isMember) {
    return NextResponse.json(
      { error: 'You are not a member of this group' },
      { status: 403 }
    );
  }

  const message = await chatService.createMessage({
    groupId,
    content,
    type,
    metadata,
    senderId: userId
  });

  return NextResponse.json({ message });
}

async function handleGetMessages(userId: string, data: any) {
  const { groupId, before } = data;
  
  if (!groupId) {
    return NextResponse.json(
      { error: 'Group ID is required' },
      { status: 400 }
    );
  }

  // Verify the user is a member of the group
  const group = await chatService.getGroup(groupId);
  const isMember = group?.members.some((m: any) => m.userId === userId);
  
  if (!isMember) {
    return NextResponse.json(
      { error: 'You are not a member of this group' },
      { status: 403 }
    );
  }

  const beforeDate = before ? new Date(before) : undefined;
  const messages = await chatService.getMessages(groupId, 50, beforeDate);
  
  // Mark messages as read
  await Promise.all(
    messages
      .filter((msg: any) => !msg.readBy?.includes(userId))
      .map((msg: any) => chatService.markMessageAsRead(msg._id, userId))
  );

  return NextResponse.json({ messages });
}

async function handleGetUserGroups(userId: string) {
  const groups = await chatService.getUserGroups(userId);
  return NextResponse.json({ groups });
}

async function handleSetTyping(userId: string, data: any) {
  const { groupId, isTyping } = data;
  
  if (typeof groupId === 'undefined' || typeof isTyping === 'undefined') {
    return NextResponse.json(
      { error: 'Group ID and typing status are required' },
      { status: 400 }
    );
  }

  // Verify the user is a member of the group
  const group = await chatService.getGroup(groupId);
  const isMember = group?.members.some((m: any) => m.userId === userId);
  
  if (!isMember) {
    return NextResponse.json(
      { error: 'You are not a member of this group' },
      { status: 403 }
    );
  }

  await chatService.setTypingIndicator(userId, groupId, isTyping);
  return NextResponse.json({ success: true });
}
