import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
    id: string;
}

interface PinnedMessage {
    _id: string;
    content: string;
    senderId: string;
    senderName: string;
    pinnedAt: Date;
    pinnedBy: string;
    messageType: 'text' | 'image' | 'file' | 'math';
}

// GET /api/groups/{id}/pins - Get pinned messages for a group
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id: groupId } = params;

        if (!ObjectId.isValid(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection("groups");
        const messagesCollection = db.collection("messages");
        const usersCollection = db.collection("users");

        // Check if group exists
        const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Get pinned message IDs from group
        const pinnedMessageIds = group.pinnedMessageIds || [];

        if (pinnedMessageIds.length === 0) {
            return NextResponse.json({ pins: [] });
        }

        // Fetch pinned messages
        const pinnedMessages = await messagesCollection.find({
            _id: {
                $in: pinnedMessageIds.map((id: string) => {
                    try {
                        return ObjectId.isValid(id) ? new ObjectId(id) : id;
                    } catch {
                        return id;
                    }
                })
            }
        }).toArray();

        // Get sender details
        const senderIds = [...new Set(pinnedMessages.map(m => m.senderId))];
        const senders = await usersCollection.find({
            $or: [
                { id: { $in: senderIds } },
                { _id: { $in: senderIds.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id)) } }
            ]
        }).toArray();

        const senderMap = new Map(senders.map(s => [s.id || s._id?.toString(), s]));

        // Format response
        const pins: PinnedMessage[] = pinnedMessages.map(msg => {
            const sender = senderMap.get(msg.senderId) || senderMap.get(msg.senderId?.toString());
            return {
                _id: msg._id.toString(),
                content: msg.content || '',
                senderId: msg.senderId,
                senderName: sender?.name || 'Unknown',
                pinnedAt: msg.pinnedAt || msg.createdAt || new Date(),
                pinnedBy: msg.pinnedBy || msg.senderId,
                messageType: msg.type || 'text'
            };
        });

        return NextResponse.json({ pins });
    } catch (error) {
        console.error("Failed to fetch pinned messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/groups/{id}/pins - Pin a message
export async function POST(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id: groupId } = params;
        const { messageId } = await request.json();

        if (!ObjectId.isValid(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
        }

        if (!messageId) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection("groups");

        // Add message to pinned list
        await groupsCollection.updateOne(
            { _id: new ObjectId(groupId) },
            {
                $addToSet: { pinnedMessageIds: messageId },
                $set: { updatedAt: new Date() }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to pin message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/groups/{id}/pins - Unpin a message
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id: groupId } = params;
        const { searchParams } = new URL(request.url);
        const messageId = searchParams.get('messageId');

        if (!ObjectId.isValid(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
        }

        if (!messageId) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection("groups");

        // Remove message from pinned list
        await groupsCollection.updateOne(
            { _id: new ObjectId(groupId) },
            {
                $pull: { pinnedMessageIds: messageId } as any,
                $set: { updatedAt: new Date() }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to unpin message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
