import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { withAuth } from '@/lib/middleware/withAuth';

// Rate limiting configuration
const RATE_LIMIT = {
  max: 100, // 100 requests per window
  windowMs: 60 * 1000, // 1 minute
};

// Main handler function that will be wrapped with auth
async function dashboardHandler(
  request: NextRequest,
  _context: { params: any },
  user: any
) {
  try {
    console.log('Dashboard API: Processing request for user', user.email);

    // Connect to database
    const db = await getDatabase();

    // Get fresh user details from DB
    const userData = await db.collection('users').findOne({ email: user.email });
    if (!userData) {
      console.log('Dashboard API: User not found in DB');
      return NextResponse.json({
        error: 'User not found',
        message: 'Please complete your profile setup to access dashboard data.',
        action: 'CREATE_PROFILE'
      }, { status: 404 });
    }

    // Get user's quiz attempts
    const userAttempts = await db.collection('quiz_attempts')
      .find({ userId: userData._id.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate dashboard data
    const realData = await calculateRealData(userData, userAttempts, db);

    return NextResponse.json(realData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Unable to fetch dashboard data. Please try again later.'
    }, { status: 500 });
  }
}

// Export route handler wrapped with authentication and rate limiting
export const GET = withAuth(dashboardHandler, {
  roles: ['student', 'teacher', 'admin'],
  rateLimit: RATE_LIMIT
});

async function calculateRealData(user: any, userAttempts: any[], db: any) {
  const totalQuizzes = userAttempts.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(userAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / totalQuizzes)
    : 0;

  // Calculate weekly activity with fallback
  let weeklyActivity = getFallbackWeeklyActivity();
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = userAttempts.filter(attempt =>
      attempt.createdAt && new Date(attempt.createdAt) > sevenDaysAgo
    );

    if (recentAttempts.length > 0) {
      weeklyActivity = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
        const dayAttempts = recentAttempts.filter(attempt => {
          const attemptDate = new Date(attempt.createdAt);
          return attemptDate.getDay() === (index + 1) % 7;
        });
        return { day, attempts: dayAttempts.length };
      });
    }
  } catch (weeklyError) {
    console.warn('Error calculating weekly activity:', weeklyError);
  }

  // Calculate subject distribution with fallback
  let subjectDistribution: { subject: string; count: number; message?: string }[] = getFallbackSubjectDistribution();
  try {
    const subjectCounts: Record<string, number> = {};
    for (const attempt of userAttempts) {
      if (attempt.subject) {
        const subject = attempt.subject;
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
    }

    const subjects = Object.entries(subjectCounts);
    if (subjects.length > 0) {
      subjectDistribution = subjects.map(([subject, count]) => ({ subject, count: count as number }));
    }
  } catch (subjectError) {
    console.warn('Error calculating subject distribution:', subjectError);
  }

  // Calculate difficulty breakdown with fallback
  let difficultyBreakdown = getFallbackDifficultyBreakdown();
  try {
    const difficultyCounts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
    let hasDifficultyData = false;

    for (const attempt of userAttempts) {
      if (attempt.difficulty && difficultyCounts.hasOwnProperty(attempt.difficulty)) {
        difficultyCounts[attempt.difficulty]++;
        hasDifficultyData = true;
      }
    }

    if (hasDifficultyData) {
      difficultyBreakdown = Object.entries(difficultyCounts)
        .map(([difficulty, count]) => ({ difficulty, count }))
        .filter(item => item.count > 0);
    }
  } catch (difficultyError) {
    console.warn('Error calculating difficulty breakdown:', difficultyError);
  }

  // Get activities with fallback
  let activities: { id: string; type: string; title: string; time: string; action?: string; actionText?: string; score?: number }[] = getFallbackActivities();
  try {
    if (userAttempts.length > 0) {
      activities = userAttempts
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5)
        .map(attempt => ({
          id: attempt._id?.toString() || Math.random().toString(),
          type: 'quiz',
          title: `Completed ${attempt.subject || 'Quiz'}`,
          time: formatTimeAgo(new Date(attempt.createdAt || Date.now())),
          score: attempt.score || 0
        }));
    }
  } catch (activitiesError) {
    console.warn('Error creating activities:', activitiesError);
  }

  // Get recommended quizzes (try real data, fallback to mock)
  let recommendedQuizzes = getFallbackRecommendedQuizzes();
  try {
    const quizzes = db.collection('quizzes');
    const availableQuizzes = await quizzes.find({}).limit(3).toArray();

    if (availableQuizzes.length > 0) {
      recommendedQuizzes = availableQuizzes.map((quiz: any) => ({
        id: quiz._id.toString(),
        title: quiz.title || 'Quiz',
        difficulty: quiz.difficulty || 'Medium',
        duration: quiz.duration || '15 min',
        category: quiz.subject || 'General'
      }));
    }
  } catch (quizzesError) {
    console.warn('Error fetching recommended quizzes:', quizzesError);
  }

  // Get leaderboard with fallback
  let leaderboard = getFallbackLeaderboard();
  try {
    const allUsers = await db.collection('users').find({}).sort({ points: -1 }).limit(5).toArray();

    if (allUsers.length > 0) {
      leaderboard = allUsers.map((user: any, index: number) => ({
        rank: index + 1,
        name: user.name || 'Anonymous',
        points: user.points || 0,
        avatar: user.avatar || '/avatars/default.jpg'
      }));
    }
  } catch (leaderboardError) {
    console.warn('Error fetching leaderboard:', leaderboardError);
  }

  return {
    stats: {
      totalQuizzes,
      completedQuizzes: totalQuizzes,
      averageScore,
      certificates: 0,
      streak: user.streak || 0,
      totalPoints: user.points || 0
    },
    analytics: {
      weeklyActivity,
      subjectDistribution,
      difficultyBreakdown,
      chatActivity: [] // Implement when chat system is ready
    },
    activities,
    recommendedQuizzes,
    leaderboard,
    achievements: [], // Implement when achievements system is ready
    socialSignals: {
      activeUsers: await getActiveUserCount(db),
      newMessages: 0 // Implement when messaging system is ready
    }
  };
}

