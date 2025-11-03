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

// GET /api/units?course=Physics&level=S1 or /api/units?courseId=<id>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const course = searchParams.get("course")
    const courseId = searchParams.get("courseId")
    const level = searchParams.get("level")

    const db = await getDatabase()
    const unitsCol = db.collection("units")
    const coursesCol = db.collection("courses")
    const levelsCol = db.collection("levels")

    let query: any = {}
    let courseName = ""

    if (courseId && isValidObjectId(courseId)) {
      // Query by course ID
      const courseDoc = await coursesCol.findOne({ _id: new ObjectId(courseId) })
      if (courseDoc) {
        query.courseId = new ObjectId(courseId)
        courseName = courseDoc.name || courseId
      }
    } else if (course) {
      // Query by course name
      const courseDoc = await coursesCol.findOne({ name: course })
      if (courseDoc) {
        query.courseId = courseDoc._id
        courseName = course
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
      .sort({ name: 1, title: 1 })
      .toArray()

    return NextResponse.json({ units, courseName })
  } catch (error) {
    console.error("Units error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
