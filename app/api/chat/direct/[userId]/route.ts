import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getDatabase } from "@/lib/mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.email
    const targetUserId = params.userId

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Find or create direct conversation between users
    const conversation = await db.collection("conversations").findOne({
      type: "direct",
      participants: { $all: [currentUserId, targetUserId] }
    })

    if (!conversation) {
      // Create new direct conversation
      const newConversation = {
        type: "direct",
        participants: [currentUserId, targetUserId],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: null,
        metadata: {
          createdBy: currentUserId
        }
      }

      const result = await db.collection("conversations").insertOne(newConversation)
      
      return NextResponse.json({
        ...newConversation,
        _id: result.insertedId.toString()
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error in direct chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.email
    const targetUserId = params.userId
    const body = await request.json()

    const db = await getDatabase()
    
    // Find existing conversation
    const conversation = await db.collection("conversations").findOne({
      type: "direct",
      participants: { $all: [currentUserId, targetUserId] }
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Add message to conversation
    const message = {
      conversationId: conversation._id.toString(),
      sender: currentUserId,
      content: body.content,
      type: body.type || "text",
      metadata: body.metadata || {},
      createdAt: new Date(),
      read: false,
      deliveryStatus: "sent"
    }

    await db.collection("messages").insertOne(message)

    // Update conversation last message
    await db.collection("conversations").updateOne(
      { _id: conversation._id },
      { 
        $set: { 
          lastMessage: message,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error posting message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
