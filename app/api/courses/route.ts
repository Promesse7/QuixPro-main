import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Course, ContentBlock } from '@/models/Course';

export const dynamic = 'force-dynamic';

// GET /api/courses - Get all courses (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const levelId = searchParams.get('levelId');

    const db = await getDatabase();
    const coursesCol = db.collection('courses');

    const query: any = {};
    if (ownerId) query.ownerId = ownerId;
    if (status) query.status = status;
    if (levelId && ObjectId.isValid(levelId)) {
      query.levelId = new ObjectId(levelId);
    }

    const courses = await coursesCol.find(query).sort({ updatedAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      levelId,
      gradeLevel,
      subject,
      tags,
      coverImage,
      ownerId,
      content,
      learningObjectives,
      estimatedDuration,
    } = body;

    if (!name || !levelId) {
      return NextResponse.json(
        { success: false, error: 'Name and levelId are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const coursesCol = db.collection('courses');

    const course: Course = {
      levelId: new ObjectId(levelId),
      name,
      description,
      gradeLevel,
      subject,
      tags: tags || [],
      coverImage,
      ownerId,
      content: content || { blocks: [], version: 1 },
      learningObjectives: learningObjectives || [],
      estimatedDuration,
      status: 'draft',
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await coursesCol.insertOne(course);

    return NextResponse.json({
      success: true,
      course: { ...course, _id: result.insertedId },
      message: 'Course created successfully',
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses - Update a course
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, ...updates } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const coursesCol = db.collection('courses');

    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };

    // If updating content blocks, increment version
    if (updates.content?.blocks) {
      const existingCourse = await coursesCol.findOne({ _id: new ObjectId(courseId) });
      if (existingCourse?.content?.version) {
        updateData.content.version = existingCourse.content.version + 1;
        updateData.content.lastEdited = new Date();
      }
    }

    const result = await coursesCol.updateOne(
      { _id: new ObjectId(courseId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
