import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Group, Chat as Message } from "@/models/index";
import { firebaseAdmin } from "@/lib/services/firebase"; // Import firebase admin

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

// ... (GET handler remains unchanged)
export async function GET(request: NextRequest, { params }: { params: Params }) {
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
    const messagesCollection = db.collection<Message>("chats");

    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some(memberId => memberId.equals(currentUser._id));
    if (!isMember) {
      return NextResponse.json({ error: "Access denied. You are not a member of this group." }, { status: 403 });
    }

    const messages = await messagesCollection.aggregate([
      { $match: { groupId: new ObjectId(groupId) } },
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $project: {
          content: 1,
          createdAt: 1,
          sender: {
            _id: "$sender._id",
            name: "$sender.name",
            avatar: "$sender.avatar",
          },
        },
      },
    ]).toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// POST /api/groups/{id}/messages - Send a message to a group
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

    const { content, type = 'text' } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const messagesCollection = db.collection<Message>("chats");

    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some(memberId => memberId.equals(currentUser._id));
    if (!isMember) {
      return NextResponse.json({ error: "Access denied. You cannot post in a group you are not a member of." }, { status: 403 });
    }

    const newMessage: Omit<Message, '_id'> = {
      groupId: new ObjectId(groupId),
      senderId: new ObjectId(currentUser._id),
      content,
      type,
      createdAt: new Date(),
    };

    const result = await messagesCollection.insertOne(newMessage as Message);
    const createdMessage = { _id: result.insertedId, ...newMessage };

    // --- SYNC WITH FIREBASE ---
    try {
        // To ensure consistency, the message broadcast to Firebase should have the same shape
        // as the messages retrieved by the GET endpoint.
        const messageForRealtime = {
            _id: createdMessage._id.toString(),
            content: createdMessage.content,
            createdAt: createdMessage.createdAt.toISOString(), // Use ISO string for consistency
            sender: {
                _id: currentUser._id.toString(),
                name: currentUser.name || 'Anonymous',
                avatar: currentUser.avatar || null,
            },
        };
        await firebaseAdmin.publishMessageToRealtimeDb(groupId, messageForRealtime as any);
    } catch (firebaseError) {
        console.error("Firebase sync failed after sending message:", firebaseError);
        // In production, you might want to handle this more gracefully
    }
    // --- END SYNC ---

    return NextResponse.json({ message: "Message sent successfully", createdMessage }, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
