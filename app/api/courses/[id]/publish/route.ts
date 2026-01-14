import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// POST /api/courses/[id]/publish - Publish a course (submit for review)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { reviewerId } = body;

    const db = await getDatabase();
    const coursesCol = db.collection('courses');

    const course = await coursesCol.findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update course status to pending_review
    await coursesCol.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'pending_review',
          'moderation.reviewerId': reviewerId || null,
          'moderation.reviewedAt': null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Course submitted for review',
    });
  } catch (error) {
    console.error('Error publishing course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish course' },
      { status: 500 }
    );
  }
}
