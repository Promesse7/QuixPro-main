import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCol = db.collection("users")

    // Get all students and group them by level to create "classes"
    const students = await usersCol
      .find({ role: "student" })
      .sort({ level: 1, createdAt: -1 })
      .toArray()

    // Group students by level to simulate classes
    const classMap = new Map<string, any>()
    
    students.forEach((student: any) => {
      const level = student.level || 'Unknown'
      if (!classMap.has(level)) {
        classMap.set(level, {
          id: level,
          name: `${level} Class`,
          students: 0,
          level: level,
          subject: 'General',
          avgScore: 0,
          activeQuizzes: 0,
        })
      }
      const classData = classMap.get(level)
      classData.students += 1
      classData.avgScore += student.progress?.averageScore || 0
    })

    // Calculate average scores
    const classes = Array.from(classMap.values()).map((classData: any) => ({
      ...classData,
      avgScore: classData.students > 0 ? Math.round(classData.avgScore / classData.students) : 0
    }))

    return NextResponse.json({ classes })

  } catch (error) {
    console.error("Error fetching teacher classes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
