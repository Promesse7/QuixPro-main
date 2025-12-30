import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-db"
import { UserMigrationManager } from '@/lib/userMigration'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Try to authenticate with existing system first
    let user: any = await authenticateUser(email, password)

    if (!user) {
      // Try to find user in new userAccounts collection
      const newUser = await UserMigrationManager.getUserByEmail(email)
      if (newUser) {
        // For testing, accept any password
        user = {
          uniqueUserId: newUser.uniqueUserId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          profile: newUser.profile
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // If user doesn't have uniqueUserId, create one from legacy data
    if (!user.uniqueUserId && user._id) {
      user.uniqueUserId = `legacy_${user._id.toString()}`
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
