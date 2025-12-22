import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getDashboardData(userId: string) {
  const db = await getDatabase();
  const userObjectId = new ObjectId(userId);

  // --- Core User and Activity Data ---
  const user = await db.collection('users').findOne({ _id: userObjectId });
  const totalXP = user?.gamification?.totalXP || 0;
  const streak = user?.gamification?.streak || 0;
  const level = Math.max(1, Math.floor(totalXP / 1000));

  const attempts = await db.collection('quiz_attempts').find({ userId }).sort({ createdAt: -1 }).limit(10).toArray();
  const certificates = await db.collection('certificates').find({ userId: userId.toString() }).sort({ completedAt: -1 }).limit(10).toArray();

  const activities = [
    ...attempts.map((a: any) => ({ id: a._id.toString(), type: 'quiz_completed', description: `Completed quiz ${a.quizId}`, time: a.createdAt, link: `/quiz/${a.quizId}` })),
    ...certificates.map((c: any) => ({ id: c._id.toString(), type: 'certificate_earned', description: `Earned certificate: ${c.title}`, time: c.completedAt || c.createdAt, link: `/certificates/${c._id.toString()}` }))
  ].sort((a, b) => new Date(b.time as any).getTime() - new Date(a.time as any).getTime());

  // --- Main Stats Grid ---
  const stats = [
    { id: 'xp', title: 'Total XP Earned', value: `${totalXP} XP`, description: '+1.2% vs last month', changeType: 'positive' },
    { id: 'streak', title: 'Current Streak', value: `${streak} days`, description: 'Keep it going!', changeType: 'positive' },
    { id: 'level', title: 'Current Level', value: `${level}`, description: `Next level at ${(level + 1) * 1000} XP`, changeType: 'neutral' },
    { id: 'quizzes', title: 'Quizzes Completed', value: attempts.length.toString(), description: 'in the last 7 days', changeType: 'positive' },
    { id: 'certs', title: 'Certificates Earned', value: certificates.length.toString(), description: 'All time', changeType: 'neutral' },
  ];

  // --- Analytics Section (Real Data) ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyActivity = await db.collection('quiz_attempts').aggregate([
    { $match: { userId, createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { day: '$_id', attempts: '$count', _id: 0 } }
  ]).toArray();

  const subjectDistribution = await db.collection('quiz_attempts').aggregate([
    { $match: { userId, status: 'completed' } },
    { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'quizInfo' } },
    { $unwind: '$quizInfo' },
    { $group: { _id: '$quizInfo.subject', count: { $sum: 1 } } },
    { $project: { subject: '$_id', count: '$count', _id: 0 } }
  ]).toArray();

  const difficultyBreakdown = await db.collection('quiz_attempts').aggregate([
    { $match: { userId } },
    { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'quizInfo' } },
    { $unwind: '$quizInfo' },
    { $group: { _id: '$quizInfo.difficulty', count: { $sum: 1 } } },
    { $project: { difficulty: '$_id', count: '$count', _id: 0 } }
  ]).toArray();

  const chatActivity = await db.collection('messages').aggregate([
    { $match: { senderId: userId, createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { day: '$_id', messages: '$count', _id: 0 } }
  ]).toArray();

  const analytics = { weeklyActivity, subjectDistribution, difficultyBreakdown, chatActivity };

  // --- Recommended Quizzes (Real Data) ---
  const attemptedSubjectNames = (await db.collection('quiz_attempts').aggregate([
      { $match: { userId } },
      { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'quizInfo' } },
      { $unwind: '$quizInfo' },
      { $group: { _id: '$quizInfo.subject' } }
  ]).toArray()).map((s: any) => s._id);

  const recommendedQuizzes = await db.collection('quizzes').aggregate([
      { $match: { subject: { $nin: attemptedSubjectNames } } },
      { $limit: 3 },
      { $project: { id: { $toString: '$_id' }, title: '$title', subject: '$subject', reason: 'New topic' } }
  ]).toArray();

  // --- Leaderboard (Real Data) ---
  const allUsers = await db.collection('users').find({}, { projection: { username: 1, 'gamification.totalXP': 1 } }).sort({ 'gamification.totalXP': -1 }).toArray();
  const rankedUsers = allUsers.map((u, index) => ({ ...u, rank: index + 1 }));
  const currentUserInLeaderboard = rankedUsers.find(u => u._id.toString() === userId);

  let leaderboard = rankedUsers.slice(0, 5).map(u => ({
      rank: u.rank,
      name: u._id.toString() === userId ? 'You' : (u.username || `User #${u.rank}`),
      xp: u.gamification?.totalXP || 0,
      isCurrentUser: u._id.toString() === userId,
  }));

  if (currentUserInLeaderboard && currentUserInLeaderboard.rank > 5) {
      leaderboard.push({ rank: currentUserInLeaderboard.rank, name: 'You', xp: currentUserInLeaderboard.gamification?.totalXP || 0, isCurrentUser: true });
  }

  // --- Achievements (Real Data) ---
  const achievements = certificates.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      description: `Earned on ${new Date(c.completedAt).toLocaleDateString()}`,
      type: 'certificate' as const,
  }));

  // --- Social Signals (Real Data) ---
  const conversationIds = (await db.collection('conversations').find({ participants: userId }).project({ _id: 1 }).toArray()).map(c => c._id.toString());
  
  const unreadMessages = await db.collection('messages').countDocuments({
      groupId: { $in: conversationIds }, // Assuming groupId maps to conversationId
      senderId: { $ne: userId },
      readBy: { $nin: [userId] }
  });

  // Assumes a `groupMemberships` collection exists as per the provided technical specification.
  const memberships = await db.collection('groupMemberships').find({ userId }).toArray();
  let groupUpdates = 0;
  for (const membership of memberships) {
      const groupHasUpdate = await db.collection('groups').countDocuments({
          _id: membership.groupId,
          updatedAt: { $gt: membership.lastSeenAt }
      });

      if (groupHasUpdate > 0) {
          groupUpdates++;
          continue;
      }

      const groupHasNewMessage = await db.collection('messages').countDocuments({
          groupId: membership.groupId.toString(), // Assuming groupId maps to conversationId
          createdAt: { $gt: membership.lastSeenAt }
      });

      if (groupHasNewMessage > 0) {
          groupUpdates++;
      }
  }

  const socialSignals = { unreadMessages, groupUpdates };

  return { stats, analytics, activities, recommendedQuizzes, leaderboard, achievements, socialSignals };
}
