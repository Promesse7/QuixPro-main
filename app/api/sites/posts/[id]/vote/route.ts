import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { postsService } from '@/lib/services/postsService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const delta = body?.delta === -1 ? -1 : 1;
    await postsService.votePost(params.id, delta);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Vote post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
