import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Login attempt for email:", email)

    // Authenticate via MongoDB (like your chat system)
    const user = await authenticateUser(email, password)

    if (!user) {
      console.error("[v0] Invalid credentials for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Login successful for user:", user.email, "with userId:", user._id)

    return NextResponse.json({
      user: {
        userId: user._id?.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        level: user.level,
      },
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error.message)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}
