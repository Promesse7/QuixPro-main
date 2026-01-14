import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Group, User } from "@/models";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

interface SharedFile {
  _id: string;
  name: string;
  type: 'image' | 'file' | 'link';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface GroupMember {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  isOnline: boolean;
  joinedAt: Date;
}

// GET /api/groups/{id} - Get group details with member information
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    // Skip authentication for development - TODO: Add proper auth in production
    // const currentUser = getCurrentUser();
    // if (!currentUser || !currentUser.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id: groupId } = params;
    if (!ObjectId.isValid(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const usersCollection = db.collection<User>("users");

    // Get group details
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Skip member check for development - TODO: Add proper auth in production
    // const isMember = group.members.some(member => 
    //   member.userId === currentUser.id || member.userId.toString() === currentUser.id
    // );
    
    // if (!isMember && !group.isPublic) {
    //   return NextResponse.json({ error: "Access denied" }, { status: 403 });
    // }

    // Get member details
    const memberIds = group.members.map(member => member.userId);
    const members = await usersCollection.find(
      { id: { $in: memberIds.map(id => id.toString()) } }
    ).toArray();

    // Format member information with online status (placeholder for now)
    const formattedMembers: GroupMember[] = group.members.map(member => {
      const userDetails = members.find(u => u.id === member.userId.toString());
      
      return {
        _id: member.userId,
        name: userDetails?.name || "Unknown User",
        email: userDetails?.email || "unknown@example.com",
        role: member.role,
        isOnline: false, // TODO: Implement real online status from Firebase
        joinedAt: member.joinedAt
      };
    });

    // Get creator details
    const creator = members.find(m => m.id === group.createdBy);
    
    // Get recent messages for shared resources (placeholder)
    const sharedFiles: SharedFile[] = []; // TODO: Implement shared files from messages

    const groupInfo = {
      _id: group._id,
      name: group.name,
      description: group.description,
      subject: "General", // TODO: Add subject field to Group model
      teacher: creator ? {
        _id: creator.id,
        name: creator.name,
        email: creator.email
      } : null,
      members: formattedMembers,
      sharedFiles,
      settings: group.settings,
      isPublic: group.isPublic,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    };

    return NextResponse.json({ group: groupInfo });
  } catch (error) {
    console.error("Failed to fetch group details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
