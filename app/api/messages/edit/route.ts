import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getCurrentUserId } from "@/lib/userUtils"

export async function PATCH(request: NextRequest) {
  try {
    const { messageId, content } = await request.json()
    const userId = getCurrentUserId()

    if (!messageId || !content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get the message to verify ownership
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Verify the user is the sender
    if (message.senderId !== userId) {
      return NextResponse.json({ error: "Unauthorized to edit this message" }, { status: 403 })
    }

    // Check if message is within edit window (5 minutes)
    const messageAge = Date.now() - new Date(message.createdAt).getTime()
    const editWindowMs = 5 * 60 * 1000

    if (messageAge > editWindowMs) {
      return NextResponse.json({ error: "Message edit window expired" }, { status: 400 })
    }

    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          content,
          isEdited: true,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: result.modifiedCount > 0,
      message: { ...message, content, isEdited: true, updatedAt: new Date() },
    })
  } catch (error: any) {
    console.error("[v0] Message edit error:", error)
    return NextResponse.json({ error: "Failed to edit message" }, { status: 500 })
  }
}
