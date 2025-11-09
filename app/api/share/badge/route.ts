import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { v4 as uuidv4 } from "uuid"

// POST /api/share/badge - Create a shareable link for a badge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, badgeName, customMessage } = body

    if (!userId || !badgeName) {
      return NextResponse.json(
        { error: "userId and badgeName are required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const sharedContentCol = db.collection("shared_content")
    const usersCol = db.collection("users")
    const badgesCol = db.collection("badges")

    // Get user info
    const user = await usersCol.findOne({ id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get badge info
    const badge = await badgesCol.findOne({ name: badgeName })
    if (!badge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 })
    }

    // Verify user has this badge
    const userBadges = user.gamification?.badges || []
    const hasBadge = userBadges.some((b: any) => b.name === badgeName)
    if (!hasBadge) {
      return NextResponse.json(
        { error: "User does not have this badge" },
        { status: 403 }
      )
    }

    // Create shareable content
    const shareId = uuidv4()
    const sharedContent = {
      shareId,
      userId,
      type: "badge",
      data: {
        badgeName,
        badgeIcon: badge.icon,
        badgeColor: badge.color,
        badgeDescription: badge.description,
        userName: user.name,
        userAvatar: user.image,
        customMessage: customMessage || badge.shareableDescription,
        earnedAt: userBadges.find((b: any) => b.name === badgeName)?.earnedAt,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      views: 0,
      clicks: 0,
    }

    const result = await sharedContentCol.insertOne(sharedContent)

    return NextResponse.json({
      success: true,
      shareId,
      shareLink: `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareId}`,
    })
  } catch (error) {
    console.error("Badge sharing error:", error)
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    )
  }
}

// GET /api/share/badge/:shareId - Get shared badge content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get("shareId")

    if (!shareId) {
      return NextResponse.json(
        { error: "shareId is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const sharedContentCol = db.collection("shared_content")

    const sharedContent = await sharedContentCol.findOne({ shareId })
    if (!sharedContent) {
      return NextResponse.json(
        { error: "Shared content not found" },
        { status: 404 }
      )
    }

    // Check if expired
    if (sharedContent.expiresAt && new Date() > new Date(sharedContent.expiresAt)) {
      return NextResponse.json(
        { error: "This share link has expired" },
        { status: 410 }
      )
    }

    // Increment view count
    await sharedContentCol.updateOne(
      { shareId },
      {
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() },
      }
    )

    return NextResponse.json({
      success: true,
      content: sharedContent.data,
      type: sharedContent.type,
    })
  } catch (error) {
    console.error("Share retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve shared content" },
      { status: 500 }
    )
  }
}
