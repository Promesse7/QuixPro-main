import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"

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

    const query: any = { userId: new ObjectId(userId) }
    if (quizId) {
      query.quizId = new ObjectId(quizId)
    }

    let cursor = attemptsCol.find(query).sort({ createdAt: -1 })
    if (limit) cursor = cursor.limit(limit)
    const attempts = await cursor.toArray()

    // Ensure percentage is present
    const normalized = attempts.map((a: any) => ({
      ...a,
      percentage: a.percentage ?? (a.score?.percentage ?? Math.round((a.score?.correct / a.score?.total) * 100))
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
    const { userId, quizId, answers, timeElapsed, status = "completed" } = body

    if (!userId || !quizId || !answers) {
      return NextResponse.json({ error: "Missing required fields: userId, quizId, answers" }, { status: 400 })
    }

    const db = await getDatabase()
    const attemptsCol = db.collection("quiz_attempts")
    const quizzesCol = db.collection("quizzes")
    const usersCol = db.collection("users")

    // Get quiz details for scoring
    const quiz = await quizzesCol.findOne({ _id: new ObjectId(quizId) })
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score
    const score = calculateScore(answers, quiz.questions || [])
    
    // Create enhanced attempt record
    const attempt = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      quizId: new ObjectId(quizId),
      answers: answers.map((answer: any) => ({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
        answeredAt: answer.answeredAt || new Date()
      })),
      score: {
        correct: score.correct,
        total: score.total,
        percentage: score.percentage
      },
      timeSpent: timeElapsed || 0,
      status: status,
      startedAt: body.startedAt || new Date(),
      completedAt: status === "completed" ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      difficulty: quiz.difficulty,
      subject: quiz.subject,
      level: quiz.level
    }

    // Insert attempt
    await attemptsCol.insertOne(attempt)

    // Update user stats and progress
    await updateUserProgress(db, userId, attempt, quiz)

    // Generate certificate if score is 70% or higher
    if (score.percentage >= 70 && status === "completed") {
      await generateCertificate(db, userId, quizId, score.percentage)
      // Update attempt with certificate info
      await attemptsCol.updateOne(
        { _id: attempt._id },
        { 
          $set: { 
            certificateEarned: true,
            updatedAt: new Date()
          }
        }
      )
    }

    return NextResponse.json({ 
      attempt: {
        ...attempt,
        _id: attempt._id.toString(),
        userId: attempt.userId.toString(),
        quizId: attempt.quizId.toString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Create quiz attempt error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate score
function calculateScore(answers: any[], questions: any[]) {
  let correct = 0
  const total = questions.length

  answers.forEach((answer) => {
    if (answer.isCorrect) {
      correct++
    }
  })

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0
  }
}

// Helper function to update user progress
async function updateUserProgress(db: any, userId: string, attempt: any, quiz: any) {
  try {
    const usersCol = db.collection("users")
    const attemptsCol = db.collection("quiz_attempts")
    
    // Get user's current stats
    const user = await usersCol.findOne({ _id: new ObjectId(userId) })
    if (!user) return

    // Get all completed attempts for average calculation
    const completedAttempts = await attemptsCol.find({
      userId: new ObjectId(userId),
      status: "completed"
    }).toArray()

    const totalAttempts = completedAttempts.length
    const passedAttempts = completedAttempts.filter((a: any) => a.score.percentage >= 70).length
    const averageScore = totalAttempts > 0 
      ? Math.round(completedAttempts.reduce((sum: number, a: any) => sum + a.score.percentage, 0) / totalAttempts)
      : 0

    // Calculate streak
    const today = new Date()
    const lastQuizDate = user.progress?.lastQuizDate ? new Date(user.progress.lastQuizDate) : null
    const isConsecutiveDay = lastQuizDate && 
      Math.abs(today.getTime() - lastQuizDate.getTime()) <= 24 * 60 * 60 * 1000

    const currentStreak = isConsecutiveDay ? (user.progress?.currentStreak || 0) + 1 : 1
    const longestStreak = Math.max(currentStreak, user.progress?.longestStreak || 0)

    // Update subject progress
    const subjectProgress = user.progress?.subjectProgress || {}
    const subjectKey = quiz.subject || 'General'
    const subjectStats = subjectProgress[subjectKey] || {
      quizzesTaken: 0,
      averageScore: 0,
      bestScore: 0
    }

    subjectStats.quizzesTaken += 1
    subjectStats.averageScore = Math.round(
      (subjectStats.averageScore * (subjectStats.quizzesTaken - 1) + attempt.score.percentage) / subjectStats.quizzesTaken
    )
    subjectStats.bestScore = Math.max(subjectStats.bestScore, attempt.score.percentage)

    subjectProgress[subjectKey] = subjectStats

    // Update user document
    await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          progress: {
            quizzesTaken: totalAttempts,
            quizzesPassed: passedAttempts,
            averageScore: averageScore,
            totalPoints: Math.round(averageScore / 10) * totalAttempts, // 10 points per 10% average
            quizzesCompleted: completedAttempts.map((a: any) => a.quizId),
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            lastQuizDate: new Date(),
            subjectProgress: subjectProgress
          },
          updatedAt: new Date()
        },
        $inc: {
          "gamification.totalXP": Math.round(attempt.score.percentage / 10), // XP based on score
        }
      }
    )

    console.log(`Updated progress for user ${userId}: ${attempt.score.percentage}%`)
  } catch (error) {
    console.error("Error updating user progress:", error)
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
      userId: userId,
      quizId: quizId,
      type: "quiz"
    })

    if (existingCert) return // Certificate already exists

    // Create new certificate
    const certificate = {
      _id: new ObjectId(),
      userId: userId,
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
