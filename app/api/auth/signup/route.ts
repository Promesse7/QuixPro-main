import { type NextRequest, NextResponse } from "next/server"
import { createFirebaseUser } from "@/lib/firebase-auth"
import MigrationManager from "@/lib/migration-manager"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, level, school } = await request.json()

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Email, password, name, and role are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("[v0] Signup attempt for email:", email)

    // Step 1: Check if user already exists
    const existingUser = await MigrationManager.getUserByEmail(email)
    if (existingUser && existingUser.authProvider === "firebase") {
      console.log("[v0] User already exists with Firebase auth:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Step 2: Create Firebase Auth user
    const firebaseAuth = await createFirebaseUser({
      email,
      password,
      name,
      role,
      level,
    })

    console.log("[v0] Firebase user created, UID:", firebaseAuth.firebaseUid)

    // Step 3: Create MongoDB user profile
    const userProfile = await MigrationManager.createUserProfile({
      firebaseUid: firebaseAuth.firebaseUid,
      email,
      name,
      role,
      level,
      school,
    })

    if (!userProfile) {
      console.error("[v0] Failed to create user profile after Firebase signup")
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    console.log("[v0] Signup successful for user:", email)

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          firebaseUid: userProfile.firebaseUid,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          level: userProfile.level,
        },
        idToken: firebaseAuth.idToken,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[v0] Signup error:", error.message)

    // Handle specific Firebase errors
    if (error.message.includes("already-in-use")) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 })
    }
    if (error.message.includes("invalid-email")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    if (error.message.includes("weak-password")) {
      return NextResponse.json({ error: "Password is too weak" }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
