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

    const targetUserId = params.userId

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Find user by ID (email or custom ID)
    const user = await db.collection("users").findOne({
      $or: [
        { email: targetUserId },
        { _id: targetUserId }
      ]
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data without sensitive information
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      level: user.level || "Beginner",
      points: user.points || 0,
      streak: user.streak || 0,
      createdAt: user.createdAt,
      lastActive: user.lastActive
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
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

    // Users can only update their own profile
    if (currentUserId !== targetUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    
    // Update user data
    const updateData = {
      ...body,
      updatedAt: new Date(),
      lastActive: new Date()
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData._id
    delete updateData.createdAt
    delete updateData.email // Email changes should be handled separately

    const result = await db.collection("users").updateOne(
      { email: targetUserId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
