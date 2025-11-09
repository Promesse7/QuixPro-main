import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-db"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const { email, password, name, role } = userData

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const user = await registerUser(userData)

    if (!user) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 })
    }

    // Award Account Creator badge automatically
    try {
      const db = await getDatabase()
      const badgesCol = db.collection("badges")
      const usersCol = db.collection("users")

      // Find the Account Creator badge
      const accountCreatorBadge = await badgesCol.findOne({
        name: "Account Creator",
      })

      if (accountCreatorBadge) {
        // Award badge to user
        const newBadge = {
          badgeId: accountCreatorBadge._id.toString(),
          name: accountCreatorBadge.name,
          earnedAt: new Date(),
          tier: accountCreatorBadge.tier,
        }

        // Update user with badge and XP
        await usersCol.updateOne(
          { email: email.toLowerCase() },
          {
            $push: { "gamification.badges": newBadge },
            $inc: {
              "gamification.totalXP": accountCreatorBadge.xpReward || 50,
            },
          }
        )
      }
    } catch (badgeError) {
      console.warn("Warning: Could not award account creation badge:", badgeError)
      // Don't fail registration if badge award fails
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
