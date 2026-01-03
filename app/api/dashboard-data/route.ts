import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API: Starting request');

    // For now, we'll use a simple user identification since we don't have full auth setup
    // In a real app, this would use proper authentication
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '1' // Default to test user ID

    if (!userId) {
      console.log('Dashboard API: No user ID provided');
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Connect to database
    const db = await getDatabase();

    // Get user details from DB
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('Dashboard API: User not found in DB');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's quiz attempts
    const userAttempts = await db.collection('quiz_attempts')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate real data
    const realData = await calculateRealData(user, userAttempts, db);

    return NextResponse.json(realData);

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function calculateRealData(user: any, userAttempts: any[], db: any) {
  const completedAttempts = userAttempts.filter(attempt => attempt.status === 'completed');
  const totalQuizzes = completedAttempts.length;
  
  // Use the new score structure
  const averageScore = totalQuizzes > 0
    ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score?.percentage || 0), 0) / totalQuizzes)
    : 0;

  // Get user progress data
  const userProgress = user.progress || {};
  const totalPoints = userProgress.totalPoints || 0;
  const currentStreak = userProgress.currentStreak || 0;
  
  // Count certificates
  const certificates = await db.collection('certificates')
    .countDocuments({ userId: user._id });

  // Calculate weekly activity with fallback
  let weeklyActivity = getFallbackWeeklyActivity();
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = completedAttempts.filter(attempt =>
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
    for (const attempt of completedAttempts) {
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

    for (const attempt of completedAttempts) {
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
    if (completedAttempts.length > 0) {
      activities = completedAttempts
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10)
        .map(attempt => {
          const score = attempt.score?.percentage || 0;
          const type = score >= 70 ? 'certificate_earned' : 'quiz_completed';
          
          return {
            id: attempt._id?.toString() || Math.random().toString(),
            type,
            title: `Completed ${attempt.subject || 'Quiz'}`,
            description: `Completed ${attempt.subject || 'Quiz'} quiz`,
            time: formatTimeAgo(new Date(attempt.createdAt || Date.now())),
            score,
            subject: attempt.subject,
            difficulty: attempt.difficulty,
            link: `/quiz/results/${attempt._id?.toString()}?quizId=${attempt.quizId?.toString()}`
          };
        });
      
      // Add streak milestone activities
      if (currentStreak >= 3) {
        activities.unshift({
          id: `streak-${currentStreak}`,
          type: 'streak_milestone',
          title: `${currentStreak} day streak!`,
          description: `Amazing! You've maintained a ${currentStreak}-day learning streak!`,
          time: 'Today',
          link: '/dashboard'
        });
      }
      
      // Add score improvement activities (compare with previous attempts)
      const scoreImprovements = completedAttempts
        .filter((attempt, index) => {
          if (index === 0) return false;
          const previousAttempt = completedAttempts[index - 1];
          const currentScore = attempt.score?.percentage || 0;
          const previousScore = previousAttempt.score?.percentage || 0;
          return currentScore > previousScore + 10; // Improved by more than 10%
        })
        .slice(0, 3);
      
      scoreImprovements.forEach(improvement => {
        activities.push({
          id: `improvement-${improvement._id}`,
          type: 'score_improvement',
          title: 'Score improved!',
          description: `Great progress in ${improvement.subject || 'Quiz'}!`,
          time: formatTimeAgo(new Date(improvement.createdAt || Date.now())),
          score: improvement.score?.percentage,
          subject: improvement.subject,
          difficulty: improvement.difficulty,
          link: `/quiz/results/${improvement._id?.toString()}?quizId=${improvement.quizId?.toString()}`
        });
      });
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
    const allUsers = await db.collection('users').find({}).sort({ 'progress.totalPoints': -1 }).limit(5).toArray();

    if (allUsers.length > 0) {
      leaderboard = allUsers.map((user: any, index: number) => ({
        rank: index + 1,
        name: user.name || 'Anonymous',
        points: user.progress?.totalPoints || 0,
        avatar: user.avatar || '/avatars/default.jpg'
      }));
    }
  } catch (leaderboardError) {
    console.warn('Error fetching leaderboard:', leaderboardError);
  }

  // Calculate weekly points
  let weeklyPoints = 0;
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = completedAttempts.filter(attempt =>
      attempt.createdAt && new Date(attempt.createdAt) > sevenDaysAgo
    );
    
    weeklyPoints = recentAttempts.reduce((sum, attempt) => {
      const points = Math.round((attempt.score?.percentage || 0) / 10); // 10 points per 10% score
      return sum + points;
    }, 0);
  } catch (weeklyPointsError) {
    console.warn('Error calculating weekly points:', weeklyPointsError);
  }

  return {
    stats: {
      totalQuizzes,
      completedQuizzes: totalQuizzes,
      averageScore,
      certificates,
      streak: currentStreak,
      totalPoints
    },
    weeklyPoints,
    subjectProgress: userProgress.subjectProgress || {},
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
