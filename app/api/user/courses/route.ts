import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const levelId = searchParams.get("levelId")

    if (!levelId) {
      return NextResponse.json({ error: "Level ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const coursesCol = db.collection("courses")

    const courses = await coursesCol.find({ levelId: new ObjectId(levelId) }).toArray()

    return NextResponse.json({
      courses: courses.map((course) => ({
        id: course._id.toString(),
        name: course.name,
        description: course.description,
      })),
    })
  } catch (error) {
    console.error("Courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
