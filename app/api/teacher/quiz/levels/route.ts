import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/quiz/levels
export async function GET() {
  try {
    const db = await getDatabase()
    const levels = await db.collection("levels")
      .find({})
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ levels })
  } catch (error) {
    console.error("Error fetching levels:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
