import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { Quiz } from "@/models";

// GET /api/quiz - Get all quizzes or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const level = searchParams.get("level");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    
    const query: any = { isPublic: true };
    if (subject) query.subject = subject;
    if (level) query.level = level;
    
    const quizzes = await collection
      .find(query)
      .limit(limit)
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