import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { firebaseAdmin } from '@/lib/services/firebase';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.email; // using email as uid for Firebase

    // Create a custom token for Firebase auth (server-side only)
    const token = await firebaseAdmin.createCustomToken(userId, {
      role: session.user.role || 'student'
    }).catch((err: any) => {
      console.error('Firebase token creation error:', err);
      return null;
    });

    if (!token) {
      return NextResponse.json({ error: 'Failed to create firebase token' }, { status: 500 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Firebase token endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
