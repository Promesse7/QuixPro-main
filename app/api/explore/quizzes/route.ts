import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET /api/explore/quizzes - Get quizzes for exploration/discovery
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10
    const featured = searchParams.get("featured") === "true"
    
    const db = await getDatabase()
    const quizzesCol = db.collection("quizzes")
    
    let query: any = {}
    if (featured) {
      // You could add a featured field to your quiz schema
      query.featured = true
    }
    
    const quizzes = await quizzesCol
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true,
      quizzes: quizzes.map(quiz => ({
        _id: quiz._id?.toString(),
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        level: quiz.level,
        description: quiz.description,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        questions: Array.isArray(quiz.questions) ? quiz.questions : [],
        rating: quiz.rating || 0
      }))
    })
  } catch (error) {
    console.error("Explore quizzes error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch quizzes" 
    }, { status: 500 })
  }
}
