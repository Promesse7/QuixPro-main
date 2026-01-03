import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'

// GET /api/quiz-attempts/[attemptId] - Get a specific quiz attempt
export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params

    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const attemptsCol = db.collection("quiz_attempts")

    // Get the attempt
    const attempt = await attemptsCol.findOne({ _id: new ObjectId(attemptId) })
    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 })
    }

    // Convert ObjectId to string for JSON serialization
    const serializedAttempt = {
      ...attempt,
      _id: attempt._id.toString(),
      userId: attempt.userId.toString(),
      quizId: attempt.quizId.toString(),
      certificateId: attempt.certificateId ? attempt.certificateId.toString() : undefined
    }

    return NextResponse.json({ attempt: serializedAttempt })
  } catch (error) {
    console.error("Get quiz attempt error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
