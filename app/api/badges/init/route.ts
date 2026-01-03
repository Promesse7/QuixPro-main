import { NextRequest, NextResponse } from 'next/server';
import { badgeService } from '@/services/badgeService';

export async function POST(request: NextRequest) {
  try {
    // Initialize default badges in the database
    await badgeService.initializeDefaultBadges();
    
    return NextResponse.json({ 
      success: true,
      message: 'Badges initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing badges:', error);
    return NextResponse.json(
      { error: 'Failed to initialize badges' },
      { status: 500 }
    );
  }
}
