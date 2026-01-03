import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
    id: string;
}

interface SharedResource {
    _id: string;
    name: string;
    type: 'image' | 'file' | 'link' | 'math';
    url: string;
    uploadedBy: string;
    uploadedByName?: string;
    uploadedAt: string;
    size?: number;
    preview?: string;
}

// GET /api/groups/{id}/resources - Get shared resources for a group
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id: groupId } = params;
        const { searchParams } = new URL(request.url);
        const typeFilter = searchParams.get('type'); // Optional filter: image, file, link, math
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!ObjectId.isValid(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
        }

        const db = await getDatabase();
        const messagesCollection = db.collection("messages");
        const usersCollection = db.collection("users");

        // Build query for messages with attachments
        const query: any = {
            groupId: groupId,
            $or: [
                { type: { $in: ['image', 'file'] } },
                { 'metadata.fileUrl': { $exists: true } },
                { content: { $regex: /^https?:\/\//i } } // Links in content
            ]
        };

        // Fetch messages with resources
        const messages = await messagesCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();

        // Get sender details
        const senderIds = [...new Set(messages.map(m => m.senderId))];
        const senders = await usersCollection.find({
            $or: [
                { id: { $in: senderIds } },
                { _id: { $in: senderIds.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id)) } }
            ]
        }).toArray();

        const senderMap = new Map(senders.map(s => [s.id || s._id?.toString(), s]));

        // Process and format resources
        const resources: SharedResource[] = [];

        for (const msg of messages) {
            const sender = senderMap.get(msg.senderId) || senderMap.get(msg.senderId?.toString());
            const senderName = sender?.name || 'Unknown';

            // Handle file/image attachments
            if (msg.metadata?.fileUrl) {
                const resourceType = determineResourceType(msg.type, msg.metadata.fileType);

                // Skip if type filter doesn't match
                if (typeFilter && resourceType !== typeFilter) continue;

                resources.push({
                    _id: msg._id.toString(),
                    name: msg.metadata.fileName || 'Untitled',
                    type: resourceType,
                    url: msg.metadata.fileUrl,
                    uploadedBy: msg.senderId,
                    uploadedByName: senderName,
                    uploadedAt: msg.createdAt?.toISOString() || new Date().toISOString(),
                    size: msg.metadata.fileSize,
                    preview: resourceType === 'image' ? msg.metadata.fileUrl : undefined
                });
            }

            // Handle links in message content
            if (msg.content && /^https?:\/\//i.test(msg.content.trim())) {
                if (typeFilter && typeFilter !== 'link') continue;

                resources.push({
                    _id: `${msg._id}-link`,
                    name: extractDomain(msg.content.trim()),
                    type: 'link',
                    url: msg.content.trim(),
                    uploadedBy: msg.senderId,
                    uploadedByName: senderName,
                    uploadedAt: msg.createdAt?.toISOString() || new Date().toISOString()
                });
            }

            // Handle math expressions (messages with LaTeX)
            if (msg.type === 'math' || (msg.content && /\$\$[\s\S]+\$\$|\\\[[\s\S]+\\\]/.test(msg.content))) {
                if (typeFilter && typeFilter !== 'math') continue;

                resources.push({
                    _id: `${msg._id}-math`,
                    name: 'Math Expression',
                    type: 'math',
                    url: '', // Math expressions don't have URLs
                    uploadedBy: msg.senderId,
                    uploadedByName: senderName,
                    uploadedAt: msg.createdAt?.toISOString() || new Date().toISOString(),
                    preview: msg.content?.substring(0, 100)
                });
            }
        }

        return NextResponse.json({
            resources,
            total: resources.length
        });
    } catch (error) {
        console.error("Failed to fetch shared resources:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Helper: Determine resource type from message type and file type
function determineResourceType(msgType: string, fileType?: string): 'image' | 'file' | 'link' | 'math' {
    if (msgType === 'image') return 'image';
    if (msgType === 'math') return 'math';

    if (fileType) {
        if (fileType.startsWith('image/')) return 'image';
    }

    return 'file';
}

// Helper: Extract domain from URL
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url.substring(0, 30);
    }
}
