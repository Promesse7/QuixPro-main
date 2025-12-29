import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // For development/testing, return a mock token
    // In production, implement proper Firebase authentication
    
    const body = await req.json()
    const { uid } = body

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Return a mock token for testing
    const mockToken = `mock-token-${uid}-${Date.now()}`

    return NextResponse.json({ token: mockToken })
  } catch (error) {
    console.error('Error creating Firebase token:', error)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // For GET requests, return a simple mock token for a test user
    const testUserId = 'test-user-123'
    const mockToken = `mock-token-${testUserId}-${Date.now()}`

    return NextResponse.json({ token: mockToken })
  } catch (error) {
    console.error('Error creating Firebase token:', error)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}
