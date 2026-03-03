import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { syncUserWithFirebase } from "@/lib/firebase-auth"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = session.user.email
    const db = await getDatabase()
    
    // Get user from MongoDB
    const mongoUser = await db.collection("users").findOne({ email: userEmail })
    
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found in MongoDB" }, { status: 404 })
    }

    // Sync with Firebase
    const firebaseUser = await syncUserWithFirebase(mongoUser)
    
    return NextResponse.json({
      success: true,
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      message: "User synced with Firebase successfully"
    })
  } catch (error: any) {
    console.error("Error syncing user with Firebase:", error)
    return NextResponse.json({ 
      error: "Failed to sync user with Firebase", 
      details: error.message 
    }, { status: 500 })
  }
}
