import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { postsService } from '@/lib/services/postsService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const answer = await postsService.addAnswer(params.id, { author: session.user.email, body: body.body });
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Add answer error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
