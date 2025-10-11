import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/courses?level=S1 - Get courses for a specific level
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")

    const db = await getDatabase()
    const coursesCol = db.collection("courses")
    const levelsCol = db.collection("levels")

    let query: any = {}
    if (level) {
      const levelDoc = await levelsCol.findOne({ name: level })
      if (levelDoc) {
        query.levelId = levelDoc._id
      }
    }

    const courses = await coursesCol
      .find(query)
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
