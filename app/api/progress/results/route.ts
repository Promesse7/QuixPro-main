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
// Body: { userId, quizId, score, accuracy?, timeSpent?, difficulty? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, quizId, score, accuracy, timeSpent, difficulty } = body || {}

    const userObjId = toObjectId(userId)
    const quizObjId = toObjectId(quizId)

    if (!userObjId || !quizObjId || typeof score !== "number") {
      return NextResponse.json({ error: "userId, quizId, score are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const resultsCol = db.collection("results")
    const usersCol = db.collection("users")
    const leaderboardCol = db.collection("leaderboard")

    const doc = {
      userId: userObjId,
      quizId: quizObjId,
      score,
      accuracy: typeof accuracy === "number" ? accuracy : undefined,
      timeSpent: typeof timeSpent === "number" ? timeSpent : undefined,
      difficulty: difficulty || undefined,
      createdAt: new Date(),
    }

    const insert = await resultsCol.insertOne(doc)

    // Basic XP model: score% maps to XP; difficulty multiplier
    const diffMul = difficulty === "Expert" ? 1.5 : difficulty === "Hard" ? 1.25 : difficulty === "Moderate" ? 1.1 : 1
    const xpEarned = Math.round(score * diffMul)

    await usersCol.updateOne(
      { _id: userObjId },
      {
        $inc: {
          "gamification.totalXP": xpEarned,
          "analytics.totalQuizzesTaken": 1,
          "analytics.totalQuizzesPassed": score >= 70 ? 1 : 0,
          "analytics.totalTimeSpent": timeSpent || 0,
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

    return NextResponse.json({ resultId: insert.insertedId, xpEarned })
  } catch (e: any) {
    console.error("results POST error", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


