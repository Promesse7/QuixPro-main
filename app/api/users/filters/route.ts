import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Filters API called')
    const db = await getDatabase()
    
    // Get schools
    const schoolsCollection = db.collection('schools')
    const schools = await schoolsCollection
      .find({}, { projection: { _id: 1, name: 1 } })
      .sort({ name: 1 })
      .toArray()

    // Get levels
    const levelsCollection = db.collection('levels')
    const levels = await levelsCollection
      .find({}, { projection: { _id: 1, name: 1 } })
      .sort({ name: 1 })
      .toArray()

    const result = {
      schools: schools.map(school => ({
        value: school._id.toString(),
        label: school.name
      })),
      levels: levels.map(level => ({
        value: level._id.toString(),
        label: level.name
      }))
    }

    console.log('Filters response:', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Filter options error:', error)
    return NextResponse.json(
      { error: 'Internal server error', schools: [], levels: [] },
      { status: 500 }
    )
  }
}
