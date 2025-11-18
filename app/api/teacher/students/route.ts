import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/students?teacherId=...
// For now this returns all students in the system; later it can be scoped per teacher/class.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCol = db.collection("users")

    // Ensure caller teacher exists (basic safety)
    const teacher = await usersCol.findOne({ id: teacherId, role: "teacher" })
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    const students = await usersCol
      .find({ role: "student" })
      .sort({ createdAt: -1 })
      .toArray()

    const items = students.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      level: u.level,
      averageScore: u.progress?.averageScore ?? 0,
    }))

    return NextResponse.json({ students: items })
  } catch (error) {
    console.error("Teacher students error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
