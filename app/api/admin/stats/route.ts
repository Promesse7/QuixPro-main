import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const usersCol = db.collection('users');
    const quizzesCol = db.collection('quizzes');
    const attemptsCol = db.collection('quiz_attempts');
    const certificatesCol = db.collection('certificates');

    // Get real statistics
    const [
      totalUsers,
      totalQuizzes,
      totalAttempts,
      totalCertificates
    ] = await Promise.all([
      usersCol.countDocuments({}),
      quizzesCol.countDocuments({}),
      attemptsCol.countDocuments({}),
      certificatesCol.countDocuments({})
    ]);

    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await usersCol.countDocuments({
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    // Get completion rate
    const completedAttempts = await attemptsCol.find({ status: 'completed' }).toArray();
    const completionRate = totalAttempts > 0 
      ? Math.round((completedAttempts.length / totalAttempts) * 100) 
      : 0;

    // Get average score
    const scoreStats = await attemptsCol.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalScore: { $sum: '$score.percentage' } } },
      { $group: { _id: null, avgScore: { $avg: '$score.percentage' } } }
    ]).toArray();
    
    const averageScore = scoreStats.length > 0 ? Math.round(scoreStats[0].avgScore) : 0;

    // Get user distribution by role
    const userDistribution = await usersCol.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Get monthly growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyGrowth = await usersCol.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]).toArray();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalQuizzes,
        totalCertificates,
        activeUsers,
        completionRate,
        averageScore,
        userDistribution,
        monthlyGrowth,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
