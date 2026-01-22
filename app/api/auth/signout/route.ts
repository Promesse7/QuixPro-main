import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (session) {
      // This will clear the session cookie
      await auth().signOut();
    }
    
    // Redirect to home page after sign out
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    
    // Clear any auth-related cookies
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    );
  }
}
