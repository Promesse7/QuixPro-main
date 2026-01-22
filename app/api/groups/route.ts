import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Group } from "@/models/index";
import { ObjectId } from "mongodb";
import { firebaseAdmin } from "@/lib/services/firebase";

export const dynamic = "force-dynamic";

// Helper to handle authentication and get current user
async function getAuthenticatedUser() {
  const currentUser = getCurrentUser();
  if (!currentUser?._id) {
    throw new Error('Unauthorized');
  }
  return currentUser;
}

// GET /api/groups - Get all groups the user is a member of or public groups
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");

    // Get public groups and groups where user is a member
    const groups = await groupsCollection.aggregate([
      {
        $match: {
          $or: [
            { isPublic: true },
            { members: new ObjectId(currentUser._id) }
          ]
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ groups });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    console.error("Failed to fetch groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" }, 
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    const userId = new ObjectId(currentUser._id);

    const body = await request.json();
    const { name, description, isPrivate = false } = body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Group name is required and must be at least 3 characters long' }, 
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");

    // Check if group with same name already exists
    const existingGroup = await groupsCollection.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: 'A group with this name already exists' }, 
        { status: 409 }
      );
    }

    const newGroup: Omit<Group, '_id'> = {
      name: name.trim(),
      description: description?.trim() || "",
      creatorId: userId,
      members: [userId],
      admins: [userId],
      isPrivate: Boolean(isPrivate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Start a database transaction
    const session = db.startSession();
    let createdGroup;

    try {
      await session.withTransaction(async () => {
        // 1. Create the group
        const result = await groupsCollection.insertOne(newGroup as Group, { session });
        const groupId = result.insertedId;

        // 2. Add to user's groups
        await db.collection('users').updateOne(
          { _id: userId },
          { $addToSet: { groups: groupId } },
          { session }
        );

        // 3. Sync with Firebase
        try {
          await firebaseAdmin.syncGroupMembers(
            groupId.toString(), 
            [userId.toString()]
          );
        } catch (firebaseError) {
          console.error("Firebase sync failed:", firebaseError);
          throw new Error('Failed to sync with realtime database');
        }

        createdGroup = {
          _id: groupId,
          ...newGroup,
        };
      });
    } catch (error) {
      console.error("Transaction aborted due to error:", error);
      throw error;
    } finally {
      await session.endSession();
    }

    return NextResponse.json(
      { 
        message: "Group created successfully", 
        group: createdGroup 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create group:", error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A group with this name already exists' }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create group',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
// This is needed for some frontend frameworks
// and doesn't require authentication
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
