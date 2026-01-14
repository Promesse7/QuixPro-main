import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { signalingService } from '@/lib/services/signalingService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const room = await signalingService.createRoom(session.user.email, body?.metadata || {});
    return NextResponse.json({ room });
  } catch (err) {
    console.error('Create RTC room error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // For simplicity: allow listing rooms created by user
    const userId = session.user.email;
    const db = (await import('@/lib/mongodb')).getDatabase;
    // Avoid heavy listing — return empty array stub if not needed
    return NextResponse.json({ rooms: [] });
  } catch (err) {
    console.error('List RTC rooms error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
