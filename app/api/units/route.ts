import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/units?course=Physics&level=S1 - Get units for a specific course/level
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const course = searchParams.get("course")
    const level = searchParams.get("level")

    const db = await getDatabase()
    const unitsCol = db.collection("units")
    const coursesCol = db.collection("courses")
    const levelsCol = db.collection("levels")

    let query: any = {}
    
    if (course) {
      const courseDoc = await coursesCol.findOne({ name: course })
      if (courseDoc) {
        query.courseId = courseDoc._id
      }
    }
    
    if (level) {
      const levelDoc = await levelsCol.findOne({ name: level })
      if (levelDoc) {
        query.levelId = levelDoc._id
      }
    }

    const units = await unitsCol
      .find(query)
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ units })
  } catch (error) {
    console.error("Units error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
