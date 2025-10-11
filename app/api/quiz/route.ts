import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic"

// GET /api/quiz?unit=Unit1&difficulty=easy - Get quizzes for a unit with optional difficulty filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unit = searchParams.get("unit");
    const difficulty = searchParams.get("difficulty");
    const level = searchParams.get("level");
    const course = searchParams.get("course");
    
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    const unitsCol = db.collection("units");
    const coursesCol = db.collection("courses");
    const levelsCol = db.collection("levels");
    
    let query: any = {};
    
    if (unit) {
      const unitDoc = await unitsCol.findOne({ name: unit });
      if (unitDoc) {
        query.unitId = unitDoc._id;
      }
    }
    
    if (course) {
      const courseDoc = await coursesCol.findOne({ name: course });
      if (courseDoc) {
        query.courseId = courseDoc._id;
      }
    }
    
    if (level) {
      const levelDoc = await levelsCol.findOne({ name: level });
      if (levelDoc) {
        query.levelId = levelDoc._id;
      }
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    const quizzes = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

// POST /api/quiz - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, level, description, questions, duration, difficulty, createdBy } = body;
    
    if (!title || !subject || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    
    const newQuiz: Quiz = {
      id: uuidv4(),
      title,
      subject,
      level,
      description,
      questions: questions || 0,
      duration: duration || 0,
      difficulty: difficulty || "Medium",
      rating: 0,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
      questionIds: []
    };
    
    await collection.insertOne(newQuiz);
    
    return NextResponse.json({ quiz: newQuiz }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}