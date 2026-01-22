import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

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
    const { email, password, name, role, level } = await request.json()

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, password, name, and role are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("[v0] Registration attempt for email:", email)

    // Step 1: Create Firebase Auth user (THIS IS THE SOURCE OF TRUTH)
    const auth = getFirebaseAdmin()
    let firebaseUser
    try {
      firebaseUser = await auth.createUser({
        email: email.toLowerCase(),
        password,
        displayName: name,
      })
      console.log("[v0] Firebase user created with UID:", firebaseUser.uid)
    } catch (firebaseError: any) {
      if (firebaseError.code === "auth/email-already-exists") {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })
      }
      throw firebaseError
    }

    // Step 2: Create MongoDB profile linked to Firebase UID
    const db = await getDatabase()
    const usersCol = db.collection("users")

    const mongoUser = {
      firebaseUid: firebaseUser.uid,
      email: email.toLowerCase(),
      name,
      role,
      level: level || null,
      authProvider: "firebase",
      stats: {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        certificates: 0,
      },
      gamification: {
        totalXP: 0,
        currentLevel: 1,
        streak: 0,
        badges: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCol.insertOne(mongoUser)
    console.log("[v0] MongoDB profile created with ID:", result.insertedId)

    // Step 3: Award Account Creator badge
    try {
      const badgesCol = db.collection("badges")
      const accountCreatorBadge = await badgesCol.findOne({ name: "Account Creator" })

      if (accountCreatorBadge) {
        const newBadge = {
          badgeId: accountCreatorBadge._id.toString(),
          name: accountCreatorBadge.name,
          earnedAt: new Date(),
          tier: accountCreatorBadge.tier,
        }

        await usersCol.updateOne(
          { firebaseUid: firebaseUser.uid },
          {
            $push: { "gamification.badges": newBadge },
            $inc: {
              "gamification.totalXP": accountCreatorBadge.xpReward || 50,
            },
          }
        )
      }
    } catch (badgeError) {
      console.warn("[v0] Could not award account creation badge:", badgeError)
    }

    console.log("[v0] Registration successful for email:", email)

    return NextResponse.json({
      user: {
        firebaseUid: firebaseUser.uid,
        email: mongoUser.email,
        name: mongoUser.name,
        role: mongoUser.role,
      },
      message: "Registration successful. Please log in.",
    })
  } catch (error: any) {
    console.error("[v0] Registration error:", error.message)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
