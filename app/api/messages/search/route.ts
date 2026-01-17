import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, query, limit = 20 } = await request.json()

    if (!conversationId || !query) {
      return NextResponse.json({ error: "Missing conversationId or query" }, { status: 400 })
    }

    const db = await getDatabase()

    // Search messages by content with MongoDB text search
    const results = await db
      .collection("messages")
      .find({
        groupId: conversationId,
        $or: [{ content: { $regex: query, $options: "i" } }, { "mentions.username": { $regex: query, $options: "i" } }],
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ messages: results })
  } catch (error: any) {
    console.error("[v0] Message search error:", error)
    return NextResponse.json({ error: "Failed to search messages" }, { status: 500 })
  }
}
