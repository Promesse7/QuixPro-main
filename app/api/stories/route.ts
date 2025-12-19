import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { Story } from "@/models";

// GET /api/stories - Get all stories or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const readingLevel = searchParams.get("readingLevel");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    
    const db = await getDatabase();
    const collection = db.collection("stories");
    
    const query: any = { isPublic: true };
    if (category) query.category = category;
    if (readingLevel) query.readingLevel = readingLevel;
    
    const stories = await collection
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

// POST /api/stories - Create a new story
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, imageUrl, category, readingLevel, readingTime, author, createdBy } = body;
    
    if (!title || !description || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const db = await getDatabase();
    const collection = db.collection("stories");
    
    const newStory: Story = {
      id: uuidv4(),
      title,
      description,
      content,
      imageUrl: imageUrl || "/placeholder.jpg",
      category: category || "General",
      readingLevel: readingLevel || "Intermediate",
      readingTime: readingTime || 5,
      author,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true
    };
    
    await collection.insertOne(newStory);
    
    return NextResponse.json({ story: newStory }, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
