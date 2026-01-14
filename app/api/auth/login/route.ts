import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-db"
import { UserMigrationManager } from "@/lib/userMigration"
import { emailToUniqueId } from "@/lib/identifiers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    let user: any = await authenticateUser(email, password)

    if (!user) {
      const newUser = await UserMigrationManager.getUserByEmail(email)
      if (newUser) {
        user = {
          uniqueUserId: newUser.uniqueUserId || emailToUniqueId(email),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          profile: newUser.profile,
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Always enforce standardized uniqueUserId
    user.uniqueUserId = emailToUniqueId(user.email)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
