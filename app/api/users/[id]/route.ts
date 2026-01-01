import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/models";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

interface SharedFile {
  _id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  uploadedAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  school?: string;
  level?: string;
  lastActive?: string;
  sharedFiles: SharedFile[];
  gamification?: {
    totalXP: number;
    currentLevel: number;
    streak: number;
    lastActivityDate?: Date;
    badges: Array<{
      badgeId: string;
      name: string;
      earnedAt: Date;
    }>;
  };
  preferences?: {
    dailyGoal: number;
    theme: "light" | "dark";
    language: "en" | "rw";
  };
}

// GET /api/users/{id} - Get user profile information
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    // Skip authentication for development - TODO: Add proper auth in production
    // const currentUser = getCurrentUser();
    // if (!currentUser || !currentUser.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id: userId } = params;
    
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    console.log(`[DEBUG] Looking for user with ID: ${userId}`);

    // Try multiple lookup strategies
    let user = null;
    
    // 1. Try MongoDB _id match (most likely)
    if (ObjectId.isValid(userId)) {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (user) {
        console.log(`[DEBUG] Found user by MongoDB _id: ${user.name}`);
      }
    }
    
    // 2. Try exact ID match (if id field exists)
    if (!user) {
      user = await usersCollection.findOne({ id: userId });
      if (user) {
        console.log(`[DEBUG] Found user by ID: ${user.name}`);
      }
    }
    
    // 3. Try email match (if userId looks like email)
    if (!user && userId.includes('@')) {
      user = await usersCollection.findOne({ email: userId });
      if (user) {
        console.log(`[DEBUG] Found user by email: ${user.name}`);
      }
    }
    
    // 4. Try partial email match (for Firebase-style IDs)
    if (!user && userId.includes('_')) {
      // Convert Firebase-style ID back to email
      // rukundopromesse_gmail_com -> rukundopromesse@gmail.com
      let email = userId.replace(/_/g, '.');
      
      // Handle common email providers - replace the first occurrence of domain with @domain
      if (email.includes('.gmail.com')) {
        email = email.replace('.gmail.com', '@gmail.com');
      } else if (email.includes('.yahoo.com')) {
        email = email.replace('.yahoo.com', '@yahoo.com');
      } else if (email.includes('.outlook.com')) {
        email = email.replace('.outlook.com', '@outlook.com');
      } else {
        // Generic case - find the last dot and replace it with @
        const lastDotIndex = email.lastIndexOf('.');
        if (lastDotIndex > 0) {
          email = email.substring(0, lastDotIndex) + '@' + email.substring(lastDotIndex + 1);
        }
      }
      
      console.log(`[DEBUG] Trying converted email: ${email}`);
      user = await usersCollection.findOne({ email: email });
      if (user) {
        console.log(`[DEBUG] Found user by converted email: ${user.name}`);
      }
    }
    
    if (!user) {
      console.log(`[DEBUG] User not found with ID: ${userId}`);
      
      // Return available users for debugging
      const allUsers = await usersCollection.find({}).limit(5).toArray();
      const availableUsers = allUsers.map(u => ({
        _id: u._id?.toString(),
        id: u.id,
        email: u.email,
        name: u.name
      }));
      
      return NextResponse.json({ 
        error: "User not found", 
        searchedId: userId,
        availableUsers: availableUsers
      }, { status: 404 });
    }

    // Get shared files (placeholder - would come from messages with file attachments)
    const sharedFiles: SharedFile[] = []; // TODO: Implement shared files from message history

    // Format last active time (placeholder - would come from Firebase online status)
    const lastActive = "2 hours ago"; // TODO: Get real last active from Firebase

    const userProfile: UserProfile = {
      _id: user._id?.toString() || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      level: user.level,
      lastActive,
      sharedFiles,
      gamification: user.gamification,
      preferences: user.preferences
    };

    console.log(`[DEBUG] Returning user profile for: ${user.name}`);
    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
