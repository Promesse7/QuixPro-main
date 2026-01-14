import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { firebaseAdmin } from "@/lib/services/firebase";
import { getDatabase } from "@/lib/mongodb";
import { Group } from "@/models";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
    id: string;
}

// POST /api/groups/{id}/typing - Broadcast typing status
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

        const { isTyping } = await request.json();
        if (typeof isTyping !== 'boolean') {
            return NextResponse.json({ error: "Invalid isTyping status" }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection<Group>("groups");

        const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        const isMember = group.members.some(memberId => memberId.equals(currentUser._id));
        if (!isMember) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        await firebaseAdmin.broadcastTypingIndicator(groupId, currentUser._id.toString(), isTyping);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to broadcast typing indicator:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
