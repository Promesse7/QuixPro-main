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

    // If no userId, return all available badges (public view)
    if (!userId) {
      return NextResponse.json({
        context: "global",
        badges: allBadges,
      });
    }

    const user = await usersCol.findOne({ _id: new ObjectId(userId) });
    const earnedBadgeIds =
      user?.gamification?.badges?.map((b: any) => b.badgeId?.toString()) || [];

    const enrichedBadges = allBadges.map((badge) => {
      const isEarned = earnedBadgeIds.includes(badge.badgeId?.toString());
      const earnedInfo = user?.gamification?.badges?.find(
        (b: any) => b.badgeId?.toString() === badge.badgeId?.toString()
      );
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

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    const badgesCol = db.collection("badges");
    const usersCol = db.collection("users");
    const progressCol = db.collection("user_progress");

    const user = await usersCol.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allBadges = await badgesCol.find({}).toArray();
    const earnedBadgeIds =
      user.gamification?.badges?.map((b: any) => b.badgeId?.toString()) || [];

    const newlyEarned: any[] = [];
    let totalXPAdded = 0;

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.badgeId?.toString())) continue;

      let isEligible = false;
      const type = badge.unlockCriteria?.type;
      const threshold = badge.unlockCriteria?.threshold || 0;

      switch (type) {
        case "xp":
          isEligible = (user.gamification?.totalXP || 0) >= threshold;
          break;

        case "quizzes_completed":
          isEligible = (user.analytics?.totalQuizzesTaken || 0) >= threshold;
          break;

        case "perfect_scores": {
          const perfectScores = await progressCol
            .aggregate([
              { $match: { userId: user._id } },
              { $unwind: "$quizAttempts" },
              { $match: { "quizAttempts.score": 100 } },
              { $count: "count" },
            ])
            .toArray();
          const count = perfectScores[0]?.count || 0;
          isEligible = count >= threshold;
          break;
        }

        case "streak":
          isEligible = (user.gamification?.streak || 0) >= threshold;
          break;
      }

      if (isEligible) {
        const newBadge = {
          badgeId: badge.badgeId?.toString(),
          name: badge.name,
          earnedAt: new Date(),
          tier: badge.tier,
        };

        newlyEarned.push(newBadge);
        totalXPAdded += badge.xpReward || 0;
      }
    }

    if (newlyEarned.length > 0) {
      await usersCol.updateOne(
        { _id: user._id },
        {
          $push: { "gamification.badges": { $each: newlyEarned } },
          $inc: { "gamification.totalXP": totalXPAdded },
        }
      );
    }

    return NextResponse.json({
      success: true,
      newlyEarned,
      totalEarned: earnedBadgeIds.length + newlyEarned.length,
      totalXPAdded,
    });
  } catch (error) {
    console.error("Badge check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
