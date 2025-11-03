import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

function toObjectId(id: string | null | undefined) {
  try {
    return id && ObjectId.isValid(id) ? new ObjectId(id) : null
  } catch {
    return null
  }
}

// POST /api/progress/results
// Body: { userId?, quizId, score, accuracy?, timeSpent?, difficulty?, answers?, totalQuestions? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, quizId, score, accuracy, timeSpent, difficulty, answers, totalQuestions } = body || {}

    const quizObjId = toObjectId(quizId)
    const userObjId = userId ? toObjectId(userId) : null

    if (!quizObjId || typeof score !== "number") {
      return NextResponse.json({ error: "quizId and score are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const resultsCol = db.collection("results")
    const usersCol = db.collection("users")
    const leaderboardCol = db.collection("leaderboard")
    const quizzesCol = db.collection("quizzes")

    // Fetch quiz to get question count if not provided
    const quiz = await quizzesCol.findOne({ _id: quizObjId })
    const questionCount = totalQuestions || quiz?.questions?.length || 0

    // Calculate accuracy if not provided
    let finalAccuracy = accuracy
    if (!finalAccuracy && answers && questionCount > 0) {
      const correctCount = Object.values(answers as Record<string, any>).filter((ans) => ans === true).length
      finalAccuracy = Math.round((correctCount / questionCount) * 100)
    }

    // Calculate correct and wrong answers if we have the answers data
    let correctAnswers = 0
    let wrongAnswers = 0
    if (answers && typeof answers === "object") {
      Object.values(answers).forEach((ans) => {
        if (ans === true) correctAnswers++
        else wrongAnswers++
      })
    }

    const doc = {
      userId: userObjId,
      quizId: quizObjId,
      score,
      accuracy: finalAccuracy || 0,
      timeSpent: typeof timeSpent === "number" ? timeSpent : 0,
      difficulty: difficulty || "Moderate",
      totalQuestions: questionCount,
      correctAnswers,
      wrongAnswers,
      skipped: Math.max(0, questionCount - correctAnswers - wrongAnswers),
      answers: answers || {},
      createdAt: new Date(),
    }

    const insert = await resultsCol.insertOne(doc)

    // Only update user stats if userId is provided (authenticated user)
    if (userObjId) {
      const diffMul = difficulty === "Expert" ? 1.5 : difficulty === "Hard" ? 1.25 : difficulty === "Moderate" ? 1.1 : 1
      const xpEarned = Math.round(score * diffMul)

      await usersCol.updateOne(
        { _id: userObjId },
        {
          $inc: {
            "gamification.totalXP": xpEarned,
            "stats.totalQuizzes": 1,
            "stats.completedQuizzes": score >= 70 ? 1 : 0,
          },
          $set: { "gamification.lastActivityDate": new Date() },
        },
        { upsert: false }
      )

      // Update leaderboard aggregate per user
      await leaderboardCol.updateOne(
        { userId: userObjId },
        {
          $inc: { attempts: 1, totalScore: score, totalXP: xpEarned },
          $set: { lastUpdatedAt: new Date() },
        },
        { upsert: true }
      )

      return NextResponse.json({ resultId: insert.insertedId.toString(), xpEarned })
    }

    return NextResponse.json({ resultId: insert.insertedId.toString() })
  } catch (e: any) {
    console.error("results POST error", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
