import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// GET /api/badges?userId=xxx - Get user's badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const db = await getDatabase();
    const badgesCol = db.collection("badges");
    const usersCol = db.collection("users");

    const allBadges = await badgesCol.find({}).toArray();

    if (!userId) {
      return NextResponse.json({ context: "global", badges: allBadges });
    }

    let user: any = null;
    if (userId && /^[a-fA-F0-9]{24}$/.test(userId)) {
      user = await usersCol.findOne({ _id: new ObjectId(userId) });
    }

    const earnedBadgeIds = user?.gamification?.badges?.map((b: any) => b.badgeId) || [];

    const enrichedBadges = allBadges.map((badge) => {
      const isEarned = earnedBadgeIds.includes(badge.badgeId);
      const earnedInfo = user?.gamification?.badges?.find((b: any) => b.badgeId === badge.badgeId);
      return {
        ...badge,
        isEarned,
        earnedAt: earnedInfo?.earnedAt || null,
      };
    });

    return NextResponse.json({ badges: enrichedBadges });
  } catch (error) {
    console.error("Badges fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/badges/check - Check and award eligible badges
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId || !/^[a-fA-F0-9]{24}$/.test(userId)) {
      return NextResponse.json({ error: "Valid User ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCol = db.collection("users");
    const user = await usersCol.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const badgesCol = db.collection("badges");
    const allBadges = await badgesCol.find({}).toArray();
    const earnedBadgeIds = user.gamification?.badges?.map((b: any) => b.badgeId) || [];
    const newlyEarned: any[] = [];
    let totalXPAdded = 0;

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.badgeId)) continue;

      let isEligible = false;
      const criteria = badge.unlockCriteria;
      if (!criteria) continue;

      switch (criteria.type) {
        case "xp":
          isEligible = (user.stats?.totalPoints || 0) >= criteria.threshold;
          break;
        case "quizzes_completed":
          isEligible = (user.stats?.completedQuizzes || 0) >= criteria.threshold;
          break;
        case "perfect_scores": {
          const attemptsCol = db.collection("quiz_attempts");
          const perfectScores = await attemptsCol.countDocuments({ 
            userId: user._id.toString(), 
            percentage: 100,
            status: "completed"
          });
          isEligible = perfectScores >= criteria.threshold;
          break;
        }
        case "streak":
          isEligible = (user.stats?.streak || 0) >= criteria.threshold;
          break;
        case "account_created":
          isEligible = true;
          break;
        // INNOVATION: New Social and Mastery Triggers
        case "friends_added":
          isEligible = (user.social?.friends?.length || 0) >= criteria.threshold;
          break;
        case "groups_joined":
          isEligible = (user.social?.groups?.length || 0) >= criteria.threshold;
          break;
        case "courses_completed":
          isEligible = (user.progress?.completedCourses?.length || 0) >= criteria.threshold;
          break;
      }

      if (isEligible) {
        const newBadge = {
          badgeId: badge.badgeId,
          name: badge.name,
          earnedAt: new Date(),
          tier: badge.tier,
        };
        newlyEarned.push(newBadge);
        totalXPAdded += badge.xpReward || 0;
      }
    }

    if (newlyEarned.length > 0) {
      // Get current user data
      const currentUser = await usersCol.findOne({ _id: user._id });
      
      // Initialize gamification if it doesn't exist
      const gamification = currentUser.gamification || { badges: [], totalXP: 0 };
      
      // Add new badges to the array
      gamification.badges.push(...newlyEarned);
      gamification.totalXP += totalXPAdded;

      // Update the user document
      await usersCol.updateOne(
        { _id: user._id },
        {
          $set: { gamification: gamification }
        }
      );
    }

    return NextResponse.json({
      success: true,
      newlyEarned,
    });
  } catch (error) {
    console.error("Badge check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
