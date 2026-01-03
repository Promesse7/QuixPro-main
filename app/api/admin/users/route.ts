import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const db = await getDatabase();
    const usersCol = db.collection('users');

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    // Get users with pagination
    const users = await usersCol
      .find(query)
      .project({
        id: { $toString: '$_id' },
        name: 1,
        email: 1,
        role: 1,
        level: 1,
        school: 1,
        createdAt: 1,
        lastLoginAt: 1,
        'gamification.totalXP': 1,
        'gamification.currentLevel': 1,
        'gamification.badges': 1,
        stats: 1
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalUsers = await usersCol.countDocuments(query);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        _id: user.id,
        totalBadges: user.gamification?.badges?.length || 0,
        totalXP: user.gamification?.totalXP || 0
      })),
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, level, school, password } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCol = db.collection('users');

    // Check if user exists
    const existingUser = await usersCol.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { name: name }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or name already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      name,
      email: email.toLowerCase(),
      role,
      level,
      school,
      createdAt: new Date(),
      updatedAt: new Date(),
      gamification: {
        totalXP: 0,
        currentLevel: 1,
        badges: []
      },
      stats: {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        certificates: 0
      }
    };

    const result = await usersCol.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        ...newUser
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
