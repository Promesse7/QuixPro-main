import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getCurrentUserId } from "@/lib/userUtils"

export async function DELETE(request: NextRequest) {
  try {
    const { messageId } = await request.json()
    const userId = getCurrentUserId()

    if (!messageId || !userId) {
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
      return NextResponse.json({ error: "Unauthorized to delete this message" }, { status: 403 })
    }

    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          content: "[This message was deleted]",
          deletedAt: new Date(),
          deletedBy: userId,
        },
      },
    )

    return NextResponse.json({
      success: result.modifiedCount > 0,
      message: "Message deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Message delete error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
