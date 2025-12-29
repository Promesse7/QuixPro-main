import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/quiz/play?unitId=...&courseId=...&levelId=...&difficulty=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get("unitId")
    const courseId = searchParams.get("courseId")
    const levelId = searchParams.get("levelId")
    const difficulty = searchParams.get("difficulty")

    if (!unitId || !courseId || !levelId || !difficulty) {
      return NextResponse.json({ 
        error: "Missing required parameters: unitId, courseId, levelId, difficulty" 
      }, { status: 400 })
    }

    const db = await getDatabase()
    const quizzesCol = db.collection("quizzes")

    // Find quiz matching the criteria
    const quiz = await quizzesCol.findOne({
      unitId: unitId,
      courseId: new ObjectId(courseId),
      levelId: new ObjectId(levelId),
      difficulty: difficulty.toLowerCase()
    })

    if (!quiz) {
      return NextResponse.json({ 
        error: "No quiz found matching the specified criteria" 
      }, { status: 404 })
    }

    // Return quiz data without sensitive information
    const quizData = {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      levelId: quiz.levelId.toString(),
      courseId: quiz.courseId.toString(),
      unitId: quiz.unitId,
      questions: quiz.questions || [],
      isPublic: quiz.isPublic,
      status: quiz.status
    }

    return NextResponse.json({ quiz: quizData })

  } catch (error) {
    console.error("Error fetching quiz for play:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
