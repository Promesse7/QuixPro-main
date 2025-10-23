import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * Utility to safely create ObjectIds without crashing.
 */
function safeObjectId(id: string | null) {
  try {
    return id && ObjectId.isValid(id) ? new ObjectId(id) : null;
  } catch {
    return null;
  }
}

/**
 * ✅ GET /api/user/progress?userId=xxx&courseId=xxx
 * Fetches user progress data and aggregated stats.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    const progressCol = db.collection("user_progress");

    const query: any = { userId: safeObjectId(userId) };
    if (courseId) query.courseId = safeObjectId(courseId);

    const progressData = await progressCol.find(query).toArray();

    if (!progressData.length) {
      return NextResponse.json({ message: "No progress found", progress: [], stats: {} });
    }

    // ✅ Aggregate statistics safely
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter(p => p.completedAt).length;
    const totalXP = progressData.reduce((sum, p) => sum + (p.totalXPEarned || 0), 0);
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageScore =
      totalCourses > 0
        ? progressData.reduce((sum, p) => sum + (p.averageScore || 0), 0) / totalCourses
        : 0;

    const stats = { totalCourses, completedCourses, totalXP, averageScore, totalTimeSpent };

    return NextResponse.json({ progress: progressData, stats });
  } catch (error) {
    console.error("❌ Progress fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * ✅ POST /api/user/progress
 * Handles progress updates for units, quizzes, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, unitId, action, data } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const progressCol = db.collection("user_progress");
    const usersCol = db.collection("users");
    const unitsCol = db.collection("units");

    const userObjId = safeObjectId(userId);
    const courseObjId = safeObjectId(courseId);
    const unitObjId = safeObjectId(unitId);

    // Find or create progress record
    let progress = await progressCol.findOne({ userId: userObjId, courseId: courseObjId });

    if (!progress) {
      progress = {
        userId: userObjId,
        courseId: courseObjId,
        currentUnitId: unitObjId,
        completedUnits: [],
        unlockedUnits: unitObjId ? [unitObjId] : [],
        overallProgress: 0,
        averageScore: 0,
        totalXPEarned: 0,
        timeSpent: 0,
        quizAttempts: [],
        strengths: [],
        weaknesses: [],
        recommendedReview: [],
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      };
      const insertResult = await progressCol.insertOne(progress);
      progress._id = insertResult.insertedId;
    }

    // ✅ Handle different actions
    switch (action) {
      case "complete_unit": {
        const unitAlreadyCompleted = progress.completedUnits.some(
          (u: any) => u.toString() === unitObjId?.toString()
        );

        if (!unitAlreadyCompleted && unitObjId) {
          await progressCol.updateOne(
            { _id: progress._id },
            {
              $addToSet: { completedUnits: unitObjId },
              $set: {
                lastAccessedAt: new Date(),
                currentUnitId: data?.nextUnitId ? safeObjectId(data.nextUnitId) : progress.currentUnitId,
              },
              $inc: { totalXPEarned: data?.xpEarned || 0 },
            }
          );

          await usersCol.updateOne(
            { _id: userObjId },
            {
              $inc: {
                "gamification.totalXP": data?.xpEarned || 0,
                "stats.completedQuizzes": 1,
              },
            }
          );
        }
        break;
      }

      case "quiz_attempt": {
        await progressCol.updateOne(
          { _id: progress._id },
          {
            $push: {
              quizAttempts: {
                quizId: safeObjectId(data?.quizId),
                attemptNumber: data?.attemptNumber,
                score: data?.score,
                timeTaken: data?.timeTaken,
                completedAt: new Date(),
                answeredQuestions: data?.answeredQuestions || [],
              },
            },
            $set: { lastAccessedAt: new Date() },
            $inc: {
              timeSpent: data?.timeTaken || 0,
              totalXPEarned: data?.xpEarned || 0,
            },
          }
        );

        await usersCol.updateOne(
          { _id: userObjId },
          {
            $inc: {
              "gamification.totalXP": data?.xpEarned || 0,
              "analytics.totalQuizzesTaken": 1,
              "analytics.totalQuizzesPassed": data?.score >= 70 ? 1 : 0,
              "analytics.totalTimeSpent": data?.timeTaken || 0,
            },
          }
        );

        await updateUserStreak(db, userId);
        break;
      }

      case "unlock_unit": {
        await progressCol.updateOne(
          { _id: progress._id },
          {
            $addToSet: { unlockedUnits: unitObjId },
            $set: { lastAccessedAt: new Date() },
          }
        );
        break;
      }

      default:
        console.warn("⚠️ Unknown progress action:", action);
        break;
    }

    // ✅ Recalculate progress
    const totalUnits = await unitsCol.countDocuments({ courseId: courseObjId });
    const updatedProgress = await progressCol.findOne({ _id: progress._id });
    const completedCount = updatedProgress?.completedUnits?.length || 0;
    const overallProgress = totalUnits > 0 ? (completedCount / totalUnits) * 100 : 0;

    await progressCol.updateOne({ _id: progress._id }, { $set: { overallProgress } });

    const finalProgress = await progressCol.findOne({ _id: progress._id });

    return NextResponse.json({ success: true, progress: finalProgress });
  } catch (error) {
    console.error("❌ Progress update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * ✅ Helper: Update user streak stats safely
 */
async function updateUserStreak(db: any, userId: string) {
  try {
    const usersCol = db.collection("users");
    const user = await usersCol.findOne({ _id: safeObjectId(userId) });
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.gamification?.lastActivityDate
      ? new Date(user.gamification.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        await usersCol.updateOne(
          { _id: safeObjectId(userId) },
          {
            $inc: { "gamification.streak": 1 },
            $set: { "gamification.lastActivityDate": today },
          }
        );
      } else if (daysDiff > 1) {
        await usersCol.updateOne(
          { _id: safeObjectId(userId) },
          {
            $set: {
              "gamification.streak": 1,
              "gamification.lastActivityDate": today,
            },
          }
        );
      }
    } else {
      await usersCol.updateOne(
        { _id: safeObjectId(userId) },
        {
          $set: {
            "gamification.streak": 1,
            "gamification.lastActivityDate": today,
          },
        }
      );
    }
  } catch (error) {
    console.error("⚠️ Streak update error:", error);
  }
}
