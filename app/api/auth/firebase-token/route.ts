import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { firebaseAuthService } from "@/services/firebaseAuthService"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { uid } = body

    // Use the authenticated user's ID if not provided
    const targetUid = uid || session.user.id

    if (!targetUid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Only allow users to get tokens for themselves (unless admin)
    if (targetUid !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    console.log("[Quix] Firebase token request for UID:", targetUid)

    // Get user from MongoDB to include in custom claims
    const db = await connectToDatabase()
    const userDoc = await db.collection('users').findOne({ id: targetUid })
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Cast to User type
    const user = userDoc as any

    // Generate Firebase custom token with user claims
    const token = await firebaseAuthService.generateCustomToken(user)

    if (!token) {
      throw new Error("Failed to generate token")
    }

    console.log("[Quix] Firebase token generated successfully for:", targetUid)

    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      }
    })
  } catch (error) {
    console.error("[Quix] Error creating Firebase token:", error)
    return NextResponse.json(
      { error: "Failed to create token", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For GET requests, generate token for the authenticated user
    const db = await connectToDatabase()
    const userDoc = await db.collection('users').findOne({ id: session.user.id })
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Cast to User type
    const user = userDoc as any

    const token = await firebaseAuthService.generateCustomToken(user)

    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      }
    })
  } catch (error) {
    console.error("[Quix] Error in Firebase token GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
