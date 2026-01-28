import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { firebaseAdmin } from "@/lib/services/firebase"

export const dynamic = "force-dynamic"

// POST /api/groups/direct - Send direct message
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientId, content } = await request.json()
    if (!recipientId || !content) {
      return NextResponse.json({ error: "Recipient ID and content are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(recipientId)) {
      return NextResponse.json({ error: "Invalid recipient ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const messagesCollection = db.collection("direct_messages")

    // Verify recipient exists
    const recipient = await usersCollection.findOne({ _id: new ObjectId(recipientId) })
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // Create direct message
    const newMessage = {
      senderId: new ObjectId(currentUser._id),
      recipientId: new ObjectId(recipientId),
      content,
      type: "text",
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [new ObjectId(currentUser._id)], // Sender has read it
    }

    const result = await messagesCollection.insertOne(newMessage)
    const createdMessage = { _id: result.insertedId, ...newMessage }

    // Sync with Firebase for real-time updates
    try {
      await firebaseAdmin.publishDirectMessage(
        currentUser._id.toString(),
        recipientId,
        {
          content,
          senderId: currentUser._id.toString(),
          senderName: currentUser.name,
          senderEmail: currentUser.email,
          createdAt: newMessage.createdAt,
          _id: result.insertedId.toString(),
        }
      )
    } catch (firebaseError) {
      console.error("Firebase sync failed for direct message:", firebaseError)
    }

    return NextResponse.json({ 
      message: "Direct message sent successfully", 
      message: createdMessage 
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to send direct message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// GET /api/groups/direct/[userId] - Get direct messages with user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = params
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const messagesCollection = db.collection("direct_messages")
    const usersCollection = db.collection("users")

    // Get messages between current user and specified user
    const messages = await messagesCollection
      .find({
        $or: [
          { senderId: new ObjectId(currentUser._id), recipientId: new ObjectId(userId) },
          { senderId: new ObjectId(userId), recipientId: new ObjectId(currentUser._id) }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray()

    // Populate sender information
    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = await usersCollection.findOne({ _id: message.senderId })
        return {
          _id: message._id,
          content: message.content,
          senderId: message.senderId.toString(),
          recipientId: message.recipientId.toString(),
          createdAt: message.createdAt,
          sender: {
            _id: sender._id.toString(),
            name: sender.name,
            avatar: sender.avatar,
          },
        }
      })
    )

    return NextResponse.json({ messages: populatedMessages })
  } catch (error) {
    console.error("Failed to get direct messages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
