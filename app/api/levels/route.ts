import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/levels - list education levels with course counts
export async function GET(_request: NextRequest) {
  try {
    const db = await getDatabase()
    const levelsCol = db.collection("levels")
    const coursesCol = db.collection("courses")

    const levels = await levelsCol
      .find({})
      .sort({ name: 1 })
      .toArray()

    // Enhance levels with course count
    const enhancedLevels = await Promise.all(
      levels.map(async (level) => {
        const courseCount = await coursesCol.countDocuments({
          levelId: level._id,
        })
        return {
          _id: level._id.toString(),
          name: level.name,
          stage: level.stage,
          code: level.code,
          description: level.description,
          courseCount,
        }
      })
    )

    return NextResponse.json({ levels: enhancedLevels })
  } catch (error) {
    console.error("Levels error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
