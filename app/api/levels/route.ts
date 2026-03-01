import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { withMockFallback } from "@/lib/mock-data-switch"

export const dynamic = "force-dynamic"

// Define consistent types
interface Level {
  _id: string
  name: string
  stage: string
  code: string
  description: string
  courseCount?: number
}

interface LevelsResponse {
  levels: Level[]
}

// GET /api/levels - list education levels with course counts
export async function GET(_request: NextRequest): Promise<NextResponse<LevelsResponse>> {
  return withMockFallback(
    // MongoDB operation
    async (): Promise<NextResponse<LevelsResponse>> => {
      const db = await getDatabase()
      const levelsCol = db.collection("levels")
      const coursesCol = db.collection("courses")

      const levels = await levelsCol
        .find({})
        .sort({ name: 1 })
        .toArray()

      // Enhance levels with course count
      const enhancedLevels = await Promise.all(
        levels.map(async (level): Promise<Level> => {
          const courseCount = await coursesCol.countDocuments({
            levelId: level._id,
          })
          return {
            _id: level._id.toString(),
            name: level.name,
            stage: level.stage,
            code: level.code,
            description: level.description,
            courseCount,
          }
        })
      )

      return NextResponse.json({ levels: enhancedLevels })
    },
    // Mock operation
    async (): Promise<NextResponse<LevelsResponse>> => {
      console.log("📊 Using mock levels data")
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate delay

      const mockLevels: Level[] = [
        { _id: "level_1", name: "S1", stage: "Senior 1", code: "S1", description: "Senior Secondary Level 1" },
        { _id: "level_2", name: "S2", stage: "Senior 2", code: "S2", description: "Senior Secondary Level 2" },
        { _id: "level_3", name: "S3", stage: "Senior 3", code: "S3", description: "Senior Secondary Level 3" },
        { _id: "level_4", name: "S4", stage: "Senior 4", code: "S4", description: "Senior Secondary Level 4" },
        { _id: "level_5", name: "S5", stage: "Senior 5", code: "S5", description: "Senior Secondary Level 5" },
        { _id: "level_6", name: "S6", stage: "Senior 6", code: "S6", description: "Senior Secondary Level 6" }
      ]

      return NextResponse.json({ levels: mockLevels })
    },
    "fetch levels"
  )
}
