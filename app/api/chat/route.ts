import { NextResponse } from 'next/server'
import { chatService } from '@/lib/services/chatService'
import { firebaseAdmin } from '@/lib/services/firebase'

export async function POST(req: Request) {
  try {
    // For now, we'll use a simple authentication check
    // In production, you should implement proper authentication
    const body = await req.json()
    const { action, data } = body

    // Get user from request body
    const userId = data?.userId || 'test@example.com'

    switch (action) {
      case 'createGroup':
        return handleCreateGroup(userId, data);
      case 'addGroupMember':
        return handleAddGroupMember(userId, data);
      case 'sendMessage':
        return handleSendMessage(userId, data);
      case 'sendDirectMessage':
        return handleSendDirectMessage(userId, data);
      case 'getMessages':
        return handleGetMessages(userId, data);
      case 'getDirectMessages':
        return handleGetDirectMessages(userId, data);
      case 'getUserGroups':
        return handleGetUserGroups(userId);
      case 'getDirectConversations':
        return handleGetDirectConversations(userId);
      case 'markConversationAsRead':
        return handleMarkConversationAsRead(userId, data);
      case 'setTyping':
        return handleSetTyping(userId, data);
      case 'joinGroup':
        return handleJoinGroup(userId, data);
      case 'requestJoinGroup':
        return handleRequestJoinGroup(userId, data);
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
  const { name, description, isPublic = false } = data;

  if (!name) {
    return NextResponse.json(
      { error: 'Group name is required' },
      { status: 400 }
    );
  }

  const groupRef = push(ref(db, "groups"));

  await set(groupRef, {
    creatorId: userId,
    isPublic,
    name,
    description: description || '',
    createdAt: Date.now(),
    members: {
      [userId]: true
    },
    admins: {
      [userId]: true
    }
  });

  return NextResponse.json({ 
    success: true, 
    group: {
      id: groupRef.key,
      ...(await get(groupRef)).val()
    }
  });
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

// Direct Message Handlers
async function handleSendDirectMessage(userId: string, data: any) {
  const { recipientId, content, type = 'text', metadata } = data;

  if (!recipientId || !content) {
    return NextResponse.json(
      { error: 'Recipient ID and message content are required' },
      { status: 400 }
    );
  }

  console.log('Creating direct message:', { userId, recipientId, content });

  const message = await chatService.createDirectMessage({
    senderId: userId,
    recipientId: recipientId,
    content: content,
    type: type,
    metadata: metadata
  });

  console.log('Direct message created:', message);

  return NextResponse.json({ message });
}

async function handleGetDirectMessages(userId: string, data: any) {
  const { otherUserId, before } = data;

  if (!otherUserId) {
    return NextResponse.json(
      { error: 'Other user ID is required' },
      { status: 400 }
    );
  }

  const messages = await chatService.getDirectMessages(userId, otherUserId, before);

  return NextResponse.json({ messages });
}

async function handleGetDirectConversations(userId: string) {
  try {
    const conversations = await chatService.getDirectConversations(userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error getting direct conversations:', error);
    // Return empty conversations to prevent JSON parsing errors
    return NextResponse.json({ conversations: [] });
  }
}

async function handleMarkConversationAsRead(userId: string, data: any) {
  const { otherUserId } = data;
  if (!otherUserId) {
    return NextResponse.json(
      { error: 'Other user ID is required' },
      { status: 400 }
    );
  }
  await firebaseAdmin.markConversationAsRead(userId, otherUserId);
  return NextResponse.json({ success: true });
}

async function handleJoinGroup(userId: string, data: any) {
  const { groupId } = data;

  if (!groupId) {
    return NextResponse.json(
      { error: 'Group ID is required' },
      { status: 400 }
    );
  }

  const result = await chatService.addGroupMember(groupId, userId, 'member');

  if (!result.success) {
    return NextResponse.json(
      { error: result.message || 'Failed to join group' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

async function handleRequestJoinGroup(userId: string, data: any) {
  const { groupId } = data;

  if (!groupId) {
    return NextResponse.json(
      { error: 'Group ID is required' },
      { status: 400 }
    );
  }

  // For now, just return success (in production, you'd store the request)
  return NextResponse.json({
    success: true,
    message: 'Join request sent successfully'
  });
}
