import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

function isValidObjectId(id: string) {
  try {
    new ObjectId(id)
    return true
  } catch {
    return false
  }
}

// GET /api/courses?level=S1 or /api/courses?levelId=<id>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")
    const levelId = searchParams.get("levelId")

    const db = await getDatabase()
    const coursesCol = db.collection("courses")
    const levelsCol = db.collection("levels")

    let query: any = {}
    let levelName = ""

    if (levelId && isValidObjectId(levelId)) {
      // Query by level ID
      const levelDoc = await levelsCol.findOne({ _id: new ObjectId(levelId) })
      if (levelDoc) {
        query.levelId = new ObjectId(levelId)
        levelName = levelDoc.name || levelId
      }
    } else if (level) {
      // Query by level name
      const levelDoc = await levelsCol.findOne({ name: level })
      if (levelDoc) {
        query.levelId = levelDoc._id
        levelName = level
      }
    }

    const courses = await coursesCol
      .find(query)
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ courses, levelName })
  } catch (error) {
    console.error("Courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
