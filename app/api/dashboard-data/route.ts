import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API: Starting request');

    // 1. Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('Dashboard API: No session found, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Connect to database
    const db = await getDatabase();

    // 3. Get user details from DB
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      console.log('Dashboard API: User not found in DB');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Get user's quiz attempts
    const userAttempts = await db.collection('quiz_attempts')
      .find({ userId: user._id.toString() }) // Ensure string comparison if storing as string, or ObjectId if ObjectId
      .sort({ createdAt: -1 })
      .toArray();

    // 5. Calculate real data
    const realData = await calculateRealData(user, userAttempts, db);

    return NextResponse.json(realData);

  } catch (error) {
    console.error('Dashboard data error:', error);
    // On server error, we might still want to return 500 so frontend knows it failed
    // The frontend has fallback logic for errors
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getCalendarEvents(userId: string, db: any) {
  try {
    // Get upcoming quizzes
    const upcomingQuizzes = await db.collection('quizzes')
      .find({
        startDate: { $gte: new Date() },
        $or: [
          { assignedTo: 'all' },
          { assignedTo: userId },
          { assignedUsers: { $in: [userId] } }
        ]
      })
      .sort({ startDate: 1 })
      .limit(5)
      .toArray()
    // Get assignments/deadlines
    const assignments = await db.collection('assignments')
      .find({
        userId,
        dueDate: { $gte: new Date() },
        completed: { $ne: true }
      })
      .sort({ dueDate: 1 })
      .limit(5)
      .toArray()
    // Format events
    return [
      ...upcomingQuizzes.map((quiz: any) => ({
        id: `quiz-${quiz._id}`,
        title: quiz.title,
        date: quiz.startDate,
        type: 'quiz' as const
      })),
      ...assignments.map((assignment: any) => ({
        id: `assignment-${assignment._id}`,
        title: assignment.title,
        date: assignment.dueDate,
        type: 'deadline' as const
      }))
    ]
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}


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
  let subjectDistribution = getFallbackSubjectDistribution();
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
  let activities = getFallbackActivities();
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
 const calendarEvents = await getCalendarEvents(user._id, db)
  return {
    stats: {
      totalQuizzes,
      completedQuizzes: totalQuizzes,
      averageScore,
      calendarEvents,
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

// Fallback data functions
function getFallbackData() {
  return {
    stats: { totalQuizzes: 0, averageScore: 0, streak: 0, totalPoints: 0 },
    analytics: {
      weeklyActivity: getFallbackWeeklyActivity(),
      subjectDistribution: getFallbackSubjectDistribution(),
      difficultyBreakdown: getFallbackDifficultyBreakdown(),
      chatActivity: []
    },
    activities: getFallbackActivities(),
    recommendedQuizzes: getFallbackRecommendedQuizzes(),
    leaderboard: getFallbackLeaderboard(),
    achievements: [],
    socialSignals: { activeUsers: 0, newMessages: 0 }
  };
}

function getFallbackWeeklyActivity() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, attempts: 0 }));
}

function getFallbackSubjectDistribution() {
  return [
    { subject: 'Mathematics', count: 0 },
    { subject: 'Science', count: 0 },
    { subject: 'English', count: 0 }
  ];
}

function getFallbackDifficultyBreakdown() {
  return [
    { difficulty: 'Easy', count: 0 },
    { difficulty: 'Medium', count: 0 },
    { difficulty: 'Hard', count: 0 }
  ];
}

function getFallbackActivities() {
  return [
    { id: '1', type: 'welcome', title: 'Welcome to Quix! Start your first quiz to see your progress.', time: 'Just now' }
  ];
}

function getFallbackRecommendedQuizzes() {
  return [
    { id: '1', title: 'Getting Started Quiz', difficulty: 'Easy', duration: '10 min', category: 'General' },
    { id: '2', title: 'Math Basics', difficulty: 'Easy', duration: '15 min', category: 'Mathematics' },
    { id: '3', title: 'Science Introduction', difficulty: 'Medium', duration: '20 min', category: 'Science' }
  ];
}

function getFallbackLeaderboard() {
  return [
    { rank: 1, name: 'You', points: 0, avatar: '/avatars/you.jpg' }
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
