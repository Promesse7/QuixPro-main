import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { signalingService } from '@/lib/services/signalingService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { type, payload } = await request.json();
    if (!type || !payload) return NextResponse.json({ error: 'Type and payload required' }, { status: 400 });

    const entry = await signalingService.postSignal(params.id, type, payload, session.user.email);
    return NextResponse.json({ entry });
  } catch (err) {
    console.error('Post signal error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const url = new URL(request.url);
    const since = url.searchParams.get('since');
    const sinceDate = since ? new Date(since) : undefined;
    const signals = await signalingService.getSignals(params.id, sinceDate);
    if (!signals) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json({ signals });
  } catch (err) {
    console.error('Get signals error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
