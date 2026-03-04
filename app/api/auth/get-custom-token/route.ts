import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getDatabase } from "@/lib/mongodb"
import { firebaseAdmin } from "@/lib/services/firebase"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()
    const userEmail = email || session.user.email

    // Get current user from auth lib (which uses localStorage)
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get or create Firebase user
    let firebaseUser
    try {
      firebaseUser = await firebaseAdmin.auth.getUserByEmail(userEmail)
    } catch (error) {
      // Create Firebase user if doesn't exist
      firebaseUser = await firebaseAdmin.auth.createUser({
        email: userEmail,
        uid: currentUser.id, // Use user ID from auth lib
        displayName: currentUser.name,
        emailVerified: true,
        password: Math.random().toString(36).slice(-8), // Random password
      })
    }

    // Set custom claims
    await firebaseAdmin.auth.setCustomUserClaims(firebaseUser.uid, {
      email: userEmail,
      role: currentUser.role || 'student',
      level: currentUser.level || 'Beginner',
      mongoId: currentUser.id
    })

    // Create custom token
    const customToken = await firebaseAdmin.auth.createCustomToken(firebaseUser.uid, {
      email: userEmail,
      role: currentUser.role || 'student'
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
