import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.match(/qouta_token=([^;]+)/)?.[1];
    
    if (!token) {
      return NextResponse.json(null);
    }

    const db = await getDatabase();
    
    // Handle database connection issues
    if (!db) {
      console.warn('Database connection failed for session check');
      return NextResponse.json(null);
    }

    try {
      const users = db.collection('users');
      const user = await users.findOne({ id: token });
      
      if (!user) {
        console.log(`User not found for token: ${token}`);
        return NextResponse.json(null);
      }

      // Update last active time (non-blocking, don't fail if this fails)
      try {
        await users.updateOne(
          { id: token },
          { $set: { lastActive: new Date() } },
          { upsert: true }
        );
      } catch (updateError) {
        console.warn('Failed to update last active time:', updateError);
        // Don't fail the session check for this
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email || 'user@example.com',
          role: user.role || 'student',
          name: user.name || 'User',
          level: user.level || 'Not Set',
          points: user.points || 0,
          streak: user.streak || 0,
          avatar: user.avatar || '/avatars/default.jpg'
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
    } catch (userError) {
      console.error('Error finding user for session:', userError);
      return NextResponse.json(null);
    }
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(null);
  }
}
