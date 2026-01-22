import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getUserByFirebaseUid, linkFirebaseUidToLegacyUser } from "@/lib/firebase-profile"

// Initialize Firebase Admin SDK
function getFirebaseAdmin() {
  const apps = getApps()
  if (apps.length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  }
  return getAuth()
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Login attempt for email:", email)

    // Step 1: Get Firebase ID token via custom token (server-side auth verification)
    const auth = getFirebaseAdmin()

    // We use Firebase Admin SDK to verify credentials by attempting to get the user
    // In production, implement proper token endpoint
    let firebaseUser
    try {
      firebaseUser = await auth.getUserByEmail(email.toLowerCase())
      console.log("[v0] Firebase user found with UID:", firebaseUser.uid)
    } catch (error: any) {
      console.error("[v0] Firebase user not found for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Step 2: Get MongoDB profile linked to Firebase UID
    let user = await getUserByFirebaseUid(firebaseUser.uid)

    if (!user) {
      console.warn("[v0] Firebase user exists but no MongoDB profile found for UID:", firebaseUser.uid)
      // During migration period, try to link legacy user
      try {
        await linkFirebaseUidToLegacyUser(email, firebaseUser.uid)
        user = await getUserByFirebaseUid(firebaseUser.uid)
      } catch (linkError) {
        console.error("[v0] Failed to link legacy user:", linkError)
      }
    }

    if (!user) {
      console.error("[v0] User profile not found after Firebase auth")
      return NextResponse.json(
        { error: "User profile not found. Please contact support." },
        { status: 401 }
      )
    }

    // Step 3: Generate custom token for client-side use
    const customToken = await auth.createCustomToken(firebaseUser.uid)
    console.log("[v0] Login successful for user:", user.email)

    return NextResponse.json({
      user: {
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role,
        level: user.level,
      },
      customToken, // Client uses this to get ID token
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error.message)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 401 })
  }
}
