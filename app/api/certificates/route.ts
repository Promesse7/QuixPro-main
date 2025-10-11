import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/certificates?userId=... [optional]
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const db = await getDatabase()
    const certificatesCol = db.collection("certificates")

    const query: any = {}
    if (userId) {
      query.userId = new ObjectId(userId).toString() // store as string for consistency
    }

    const certificates = await certificatesCol
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("Certificates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/certificates - Create a new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, quizId, title, course, level, score, type = "quiz" } = body

    if (!userId || !title || !course || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const certificatesCol = db.collection("certificates")

    const certificate = {
      _id: new ObjectId(),
      userId: userId.toString(),
      quizId: quizId || null,
      title,
      course,
      level: level || "General",
      score,
      type,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await certificatesCol.insertOne(certificate)

    return NextResponse.json({ certificate }, { status: 201 })
  } catch (error) {
    console.error("Create certificate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

