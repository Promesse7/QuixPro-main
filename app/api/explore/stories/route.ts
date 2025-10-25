import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET /api/explore/stories - Public access to sample stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "3");

    const db = await getDatabase();
    const storiesCol = db.collection("stories");

    const stories = await storiesCol
      .find({ isPublic: true })
      .limit(limit)
      .sort({ views: -1 })
      .toArray();

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Explore stories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}