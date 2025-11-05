import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/quiz-attempts?userId=...&quizId=... - Get user's attempts for a quiz
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const quizId = searchParams.get("quizId")
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam))) : 0

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const attemptsCol = db.collection("quiz_attempts")

    const query: any = { userId }
    if (quizId) {
      query.quizId = quizId
    }

    let cursor = attemptsCol.find(query).sort({ createdAt: -1 })
    if (limit) cursor = cursor.limit(limit)
    const attempts = await cursor.toArray()

    // Ensure percentage is present
    const normalized = attempts.map((a: any) => ({
      ...a,
      percentage: a.percentage ?? (a.score?.total ? Math.round((a.score.correct / a.score.total) * 100) : a.percentage)
    }))
    return NextResponse.json({ attempts: normalized })
  } catch (error) {
    console.error("Quiz attempts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/quiz-attempts - Record a new quiz attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, quizId, answers, timeElapsed, score } = body

    if (!userId || !quizId || !answers || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const attemptsCol = db.collection("quiz_attempts")
    const usersCol = db.collection("users")

    // Check if user already completed this quiz
    const existingAttempt = await attemptsCol.findOne({ 
      userId, 
      quizId, 
      status: "completed" 
    })

    if (existingAttempt) {
      return NextResponse.json({ 
        error: "Quiz already completed", 
        attempt: existingAttempt 
      }, { status: 409 })
    }

    // Create new attempt
    const attempt = {
      _id: new ObjectId(),
      userId,
      quizId,
      answers,
      timeElapsed,
      score,
      percentage: Math.round((score.correct / score.total) * 100),
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await attemptsCol.insertOne(attempt)

    // Generate certificate if score is 70% or higher
    if (attempt.percentage >= 70) {
      await generateCertificate(db, userId, quizId, attempt.percentage)
    }

    // Update user stats
    await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: {
          "stats.completedQuizzes": 1,
          "stats.totalPoints": Math.round(attempt.percentage / 10), // 10 points per 10%
        },
        $set: {
          "stats.averageScore": await calculateAverageScore(db, userId),
          updatedAt: new Date(),
        }
      }
    )

    return NextResponse.json({ attempt }, { status: 201 })
  } catch (error) {
    console.error("Create quiz attempt error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to generate certificate
async function generateCertificate(db: any, userId: string, quizId: string, score: number) {
  try {
    const quizzesCol = db.collection("quizzes")
    const certificatesCol = db.collection("certificates")
    
    // Get quiz details
    const quiz = await quizzesCol.findOne({ _id: new ObjectId(quizId) })
    if (!quiz) return

    // Check if certificate already exists
    const existingCert = await certificatesCol.findOne({
      userId: userId.toString(),
      quizId: quizId,
      type: "quiz"
    })

    if (existingCert) return // Certificate already exists

    // Create new certificate
    const certificate = {
      _id: new ObjectId(),
      userId: userId.toString(),
      quizId: quizId,
      title: `${quiz.title} - Completion Certificate`,
      course: quiz.subject,
      level: quiz.level,
      score: score,
      type: "quiz",
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await certificatesCol.insertOne(certificate)
    console.log(`Certificate generated for user ${userId}, quiz ${quizId}, score ${score}%`)
  } catch (error) {
    console.error("Error generating certificate:", error)
  }
}

// Helper function to calculate average score
async function calculateAverageScore(db: any, userId: string) {
  const attemptsCol = db.collection("quiz_attempts")
  const attempts = await attemptsCol.find({ userId, status: "completed" }).toArray()
  
  if (attempts.length === 0) return 0
  
  const totalPercentage = attempts.reduce((sum: number, attempt: any) => sum + attempt.percentage, 0)
  return Math.round(totalPercentage / attempts.length)
}
