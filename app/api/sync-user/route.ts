import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { User } from "@/models";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

// POST /api/sync-user - Sync current user to MongoDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role = "student", school, level } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: "User already exists", 
        user: existingUser 
      });
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      role,
      school,
      level,
      progress: {
        quizzesTaken: 0,
        quizzesPassed: 0,
        averageScore: 0,
        totalPoints: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(newUser);
    
    console.log(`[SYNC] Created new user: ${name} (${email})`);
    
    return NextResponse.json({ 
      message: "User synced successfully", 
      user: newUser 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Failed to sync user:", error);
    return NextResponse.json({ 
      error: "Failed to sync user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
