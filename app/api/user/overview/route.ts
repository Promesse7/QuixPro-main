import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    const db = await getDatabase()
    const usersCol = db.collection("users")
    const attemptsCol = db.collection("quiz_attempts")
    const certsCol = db.collection("certificates")

    const user = await usersCol.findOne({ _id: new ObjectId(userId) })

    const totalXP = user?.gamification?.totalXP || 0
    const streak = user?.gamification?.streak || 0
    const level = Math.max(1, Math.floor(totalXP / 1000))

    const attempts = await attemptsCol.find({ userId }).sort({ createdAt: -1 }).limit(20).toArray()
    const certificates = await certsCol.find({ userId: userId.toString() }).sort({ completedAt: -1 }).limit(20).toArray()

    const activities = [
      ...attempts.map((a: any) => ({
        id: a._id.toString(),
        type: "quiz_completed" as const,
        title: `Completed quiz ${a.quizId}`,
        score: a.percentage,
        date: a.createdAt,
        subject: "Quiz"
      })),
      ...certificates.map((c: any) => ({
        id: c._id.toString(),
        type: "certificate_earned" as const,
        title: c.title,
        date: c.completedAt || c.createdAt,
        subject: c.course || "Certificate"
      }))
    ].sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())

    const goals = [
      { id: "g1", title: "Complete 5 quizzes", current: attempts.length % 5, target: 5, progress: Math.min(100, ((attempts.length % 5) / 5) * 100) },
      { id: "g2", title: "Reach next XP milestone", current: totalXP % 1000, target: 1000, progress: Math.min(100, ((totalXP % 1000) / 1000) * 100) }
    ]

    return NextResponse.json({ xp: totalXP, level, streak, activities, goals })
  } catch (e) {
    console.error("overview GET error", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
