import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-db"

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

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
