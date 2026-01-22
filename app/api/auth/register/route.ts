import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-db"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { email, password, name, role, level } = userData

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("[v0] Registration attempt for email:", email)

    // Register user in MongoDB (like your chat system)
    const user = await registerUser(userData)

    if (!user) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 })
    }

    console.log("[v0] User registered with userId:", user._id)

    // Award Account Creator badge
    try {
      const db = await getDatabase()
      const badgesCol = db.collection("badges")
      const usersCol = db.collection("users")

      const accountCreatorBadge = await badgesCol.findOne({ name: "Account Creator" })

      if (accountCreatorBadge) {
        const newBadge = {
          badgeId: accountCreatorBadge._id.toString(),
          name: accountCreatorBadge.name,
          earnedAt: new Date(),
          tier: accountCreatorBadge.tier,
        }

        await usersCol.updateOne(
          { _id: user._id },
          {
            $push: { "gamification.badges": newBadge },
            $inc: { "gamification.totalXP": accountCreatorBadge.xpReward || 50 },
          }
        )
      }
    } catch (badgeError) {
      console.warn("[v0] Could not award badge:", badgeError)
    }

    console.log("[v0] Registration successful for email:", email)

    return NextResponse.json({
      user: {
        userId: user._id?.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Registration successful. Please log in.",
    })
  } catch (error: any) {
    console.error("[v0] Registration error:", error.message)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
