import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/quiz/courses?levelId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get("levelId")

    if (!levelId) {
      return NextResponse.json({ error: "levelId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const courses = await db.collection("courses")
      .find({ levelId: new ObjectId(levelId) })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
