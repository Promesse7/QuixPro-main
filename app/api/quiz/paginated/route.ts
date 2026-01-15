import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

export const dynamic = "force-dynamic"

function isValidObjectId(id: string) {
  try {
    new ObjectId(id)
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(MAX_LIMIT, Number.parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString()))
    const skip = (page - 1) * limit

    const db = await getDatabase()
    const collection = db.collection("quizzes")

    // Build query from filters
    const query: any = {}
    const unit = searchParams.get("unit")
    const unitId = searchParams.get("unitId")
    const difficulty = searchParams.get("difficulty")
    const level = searchParams.get("level")
    const levelId = searchParams.get("levelId")
    const course = searchParams.get("course")
    const courseId = searchParams.get("courseId")
    const search = searchParams.get("search")

    if (unitId && isValidObjectId(unitId)) {
      query.unitId = new ObjectId(unitId)
    } else if (unit) {
      const unitsCol = db.collection("units")
      const unitDoc = await unitsCol.findOne({ name: unit })
      if (unitDoc) query.unitId = unitDoc._id
    }

    if (courseId && isValidObjectId(courseId)) {
      query.courseId = new ObjectId(courseId)
    } else if (course) {
      const coursesCol = db.collection("courses")
      const courseDoc = await coursesCol.findOne({ name: course })
      if (courseDoc) query.courseId = courseDoc._id
    }

    if (levelId && isValidObjectId(levelId)) {
      query.levelId = new ObjectId(levelId)
    } else if (level) {
      const levelsCol = db.collection("levels")
      const levelDoc = await levelsCol.findOne({ name: level })
      if (levelDoc) query.levelId = levelDoc._id
    }

    if (difficulty) {
      query.difficulty = { $regex: `^${difficulty}$`, $options: "i" }
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Execute queries in parallel for better performance
    const [quizzes, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching paginated quizzes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
