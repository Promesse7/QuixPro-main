import { type NextRequest, NextResponse } from "next/server"
import { getLeaderboardData } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")
    const exam = searchParams.get("exam")
    const limit = searchParams.get("limit")

    const filters = {
      level: level || undefined,
      exam: exam || undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
    }

    const leaderboard = await getLeaderboardData(filters)

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
