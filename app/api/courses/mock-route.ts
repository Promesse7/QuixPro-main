import { NextRequest, NextResponse } from "next/server"

// Mock data when MongoDB is not available
const mockCourses = [
  { _id: "course_1", name: "Physics", displayName: "Physics", subject: "Physics", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_2", name: "Chemistry", displayName: "Chemistry", subject: "Chemistry", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_3", name: "Biology", displayName: "Biology", subject: "Biology", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_4", name: "Mathematics", displayName: "Mathematics", subject: "Mathematics", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_5", name: "English", displayName: "English", subject: "English", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_6", name: "History", displayName: "History", subject: "History", levelId: "level_1", gradeLevel: "S1" },
  { _id: "course_7", name: "Geography", displayName: "Geography", subject: "Geography", levelId: "level_2", gradeLevel: "S2" },
  { _id: "course_8", name: "Economics", displayName: "Economics", subject: "Economics", levelId: "level_2", gradeLevel: "S2" }
]

export const dynamic = "force-dynamic"

// GET /api/courses - Mock courses when MongoDB is not available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get('levelId')
    
    console.log("📊 Using mock courses data (MongoDB not available)")
    console.log(`🔍 Filter by levelId: ${levelId}`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150))
    
    let filteredCourses = mockCourses
    
    if (levelId) {
      filteredCourses = mockCourses.filter(course => course.levelId === levelId)
    }
    
    return NextResponse.json({ 
      success: true,
      courses: filteredCourses 
    })
  } catch (error) {
    console.error("Mock courses error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch mock courses" 
    }, { status: 500 })
  }
}
