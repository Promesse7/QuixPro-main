import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Group } from "@/models/index";
import { ObjectId } from "mongodb";
import { firebaseAdmin } from "@/lib/services/firebase"; // Import the firebase admin service

export const dynamic = "force-dynamic";

// ... (GET handler remains unchanged)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");

    const groups = await groupsCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to create a group." }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, isPrivate = false } = body;

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");

    const creatorId = new ObjectId(currentUser._id);

    const newGroup: Omit<Group, '_id'> = {
      name,
      description: description || "",
      creatorId,
      members: [creatorId], // Creator is the first member
      admins: [creatorId], // Creator is the first admin
      isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await groupsCollection.insertOne(newGroup as Group);
    const groupId = result.insertedId;

    // --- SYNC WITH FIREBASE ---
    try {
      const firebaseGroupData = {
        name: newGroup.name,
        description: newGroup.description,
        createdBy: currentUser.email || currentUser._id.toString(), // Ensure createdBy is not undefined
        members: newGroup.members.map(id => id.toString()),
        admins: newGroup.admins.map(id => id.toString()),
        isPrivate: newGroup.isPrivate,
        createdAt: newGroup.createdAt.toISOString(),
        updatedAt: newGroup.updatedAt.toISOString()
      };

      // Create group in Firebase Realtime Database
      const firebaseDb = firebaseAdmin.database();
      await firebaseDb.ref(`groups/${groupId.toString()}`).set(firebaseGroupData);

      // Add group to user's groups list
      await firebaseDb.ref(`users/${currentUser.email}/groups/${groupId.toString()}`).set(true);

    } catch (firebaseError) {
      console.error("Firebase sync failed after group creation:", firebaseError);
      // Don't fail the request, but log the error
    }
    // --- END SYNC ---

    const createdGroup = {
      _id: groupId,
      ...newGroup,
    }

    return NextResponse.json({ message: "Group created successfully", group: createdGroup }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create group:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "A group with this name already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
