import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET /api/explore/courses - Public access to sample courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    const db = await getDatabase();
    const coursesCol = db.collection("courses");

    const courses = await coursesCol
      .find({ isPublished: true })
      .limit(limit)
      .sort({ enrollmentCount: -1 })
      .toArray();

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Explore courses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}