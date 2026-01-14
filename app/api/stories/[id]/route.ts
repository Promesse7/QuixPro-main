import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET /api/stories/[id] - Get a specific story by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const db = await getDatabase();
    const collection = db.collection("stories");
    
    const story = await collection.findOne({ id });
    
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

// PUT /api/stories/[id] - Update a story
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const db = await getDatabase();
    const collection = db.collection("stories");
    
    const story = await collection.findOne({ id });
    
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    const updatedStory = {
      ...body,
      updatedAt: new Date()
    };
    
    await collection.updateOne({ id }, { $set: updatedStory });
    
    return NextResponse.json({ story: { ...story, ...updatedStory } });
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

// DELETE /api/stories/[id] - Delete a story
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const db = await getDatabase();
    const collection = db.collection("stories");
    
    const story = await collection.findOne({ id });
    
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    await collection.deleteOne({ id });
    
    return NextResponse.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
