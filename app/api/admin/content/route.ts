import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'quiz';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = await getDatabase();
    
    let collection;
    switch (type) {
      case 'quiz':
        collection = db.collection('quizzes');
        break;
      case 'story':
        collection = db.collection('stories');
        break;
      case 'user':
        collection = db.collection('users');
        break;
      default:
        collection = db.collection('quizzes');
    }

    const query = searchParams.get('search') 
      ? { 
          title: { $regex: searchParams.get('search'), $options: 'i' },
          description: { $regex: searchParams.get('search'), $options: 'i' }
        }
      : {};

    const items = await collection
      .find(query)
      .project({
        id: { $toString: '$_id' },
        title: 1,
        description: 1,
        subject: 1,
        level: 1,
        difficulty: 1,
        createdAt: 1,
        status: 1,
        // Quiz specific
        questions: 1,
        // Story specific
        views: 1,
        isPublished: 1,
        // User specific
        email: 1,
        role: 1
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      items,
      type,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${type} content` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, description, subject, level, difficulty, questions, content } = await request.json();

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    let collection;
    
    switch (type) {
      case 'quiz':
        collection = db.collection('quizzes');
        break;
      case 'story':
        collection = db.collection('stories');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    const newItem = {
      title,
      description,
      subject,
      level,
      difficulty,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    };

    // Add type-specific fields
    if (type === 'quiz' && questions) {
      (newItem as any).questions = questions;
    }
    if (type === 'story' && content) {
      (newItem as any).content = content;
      (newItem as any).views = 0;
      (newItem as any).isPublished = false;
    }

    const result = await collection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      item: {
        id: result.insertedId.toString(),
        ...newItem
      }
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, type, ...updateData } = await request.json();

    if (!id || !type) {
      return NextResponse.json(
        { error: 'ID and type are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    let collection;
    
    switch (type) {
      case 'quiz':
        collection = db.collection('quizzes');
        break;
      case 'story':
        collection = db.collection('stories');
        break;
      case 'user':
        collection = db.collection('users');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      updated: result.modifiedCount > 0
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json(
        { error: 'ID and type are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    let collection;
    
    switch (type) {
      case 'quiz':
        collection = db.collection('quizzes');
        break;
      case 'story':
        collection = db.collection('stories');
        break;
      case 'user':
        collection = db.collection('users');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount > 0
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
