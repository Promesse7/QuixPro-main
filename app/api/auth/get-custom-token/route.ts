import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getDatabase } from "@/lib/mongodb"
import { auth } from "@/lib/services/firebase"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()
    const userEmail = email || session.user.email

    const db = await getDatabase()
    
    // Get user from MongoDB
    const mongoUser = await db.collection("users").findOne({ email: userEmail })
    
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get or create Firebase user
    let firebaseUser
    try {
      firebaseUser = await auth.getUserByEmail(userEmail)
    } catch (error) {
      // Create Firebase user if doesn't exist
      firebaseUser = await auth.createUser({
        email: userEmail,
        uid: mongoUser._id.toString(),
        displayName: mongoUser.name,
        emailVerified: true,
        password: Math.random().toString(36).slice(-8), // Random password
      })
    }

    // Set custom claims
    await auth.setCustomUserClaims(firebaseUser.uid, {
      email: userEmail,
      role: mongoUser.role || 'student',
      level: mongoUser.level || 'Beginner',
      mongoId: mongoUser._id.toString()
    })

    // Create custom token
    const customToken = await auth.createCustomToken(firebaseUser.uid, {
      email: userEmail,
      role: mongoUser.role || 'student'
    })

    return NextResponse.json({ 
      token: customToken,
      uid: firebaseUser.uid,
      email: userEmail
    })
  } catch (error: any) {
    console.error("Error getting custom token:", error)
    return NextResponse.json({ 
      error: "Failed to get custom token", 
      details: error.message 
    }, { status: 500 })
  }
}
