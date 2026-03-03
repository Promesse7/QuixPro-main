import { NextRequest, NextResponse } from "next/server"
import { withMockFallback } from "@/lib/mock-data-switch"

export const dynamic = "force-dynamic"

// GET /api/user - Get current user data with mock fallback
export async function GET(request: NextRequest) {
  return withMockFallback(
    // MongoDB operation
    async () => {
      // This would normally fetch from MongoDB
      // For now, we'll let the mock handle it
      throw new Error("MongoDB user API not implemented")
    },
    // Mock operation
    async () => {
      console.log("📊 Using mock user data (MongoDB not available)")
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Return mock user data
      const mockUser = {
        id: "user_123",
        name: "John Student",
        email: "john.student@quixpro.com",
        level: "S3",
        avatar: "/avatars/john.jpg",
        points: 2450,
        streak: 7,
        joinedAt: "2024-01-15",
        lastActive: new Date().toISOString(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: "en"
        },
        achievements: [
          { id: "badge_1", title: "Quick Learner", earned: true, earnedAt: "2024-02-01" },
          { id: "badge_2", title: "Quiz Master", earned: true, earnedAt: "2024-02-15" },
          { id: "badge_3", title: "Consistent Student", earned: true, earnedAt: "2024-02-20" }
        ],
        stats: {
          totalQuizzes: 12,
          completedQuizzes: 8,
          averageScore: 85,
          totalStudyTime: 480, // minutes
          certificates: 3
        }
      }
      
      return NextResponse.json({ 
        success: true,
        user: mockUser 
      })
    },
    "get user data"
  )
}

// PUT /api/user - Update user data
export async function PUT(request: NextRequest) {
  return withMockFallback(
    // MongoDB operation
    async () => {
      throw new Error("MongoDB user update API not implemented")
    },
    // Mock operation
    async () => {
      console.log("📊 Using mock user update (MongoDB not available)")
      
      const body = await request.json()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Return updated user data
      const updatedUser = {
        id: "user_123",
        name: body.name || "John Student",
        email: body.email || "john.student@quixpro.com",
        level: body.level || "S3",
        avatar: body.avatar || "/avatars/john.jpg",
        points: body.points || 2450,
        streak: body.streak || 7,
        joinedAt: "2024-01-15",
        lastActive: new Date().toISOString(),
        preferences: {
          ...body.preferences,
          notifications: body.preferences?.notifications ?? true,
          darkMode: body.preferences?.darkMode ?? false,
          language: body.preferences?.language ?? "en"
        }
      }
      
      return NextResponse.json({ 
        success: true,
        user: updatedUser,
        message: "User data updated successfully"
      })
    },
    "update user data"
  )
}
