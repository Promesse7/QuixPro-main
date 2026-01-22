import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/models/User";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to view peers." }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Get the current user's ID to exclude from the results
    const currentUserId = new ObjectId(currentUser._id);

    // Find all users except the current user
    const peers = await usersCollection.find(
      { _id: { $ne: currentUserId } },
      {
        projection: {
          id: 1,
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          level: 1,
          school: 1,
          'gamification.totalXP': 1,
          'gamification.currentLevel': 1,
          'gamification.badges': 1,
          _id: 0 // Exclude MongoDB _id from the response
        }
      }
    ).sort({ 'gamification.totalXP': -1 }) // Sort by XP to show most active users first
    .toArray();

    return NextResponse.json({ peers });
  } catch (error) {
    console.error("Failed to fetch peers:", error);
    return NextResponse.json(
      { error: "Failed to fetch peers. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // This endpoint is not implemented as peers are automatically managed
  return NextResponse.json(
    { error: "Method not implemented. Use GET to fetch peers." },
    { status: 501 }
  );
}
