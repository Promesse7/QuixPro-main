import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { conversationService } from '@/lib/services/conversationService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { participants = [], isGroup = false, groupId } = await request.json();
    const createdBy = session.user.email;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'Participants required' }, { status: 400 });
    }

    const conv = await conversationService.createConversation(participants, createdBy, isGroup, groupId);
    return NextResponse.json({ conversation: conv });
  } catch (err) {
    console.error('Create conversation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.email;
    const conversations = await conversationService.listUserConversations(userId);
    return NextResponse.json({ conversations });
  } catch (err) {
    console.error('List conversations error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
