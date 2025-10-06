import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/models";

// GET /api/user - Get all users (admin only) or current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("isAdmin") === "true";
    
    const db = await getDatabase();
    const collection = db.collection("users");
    
    if (userId) {
      // Get specific user
      const user = await collection.findOne({ id: userId });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      return NextResponse.json({ user });
    } else if (isAdmin) {
      // Admin can get all users
      const users = await collection.find({}).toArray();
      return NextResponse.json({ users });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/user - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, image, role, level, school } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const db = await getDatabase();
    const collection = db.collection("users");
    
    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      image: image || "/placeholder-user.jpg",
      role: role || "student",
      level,
      school,
      progress: {
        quizzesTaken: 0,
        quizzesPassed: 0,
        averageScore: 0,
        totalPoints: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(newUser);
    
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT /api/user - Update current user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const db = await getDatabase();
    const collection = db.collection("users");
    
    const user = await collection.findOne({ id });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const updatedUser = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await collection.updateOne({ id }, { $set: updatedUser });
    
    return NextResponse.json({ user: { ...user, ...updatedUser } });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}