import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * Utility function to safely parse MongoDB ObjectIds.
 */
function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

/**
 * ✅ GET /api/quiz/[id]
 * Fetch a single quiz by its ID (either ObjectId or string).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const db = await getDatabase();
    const collection = db.collection("quizzes");

    const { searchParams } = new URL(request.url)
    const fields = searchParams.get('fields') // 'meta' | 'all'

    let quiz = null;
    const objectId = toObjectId(id);

    if (objectId) {
      quiz = await collection.findOne({ _id: objectId });
    }
    if (!quiz) {
      quiz = await collection.findOne({ id }); // fallback to string id
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (fields === 'meta') {
      const { questions, ...meta } = quiz as any
      return NextResponse.json({ quiz: meta }, { status: 200 });
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * ✅ PUT /api/quiz/[id]
 * Update a quiz by ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("quizzes");

    // Find by _id or id
    const objectId = toObjectId(id);
    const filter = objectId ? { $or: [{ _id: objectId }, { id }] } : { id };

    const existingQuiz = await collection.findOne(filter);
    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const updatedQuiz = {
      ...existingQuiz,
      ...body,
      updatedAt: new Date(),
    };

    await collection.updateOne(filter, { $set: updatedQuiz });

    return NextResponse.json({ quiz: updatedQuiz }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * ✅ DELETE /api/quiz/[id]
 * Remove a quiz by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const db = await getDatabase();
    const collection = db.collection("quizzes");

    const objectId = toObjectId(id);
    const filter = objectId ? { $or: [{ _id: objectId }, { id }] } : { id };

    const quiz = await collection.findOne(filter);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    await collection.deleteOne(filter);

    return NextResponse.json(
      { message: "Quiz deleted successfully", deletedId: id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz", details: error.message },
      { status: 500 }
    );
  }
}
