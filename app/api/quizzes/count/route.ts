import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const count = await db.collection("quizzes").countDocuments();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting quizzes:", error);
    return NextResponse.json(
      { error: "Failed to count quizzes" },
      { status: 500 }
    );
  }
}
