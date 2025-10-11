import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic"

// GET /api/quiz/[id] - Get a specific quiz by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    
    // Try to find by ObjectId first, then by string id
    let quiz;
    try {
      quiz = await collection.findOne({ _id: new ObjectId(id) });
    } catch {
      quiz = await collection.findOne({ id });
    }
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    
    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

// PUT /api/quiz/[id] - Update a quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    
    const quiz = await collection.findOne({ id });
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    
    const updatedQuiz = {
      ...body,
      updatedAt: new Date()
    };
    
    await collection.updateOne({ id }, { $set: updatedQuiz });
    
    return NextResponse.json({ quiz: { ...quiz, ...updatedQuiz } });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

// DELETE /api/quiz/[id] - Delete a quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const db = await getDatabase();
    const collection = db.collection("quizzes");
    
    const quiz = await collection.findOne({ id });
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    
    await collection.deleteOne({ id });
    
    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}