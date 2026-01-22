import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-db"
import { getDatabase } from "@/lib/mongodb"
import { sign } from "jsonwebtoken"
import { cookies } from 'next/headers'

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

    // Generate JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    cookies().set({
      name: 'qouta_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Set role cookie (non-httpOnly for client-side access)
    cookies().set({
      name: 'qouta_role',
      value: user.role,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

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

    // Return user data without sensitive information
    const { passwordHash, ...userWithoutPassword } = user as any;
    return NextResponse.json({ 
      user: userWithoutPassword,
      token // For client-side storage if needed (e.g., in localStorage)
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
