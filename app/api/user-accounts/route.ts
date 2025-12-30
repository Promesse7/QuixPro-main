import { NextRequest, NextResponse } from 'next/server'
import { UserAccountManager } from '@/lib/userAccount'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, name, role, school, level } = await request.json()

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, role' },
        { status: 400 }
      )
    }

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection('userAccounts')

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user account with unique ID
    const userAccountData = UserAccountManager.createUserAccount({
      email,
      name,
      role,
      school,
      level
    })

    const result = await usersCollection.insertOne(userAccountData)

    // Return the new user with their unique ID
    return NextResponse.json({
      success: true,
      user: {
        _id: result.insertedId,
        uniqueUserId: userAccountData.uniqueUserId,
        email: userAccountData.email,
        name: userAccountData.name,
        role: userAccountData.role,
        createdAt: userAccountData.createdAt
      }
    })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create user account' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { search } = Object.fromEntries(request.nextUrl.searchParams)

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection('userAccounts')

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'profile.school': { $regex: search, $options: 'i' } }
        ]
      }
    }

    const users = await usersCollection
      .find(query)
      .project({
        uniqueUserId: 1,
        email: 1,
        name: 1,
        role: 1,
        'profile.school': 1,
        'profile.level': 1,
        createdAt: 1
      })
      .limit(20)
      .toArray()

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        _id: user._id.toString()
      }))
    })
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    )
  }
}
