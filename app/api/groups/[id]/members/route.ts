import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Group } from "@/models/index";
import { firebaseAdmin } from "@/lib/services/firebase"; // Import the firebase admin service

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

// POST /api/groups/{id}/members - Join a group
export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = params;
    if (!ObjectId.isValid(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const userId = new ObjectId(currentUser._id);

    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $addToSet: { members: userId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (result.modifiedCount > 0) {
      // --- SYNC WITH FIREBASE ---
      try {
        await firebaseAdmin.addUserToGroup(groupId, userId.toString());
      } catch (firebaseError) {
        console.error("Firebase sync failed after joining group:", firebaseError);
        // Optional: Consider rolling back the MongoDB change if sync fails
      }
      // --- END SYNC ---
    } else {
      return NextResponse.json({ message: "You are already a member of this group" }, { status: 200 });
    }

    return NextResponse.json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error("Failed to join group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/groups/{id}/members - Leave a group
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = params;
    if (!ObjectId.isValid(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const userId = new ObjectId(currentUser._id);

    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { members: userId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (result.modifiedCount > 0) {
        // --- SYNC WITH FIREBASE ---
        try {
            await firebaseAdmin.removeUserFromGroup(groupId, userId.toString());
        } catch (firebaseError) {
            console.error("Firebase sync failed after leaving group:", firebaseError);
            // Optional: Consider rolling back the MongoDB change if sync fails
        }
        // --- END SYNC ---
    } else {
      return NextResponse.json({ error: "You are not a member of this group" }, { status: 400 });
    }

    return NextResponse.json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Failed to leave group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
