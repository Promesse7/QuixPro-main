import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/quiz/units?courseId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const units = await db.collection("units")
      .find({ courseId: new ObjectId(courseId) })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ units })
  } catch (error) {
    console.error("Error fetching units:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
