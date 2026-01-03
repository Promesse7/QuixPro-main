import { NextRequest, NextResponse } from 'next/server';
import { badgeService } from '@/services/badgeService';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const badges = await badgeService.getUserBadges(userId);

    return NextResponse.json({ 
      success: true,
      badges 
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}
