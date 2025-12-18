import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { conversationService } from '@/lib/services/conversationService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.email;
    const conversationId = params.id;

    // Basic membership check: ensure user is a participant
    // Fetch conversation and verify participants
    // To avoid importing extra services here, do a simple check via conversationService
    const conversations = await conversationService.listUserConversations(userId, 1000);
    const isParticipant = conversations.some((c: any) => String(c._id) === String(conversationId));

    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const url = new URL(request.url);
    const before = url.searchParams.get('before');
    const beforeDate = before ? new Date(before) : undefined;

    const messages = await conversationService.getMessages(conversationId, 50, beforeDate);
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('Get conversation messages error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const conversationId = params.id;
    const { content, type = 'text', metadata } = await request.json();
    const senderId = session.user.email;

    if (!content) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    const message = await conversationService.sendMessage(conversationId, senderId, content, type, metadata);
    return NextResponse.json({ message });
  } catch (err) {
    console.error('Send conversation message error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
