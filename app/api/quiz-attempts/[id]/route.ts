import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/quiz-attempts/[id] - Get specific attempt details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase()
    const attemptsCol = db.collection("quiz_attempts")
    
    const attempt = await attemptsCol.findOne({ _id: new ObjectId(params.id) })
    
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }
    
    return NextResponse.json({ attempt })
  } catch (error) {
    console.error("Get attempt error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
