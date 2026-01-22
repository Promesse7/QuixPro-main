import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const email = searchParams.get('email') // Add email parameter support
    const school = searchParams.get('school')
    const level = searchParams.get('level')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    console.log('User search API called with:', { search, email, school, level, limit, skip })

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Build search query
    const query: any = {}

    // Search by exact email if provided
    if (email) {
      query.email = email
    } 
    // Search by name or email
    else if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Filter by school
    if (school && school !== 'all') {
      query.schoolId = school
    }

    // Filter by level
    if (level && level !== 'all') {
      query.levelId = level
    }

    console.log('MongoDB query:', query)

    // Get users with pagination
    const users = await usersCollection
      .find(query, { 
        projection: { 
          password: 0, // Exclude password only
        }
      })
      .sort({ lastActive: -1, createdAt: -1 }) // Most active first
      .skip(skip)
      .limit(limit)
      .toArray()

    console.log('Found users:', users.length)

    // Get total count for pagination
    const total = await usersCollection.countDocuments(query)

    // Populate school and level names
    const schoolsCollection = db.collection('schools')
    const levelsCollection = db.collection('levels')
    
    const schools = await schoolsCollection.find({}).toArray()
    const levels = await levelsCollection.find({}).toArray()

    const usersWithDetails = users.map(user => ({
      ...user,
      school: schools.find(s => s._id.toString() === user.schoolId)?.name || 'Unknown School',
      level: levels.find(l => l._id.toString() === user.levelId)?.name || 'Unknown Level'
    }))

    const result = {
      users: usersWithDetails,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    }

    console.log('API response:', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', users: [], pagination: { total: 0, limit: 20, skip: 0, hasMore: false } },
      { status: 500 }
    )
  }
}
