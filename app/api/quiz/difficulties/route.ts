import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"

export async function GET(request: NextRequest) {
  const client = new MongoClient(uri)
  
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get('unit')
    const courseId = searchParams.get('course')
    const levelId = searchParams.get('level')

    console.log('Fetching difficulties for:', { unitId, courseId, levelId })

    if (!unitId || !courseId || !levelId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db('QuixDB')
    
    // Get unit details
    const unit = await db.collection('units').findOne({
      _id: new ObjectId(unitId)
    })

    console.log('Found unit:', unit)

    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      )
    }

    // Get course details
    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId)
    })

    // Get level details
    const level = await db.collection('levels').findOne({
      _id: new ObjectId(levelId)
    })

    // Find all QUESTIONS for this specific unit
    // Each question is a separate document in the quizzes collection
    const questions = await db.collection('quizzes')
      .find({ 
        unitId: new ObjectId(unitId)
      })
      .toArray()

    console.log('Found questions:', questions.length)

    if (questions.length === 0) {
      return NextResponse.json({
        difficulties: [],
        counts: {},
        unitName: unit.name || '',
        courseName: course?.name || '',
        levelName: level?.name || '',
        totalQuestions: 0
      })
    }

    // Count questions by difficulty and collect quiz IDs
    const difficultyCounts: Record<string, number> = {}
    const availableDifficulties = new Set<string>()
    const quizIds: Record<string, string> = {}

    questions.forEach(question => {
      const difficulty = question.difficulty?.toLowerCase() || 'medium'
      
      // Map database difficulty values to frontend values
      let mappedDifficulty = difficulty
      if (difficulty === 'moderate') mappedDifficulty = 'medium'
      if (difficulty === 'expert') mappedDifficulty = 'application'
      
      difficultyCounts[mappedDifficulty] = (difficultyCounts[mappedDifficulty] || 0) + 1
      availableDifficulties.add(mappedDifficulty)
      
      // Store the quiz ID for this difficulty
      if (!quizIds[mappedDifficulty]) {
        quizIds[mappedDifficulty] = question._id.toString()
      }
    })

    console.log('Difficulty counts:', difficultyCounts)
    console.log('Available difficulties:', Array.from(availableDifficulties))

    return NextResponse.json({
      difficulties: Array.from(availableDifficulties),
      counts: difficultyCounts,
      quizIds: quizIds,
      unitName: unit.name || '',
      courseName: course?.name || '',
      levelName: level?.name || '',
      totalQuestions: questions.length
    })

  } catch (error) {
    console.error('Error fetching difficulties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch difficulties', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}