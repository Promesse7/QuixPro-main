import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { User } from "@/models";

export const dynamic = "force-dynamic";

// GET /api/debug/users - Debug endpoint to see all users in database
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    
    // Get all users (limit to 20 for debugging)
    const users = await usersCollection.find({}).limit(20).toArray();
    
    // Return user IDs and basic info for debugging
    const debugInfo = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id?.toString()
    }));
    
    return NextResponse.json({ 
      message: "Debug: Users in database",
      count: users.length,
      users: debugInfo 
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch debug info",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
