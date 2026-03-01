import { NextRequest, NextResponse } from "next/server"

// Mock data when MongoDB is not available
const mockUnits = [
  { _id: "unit_1", name: "Mechanics", courseId: "course_1", levelId: "level_1", description: "Introduction to Mechanics - Forces and Motion" },
  { _id: "unit_2", name: "Thermodynamics", courseId: "course_1", levelId: "level_1", description: "Heat transfer and energy" },
  { _id: "unit_3", name: "Waves", courseId: "course_1", levelId: "level_1", description: "Wave properties and sound" },
  { _id: "unit_4", name: "Atomic Structure", courseId: "course_2", levelId: "level_1", description: "Atoms, molecules and chemical bonds" },
  { _id: "unit_5", name: "Chemical Reactions", courseId: "course_2", levelId: "level_1", description: "Types of chemical reactions" },
  { _id: "unit_6", name: "Cell Biology", courseId: "course_3", levelId: "level_1", description: "Cell structure and function" },
  { _id: "unit_7", name: "Genetics", courseId: "course_3", levelId: "level_1", description: "Heredity and variation" },
  { _id: "unit_8", name: "Algebra", courseId: "course_4", levelId: "level_1", description: "Algebraic expressions and equations" },
  { _id: "unit_9", name: "Geometry", courseId: "course_4", levelId: "level_1", description: "Shapes and spatial reasoning" },
  { _id: "unit_10", name: "Literature Analysis", courseId: "course_5", levelId: "level_1", description: "Literary devices and analysis" },
  { _id: "unit_11", name: "Grammar", courseId: "course_5", levelId: "level_1", description: "English grammar and composition" },
  { _id: "unit_12", name: "World History", courseId: "course_6", levelId: "level_1", description: "Major historical events and periods" }
]

export const dynamic = "force-dynamic"

// GET /api/units - Mock units when MongoDB is not available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const course = searchParams.get('course')
    const level = searchParams.get('level')
    
    console.log("📊 Using mock units data (MongoDB not available)")
    console.log(`🔍 Filters - courseId: ${courseId}, course: ${course}, level: ${level}`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    let filteredUnits = mockUnits
    
    if (courseId) {
      filteredUnits = mockUnits.filter(unit => unit.courseId === courseId)
    } else if (course) {
      // Find course by name first
      const mockCourses = [
        { _id: "course_1", name: "Physics" },
        { _id: "course_2", name: "Chemistry" },
        { _id: "course_3", name: "Biology" },
        { _id: "course_4", name: "Mathematics" },
        { _id: "course_5", name: "English" },
        { _id: "course_6", name: "History" }
      ]
      const courseDoc = mockCourses.find(c => c.name === course)
      if (courseDoc) {
        filteredUnits = mockUnits.filter(unit => unit.courseId === courseDoc._id)
      }
    }
    
    if (level) {
      const levelId = `level_${level.slice(1)}` // Convert "S1" to "level_1"
      filteredUnits = filteredUnits.filter(unit => unit.levelId === levelId)
    }
    
    return NextResponse.json({ 
      success: true,
      units: filteredUnits,
      courseName: course || ""
    })
  } catch (error) {
    console.error("Mock units error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch mock units" 
    }, { status: 500 })
  }
}
