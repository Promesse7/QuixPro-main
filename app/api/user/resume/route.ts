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
    const attemptsCol = db.collection("quiz_attempts")
    const progressCol = db.collection("user_progress")
    const certsCol = db.collection("certificates")
    const coursesCol = db.collection("courses")
    const unitsCol = db.collection("units")

    const latestAttempt = await attemptsCol
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray()

    const lastProgress = await progressCol
      .find({ userId: new ObjectId(userId) })
      .sort({ lastAccessedAt: -1 })
      .limit(1)
      .toArray()

    const latestCert = await certsCol
      .find({ userId: userId.toString() })
      .sort({ completedAt: -1 })
      .limit(1)
      .toArray()

    const lastQuizUrl = latestAttempt[0]?.quizId ? `/quiz/play/${latestAttempt[0].quizId}` : null

    let continueCourseUrl = null
    let lastLevelName: string | null = null
    let lastCourseName: string | null = null
    let lastUnitName: string | null = null
    if (lastProgress[0]?.courseId) {
      continueCourseUrl = `/quiz/unit/${lastProgress[0].courseId}`
      const courseDoc = await coursesCol.findOne({ _id: lastProgress[0].courseId })
      const unitDoc = lastProgress[0].currentUnitId ? await unitsCol.findOne({ _id: lastProgress[0].currentUnitId }) : null
      lastCourseName = courseDoc?.name || null
      lastUnitName = unitDoc?.name || null
      lastLevelName = courseDoc?.level || null
    }
    const latestCertificateUrl = latestCert[0]?._id ? `/certificates` : null

    return NextResponse.json({ lastQuizUrl, continueCourseUrl, latestCertificateUrl, lastLevelName, lastCourseName, lastUnitName })
  } catch (e) {
    console.error("resume GET error", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
