import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

function isValidObjectId(id: string) {
  try {
    new ObjectId(id)
    return true
  } catch {
    return false
  }
}

// Enhanced GET /api/quiz/enhanced - Better quiz filtering with relationships
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unit = searchParams.get("unit")
    const unitId = searchParams.get("unitId")
    const difficulty = searchParams.get("difficulty")
    const level = searchParams.get("level")
    const levelId = searchParams.get("levelId")
    const course = searchParams.get("course")
    const courseId = searchParams.get("courseId")
    const limit = searchParams.get("limit")

    const db = await getDatabase()
    const collection = db.collection("quizzes")
    const unitsCol = db.collection("units")
    const coursesCol = db.collection("courses")
    const levelsCol = db.collection("levels")

    let query: any = {}

    // Enhanced filtering with better relationship handling
    if (unitId && isValidObjectId(unitId)) {
      query.unitId = new ObjectId(unitId)
    } else if (unit) {
      const unitDoc = await unitsCol.findOne({ name: unit })
      if (unitDoc) {
        query.unitId = unitDoc._id
      }
    }

    if (courseId && isValidObjectId(courseId)) {
      query.courseId = new ObjectId(courseId)
    } else if (course) {
      const courseDoc = await coursesCol.findOne({ name: course })
      if (courseDoc) {
        query.courseId = courseDoc._id
      }
    }

    if (levelId && isValidObjectId(levelId)) {
      query.levelId = new ObjectId(levelId)
    } else if (level) {
      const levelDoc = await levelsCol.findOne({ name: level })
      if (levelDoc) {
        query.levelId = levelDoc._id
      }
    }

    if (difficulty && difficulty !== "any") {
      query.difficulty = { $regex: `^${difficulty}$`, $options: 'i' }
    }

    // Build aggregation pipeline to get related data
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "levels",
          localField: "levelId",
          foreignField: "_id",
          as: "levelInfo"
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseInfo"
        }
      },
      {
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unitInfo"
        }
      },
      {
        $addFields: {
          levelName: { $arrayElemAt: ["$levelInfo.name", 0] },
          courseName: { $arrayElemAt: ["$courseInfo.name", 0] },
          unitName: { $arrayElemAt: ["$unitInfo.name", 0] }
        }
      },
      {
        $project: {
          levelInfo: 0,
          courseInfo: 0,
          unitInfo: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]

    if (limit && !isNaN(parseInt(limit))) {
      pipeline.push({ $limit: parseInt(limit) } as any)
    }

    const quizzes = await collection.aggregate(pipeline).toArray()

    // Enrich quiz data with fallback values
    const enrichedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      level: quiz.levelName || quiz.level || 'Unknown',
      subject: quiz.courseName || quiz.subject || 'Unknown',
      unit: quiz.unitName || 'Unknown'
    }))

    return NextResponse.json({
      success: true,
      quizzes: enrichedQuizzes,
      count: enrichedQuizzes.length,
      filters: {
        level: level || levelId,
        course: course || courseId,
        unit: unit || unitId,
        difficulty
      }
    })
  } catch (error) {
    console.error("Error fetching enhanced quizzes:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch quizzes"
    }, { status: 500 })
  }
}

// POST /api/quiz/enhanced - Create quiz with proper relationships
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      subject,
      level,
      description,
      questions,
      duration,
      difficulty,
      createdBy,
      unitName,
      courseName,
      levelName
    } = body

    if (!title || !subject || !description) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection("quizzes")

    // Find related documents
    let levelId = null
    let courseId = null
    let unitId = null

    // Find level
    if (levelName) {
      const levelDoc = await db.collection("levels").findOne({ name: levelName })
      if (levelDoc) levelId = levelDoc._id
    } else if (level) {
      const levelDoc = await db.collection("levels").findOne({ name: level })
      if (levelDoc) levelId = levelDoc._id
    }

    // Find course
    if (courseName) {
      const courseDoc = await db.collection("courses").findOne({ name: courseName })
      if (courseDoc) courseId = courseDoc._id
    } else if (subject) {
      const courseDoc = await db.collection("courses").findOne({ name: subject })
      if (courseDoc) courseId = courseDoc._id
    }

    // Find unit
    if (unitName && courseId) {
      const unitDoc = await db.collection("units").findOne({
        name: unitName,
        courseId: courseId
      })
      if (unitDoc) unitId = unitDoc._id
    }

    const newQuiz = {
      title,
      subject,
      level,
      description,
      questions: questions || [],
      duration: duration || 0,
      difficulty: difficulty || "Medium",
      createdBy,
      levelId,
      courseId,
      unitId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newQuiz)

    return NextResponse.json({
      success: true,
      quiz: { ...newQuiz, _id: result.insertedId },
      message: "Quiz created successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating enhanced quiz:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to create quiz"
    }, { status: 500 })
  }
}