async function getActiveUserCount(db: any): Promise<number> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const count = await db.collection('users').countDocuments({
      lastActive: { $gte: sevenDaysAgo }
    });
    return count;
  } catch (error) {
    console.warn('Error counting active users:', error);
    return 150; // Fallback value
  }
}

// Fallback data functions - now encouraging users to create data
function getFallbackWeeklyActivity() {
  return [
    { day: 'Mon', attempts: 0 },
    { day: 'Tue', attempts: 0 },
    { day: 'Wed', attempts: 0 },
    { day: 'Thu', attempts: 0 },
    { day: 'Fri', attempts: 0 },
    { day: 'Sat', attempts: 0 },
    { day: 'Sun', attempts: 0 }
  ];
}

function getFallbackSubjectDistribution() {
  return [
    { subject: 'No quizzes yet', count: 0, message: 'Start taking quizzes to see your subject distribution' }
  ];
}

function getFallbackDifficultyBreakdown() {
  return [
    { difficulty: 'Easy', count: 0, message: 'Complete your first quiz to see difficulty breakdown' },
    { difficulty: 'Medium', count: 0 },
    { difficulty: 'Hard', count: 0 }
  ];
}

function getFallbackActivities() {
  return [
    {
      id: '1',
      type: 'welcome',
      title: '👋 Welcome to Quix! Start your first quiz to see your progress.',
      time: 'Just now',
      action: 'START_QUIZ',
      actionText: 'Take Your First Quiz'
    }
  ];
}

function getFallbackRecommendedQuizzes() {
  return [
    {
      id: 'getting-started',
      title: '🎯 Getting Started Quiz',
      difficulty: 'Easy',
      duration: '10 min',
      category: 'General',
      action: 'START_QUIZ',
      actionText: 'Start Learning'
    }
  ];
}

function getFallbackLeaderboard() {
  return [
    {
      rank: 1,
      name: 'You',
      points: 0,
      avatar: '/avatars/you.jpg',
      message: 'Complete quizzes to earn points and climb the leaderboard!'
    }
  ];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
}
