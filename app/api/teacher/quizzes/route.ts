import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/quizzes?teacherId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const quizzesCol = db.collection("quizzes")

    // Filter quizzes created by this teacher
    const quizzes = await quizzesCol
      .find({ createdBy: teacherId })
      .sort({ createdAt: -1 })
      .toArray()

    // Shape response for QuizManagement component
    const items = quizzes.map((q: any) => ({
      id: q._id.toString(),
      title: q.title ?? "Untitled Quiz",
      subject: q.subject ?? "",
      level: q.level ?? "",
      students: q.stats?.students ?? 0,
      avgScore: q.stats?.averageScore ?? 0,
      created: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
      status: (q.status as "active" | "draft" | "archived") ?? (q.isPublic ? "active" : "draft"),
    }))

    return NextResponse.json({ quizzes: items })
  } catch (error) {
    console.error("Teacher quizzes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
