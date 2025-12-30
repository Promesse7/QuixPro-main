import { NextRequest, NextResponse } from 'next/server'
import { UserMigrationManager } from '@/lib/userMigration'

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json()

    if (confirm !== 'MIGRATE_NOW') {
      return NextResponse.json(
        { error: 'Invalid confirmation' },
        { status: 400 }
      )
    }

    const result = await UserMigrationManager.migrateLegacyUsers()

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      result
    })
  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { search } = Object.fromEntries(request.nextUrl.searchParams)

    if (search === 'status') {
      // This would be a more complex implementation to check migration status
      return NextResponse.json({
        success: true,
        message: 'User migration system is ready',
        features: [
          'Unique user IDs generated at account creation',
          'Email-based identification phased out',
          'Backward compatibility maintained',
          'Firebase integration with stable identifiers'
        ]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'User migration API is running'
    })
  } catch (error) {
    console.error('Migration status error:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}
