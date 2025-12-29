import { NextResponse } from 'next/server'
import { firebaseAdmin } from '@/lib/services/firebase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { uid } = body

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate real Firebase custom token
    const token = await firebaseAdmin.createCustomToken(uid)

    return NextResponse.json({ token })
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
    // For GET requests, we might not have a UID in the body, but we can try to get it from the session if implemented
    // For now, let's return a 400 if no UID can be determined
    return NextResponse.json(
      { error: 'POST with UID is required for token generation' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in Firebase token GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
