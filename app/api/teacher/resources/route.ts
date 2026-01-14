import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/resources?teacherId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Mock resources data - in a real app, this would come from a resources collection
    const mockResources = [
      {
        id: '1',
        title: 'Biology S3 Study Guide',
        type: 'document',
        description: 'Comprehensive study guide for S3 Biology covering all units',
        subject: 'Biology',
        level: 'S3',
        downloadUrl: '/resources/biology-s3-guide.pdf',
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: '2',
        title: 'Cell Structure Video Tutorial',
        type: 'video',
        description: 'Detailed video explanation of cell structure and function',
        subject: 'Biology',
        level: 'S3',
        url: 'https://example.com/cell-structure-video',
        createdAt: new Date('2024-01-10').toISOString()
      },
      {
        id: '3',
        title: 'Genetics Practice Quiz',
        type: 'quiz',
        description: 'Practice quiz for S6 Genetics and Evolution unit',
        subject: 'Biology',
        level: 'S6',
        url: '/quiz/genetics-practice',
        createdAt: new Date('2024-01-08').toISOString()
      },
      {
        id: '4',
        title: 'Mathematics Formula Sheet',
        type: 'document',
        description: 'Essential formulas for S4 Mathematics',
        subject: 'Mathematics',
        level: 'S4',
        downloadUrl: '/resources/math-s4-formulas.pdf',
        createdAt: new Date('2024-01-12').toISOString()
      },
      {
        id: '5',
        title: 'Chemistry Lab Safety Video',
        type: 'video',
        description: 'Safety guidelines for chemistry laboratory sessions',
        subject: 'Chemistry',
        level: 'S5',
        url: 'https://example.com/chem-lab-safety',
        createdAt: new Date('2024-01-05').toISOString()
      }
    ]

    return NextResponse.json({ resources: mockResources })

  } catch (error) {
    console.error("Error fetching teacher resources:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/teacher/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const resourceData = await request.json()
    const { title, type, description, subject, level, downloadUrl, url } = resourceData

    if (!title || !type || !description || !subject || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const resourcesCol = db.collection("resources")

    const newResource = {
      title,
      type,
      description,
      subject,
      level,
      downloadUrl,
      url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await resourcesCol.insertOne(newResource)

    return NextResponse.json({ 
      resource: { 
        id: result.insertedId.toString(), 
        ...newResource 
      } 
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
