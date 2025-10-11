import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET /api/levels - list education levels
export async function GET(_request: NextRequest) {
  try {
    const db = await getDatabase()
    const levelsCol = db.collection("levels")
    const levels = await levelsCol
      .find({})
      .project({ _id: 0, name: 1, stage: 1 })
      .sort({ name: 1 })
      .toArray()
    return NextResponse.json({ levels })
  } catch (error) {
    console.error("Levels error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

