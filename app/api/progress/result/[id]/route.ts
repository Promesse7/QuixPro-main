import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const result = await db.collection("results").findOne({ _id: new ObjectId(params.id) })

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // Fetch quiz details to include in response
    let quiz = null
    if (result.quizId) {
      quiz = await db.collection("quizzes").findOne({ _id: result.quizId })
    }

    const enhancedResult = {
      _id: result._id.toString(),
      ...result,
      quiz: quiz ? {
        title: quiz.title,
        subject: quiz.subject,
        level: quiz.level,
        duration: quiz.duration,
      } : null,
    }

    return NextResponse.json({ result: enhancedResult })
  } catch (e) {
    console.error("Result fetch error:", e)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
