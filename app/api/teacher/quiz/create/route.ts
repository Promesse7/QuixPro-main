import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// POST /api/teacher/quiz/create
export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json()
    
    const {
      title,
      description,
      difficulty,
      duration,
      levelId,
      courseId,
      unitId,
      questions,
      createdBy,
      isPublic = true
    } = quizData

    // Validate required fields
    if (!title || !description || !difficulty || !levelId || !courseId || !unitId || !questions || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "At least one question is required" }, { status: 400 })
    }

    for (const question of questions) {
      if (!question.text || !question.options || !Array.isArray(question.options) || question.options.length !== 4) {
        return NextResponse.json({ error: "Each question must have text and exactly 4 options" }, { status: 400 })
      }
      
      const correctOptions = question.options.filter((opt: any) => opt.correct).length
      if (correctOptions !== 1) {
        return NextResponse.json({ error: "Each question must have exactly one correct answer" }, { status: 400 })
      }
    }

    const db = await getDatabase()
    const quizzesCol = db.collection("quizzes")

    // Create quiz document
    const quiz = {
      title,
      description,
      difficulty: difficulty.toLowerCase(), // easy, medium, hard, application
      duration: parseInt(duration),
      levelId: new ObjectId(levelId),
      courseId: new ObjectId(courseId),
      unitId: unitId, // Keep as string to match seed script
      questions: questions.map(q => ({
        ...q,
        marks: q.marks || 1,
        difficulty: q.difficulty || 'medium' // Individual question difficulty
      })),
      createdBy: new ObjectId(createdBy),
      isPublic,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      analytics: {
        totalAttempts: 0,
        averageScore: 0,
        averageTimeSpent: 0,
        commonMistakes: []
      }
    }

    const result = await quizzesCol.insertOne(quiz)
    
    return NextResponse.json({ 
      success: true, 
      quizId: result.insertedId.toString(),
      message: "Quiz created successfully"
    })

  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
