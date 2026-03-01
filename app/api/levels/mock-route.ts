import { NextRequest, NextResponse } from "next/server"

// Mock data when MongoDB is not available
const mockLevels = [
  { _id: "level_1", name: "S1", stage: "Senior 1", code: "S1", description: "Senior Secondary Level 1" },
  { _id: "level_2", name: "S2", stage: "Senior 2", code: "S2", description: "Senior Secondary Level 2" },
  { _id: "level_3", name: "S3", stage: "Senior 3", code: "S3", description: "Senior Secondary Level 3" },
  { _id: "level_4", name: "S4", stage: "Senior 4", code: "S4", description: "Senior Secondary Level 4" },
  { _id: "level_5", name: "S5", stage: "Senior 5", code: "S5", description: "Senior Secondary Level 5" },
  { _id: "level_6", name: "S6", stage: "Senior 6", code: "S6", description: "Senior Secondary Level 6" }
]

export const dynamic = "force-dynamic"

// GET /api/levels - Mock levels when MongoDB is not available
export async function GET(_request: NextRequest) {
  try {
    console.log("📊 Using mock levels data (MongoDB not available)")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({ 
      success: true,
      levels: mockLevels 
    })
  } catch (error) {
    console.error("Mock levels error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch mock levels" 
    }, { status: 500 })
  }
}
