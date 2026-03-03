/**
 * User Database Setup Script
 * This script sets up the user collection with sample data for the dashboard
 */

const { MongoClient } = require('mongodb');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quixpro';
const DB_NAME = 'quixpro';

async function setupUserDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('👥 Setting up user database...');
    
    // 1. Create indexes for better performance
    console.log('🔍 Creating user indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ name: 1 });
    await db.collection('users').createIndex({ points: -1 });
    await db.collection('users').createIndex({ lastActive: -1 });
    
    // Quiz attempts collection indexes
    await db.collection('quiz_attempts').createIndex({ userId: 1 });
    await db.collection('quiz_attempts').createIndex({ createdAt: -1 });
    await db.collection('quiz_attempts').createIndex({ userId: 1, createdAt: -1 });
    
    console.log('✅ Indexes created successfully');
    
    // 2. Create sample users
    console.log('👤 Creating sample users...');
    
    const sampleUsers = [
      {
        _id: new ObjectId(),
        name: "John Student",
        email: "john.student@quixpro.com",
        level: "S3",
        avatar: "/avatars/john.jpg",
        points: 2450,
        streak: 7,
        joinedAt: new Date("2024-01-15"),
        lastActive: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: "en"
        },
        gamification: {
          totalQuizzes: 12,
          completedQuizzes: 8,
          averageScore: 85,
          totalStudyTime: 480, // minutes
          certificates: 3,
          badges: ["quick_learner", "quiz_master", "consistent_student"],
          achievements: [
            { id: "quick_learner", title: "Quick Learner", description: "Complete 5 quizzes", earned: true, earnedAt: new Date("2024-02-01") },
            { id: "quiz_master", title: "Quiz Master", description: "Score 90%+ on 10 quizzes", earned: true, earnedAt: new Date("2024-02-15") },
            { id: "consistent_student", title: "Consistent Student", description: "7-day streak", earned: true, earnedAt: new Date("2024-02-20") }
          ]
        }
      },
      {
        _id: new ObjectId(),
        name: "Sarah Chen",
        email: "sarah.chen@quixpro.com",
        level: "S4",
        avatar: "/avatars/sarah.jpg",
        points: 2850,
        streak: 12,
        joinedAt: new Date("2024-01-10"),
        lastActive: new Date(),
        preferences: {
          notifications: true,
          darkMode: true,
          language: "en"
        },
        gamification: {
          totalQuizzes: 18,
          completedQuizzes: 15,
          averageScore: 92,
          totalStudyTime: 720,
          certificates: 5,
          badges: ["quick_learner", "quiz_master", "consistent_student", "high_scorer", "dedicated_learner"],
          achievements: [
            { id: "quick_learner", title: "Quick Learner", description: "Complete 5 quizzes", earned: true, earnedAt: new Date("2024-01-20") },
            { id: "quiz_master", title: "Quiz Master", description: "Score 90%+ on 10 quizzes", earned: true, earnedAt: new Date("2024-02-01") },
            { id: "consistent_student", title: "Consistent Student", description: "7-day streak", earned: true, earnedAt: new Date("2024-01-25") },
            { id: "high_scorer", title: "High Scorer", description: "Average score above 90%", earned: true, earnedAt: new Date("2024-02-10") },
            { id: "dedicated_learner", title: "Dedicated Learner", description: "Complete 15 quizzes", earned: true, earnedAt: new Date("2024-02-15") }
          ]
        }
      },
      {
        _id: new ObjectId(),
        name: "Mike Wilson",
        email: "mike.wilson@quixpro.com",
        level: "S2",
        avatar: "/avatars/mike.jpg",
        points: 2100,
        streak: 4,
        joinedAt: new Date("2024-02-01"),
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        preferences: {
          notifications: false,
          darkMode: false,
          language: "en"
        },
        gamification: {
          totalQuizzes: 8,
          completedQuizzes: 6,
          averageScore: 78,
          totalStudyTime: 320,
          certificates: 2,
          badges: ["quick_learner"],
          achievements: [
            { id: "quick_learner", title: "Quick Learner", description: "Complete 5 quizzes", earned: true, earnedAt: new Date("2024-02-15") }
          ]
        }
      },
      {
        _id: new ObjectId(),
        name: "Emma Davis",
        email: "emma.davis@quixpro.com",
        level: "S5",
        avatar: "/avatars/emma.jpg",
        points: 1950,
        streak: 3,
        joinedAt: new Date("2024-02-15"),
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        preferences: {
          notifications: true,
          darkMode: false,
          language: "en"
        },
        gamification: {
          totalQuizzes: 6,
          completedQuizzes: 4,
          averageScore: 82,
          totalStudyTime: 240,
          certificates: 1,
          badges: ["quick_learner"],
          achievements: [
            { id: "quick_learner", title: "Quick Learner", description: "Complete 5 quizzes", earned: true, earnedAt: new Date("2024-02-20") }
          ]
        }
      },
      {
        _id: new ObjectId(),
        name: "Alex Johnson",
        email: "alex.johnson@quixpro.com",
        level: "S6",
        avatar: "/avatars/alex.jpg",
        points: 3200,
        streak: 15,
        joinedAt: new Date("2024-01-05"),
        lastActive: new Date(),
        preferences: {
          notifications: true,
          darkMode: true,
          language: "en"
        },
        gamification: {
          totalQuizzes: 25,
          completedQuizzes: 22,
          averageScore: 94,
          totalStudyTime: 1200,
          certificates: 8,
          badges: ["quick_learner", "quiz_master", "consistent_student", "high_scorer", "dedicated_learner", "expert_level", "marathon_learner", "perfect_scores"],
          achievements: [
            { id: "quick_learner", title: "Quick Learner", description: "Complete 5 quizzes", earned: true, earnedAt: new Date("2024-01-15") },
            { id: "quiz_master", title: "Quiz Master", description: "Score 90%+ on 10 quizzes", earned: true, earnedAt: new Date("2024-01-25") },
            { id: "consistent_student", title: "Consistent Student", description: "7-day streak", earned: true, earnedAt: new Date("2024-01-20") },
            { id: "high_scorer", title: "High Scorer", description: "Average score above 90%", earned: true, earnedAt: new Date("2024-02-01") },
            { id: "dedicated_learner", title: "Dedicated Learner", description: "Complete 15 quizzes", earned: true, earnedAt: new Date("2024-02-05") },
            { id: "expert_level", title: "Expert Level", description: "Reach S6 level", earned: true, earnedAt: new Date("2024-02-10") },
            { id: "marathon_learner", title: "Marathon Learner", description: "Complete 20 quizzes", earned: true, earnedAt: new Date("2024-02-15") },
            { id: "perfect_scores", title: "Perfect Scores", description: "Score 100% on 5 quizzes", earned: true, earnedAt: new Date("2024-02-20") }
          ]
        }
      }
    ];
    
    // Insert sample users (or update if they exist)
    for (const user of sampleUsers) {
      await db.collection('users').replaceOne(
        { email: user.email },
        user,
        { upsert: true }
      );
    }
    
    console.log('✅ Sample users created/updated');
    
    // 3. Create sample quiz attempts
    console.log('📝 Creating sample quiz attempts...');
    
    const sampleQuizAttempts = [
      // John Student's quiz attempts
      {
        userId: sampleUsers[0]._id.toString(),
        quizId: "quiz_1",
        title: "Introduction to Forces",
        subject: "Physics",
        difficulty: "Easy",
        score: 92,
        totalQuestions: 5,
        correctAnswers: 4,
        timeSpent: 25, // minutes
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        feedback: "Great job! You understand force concepts well."
      },
      {
        userId: sampleUsers[0]._id.toString(),
        quizId: "quiz_2",
        title: "Heat Transfer Quiz",
        subject: "Physics",
        difficulty: "Medium",
        score: 88,
        totalQuestions: 3,
        correctAnswers: 3,
        timeSpent: 20,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        feedback: "Good understanding of heat transfer concepts."
      },
      {
        userId: sampleUsers[0]._id.toString(),
        quizId: "quiz_3",
        title: "Atomic Structure Basics",
        subject: "Chemistry",
        difficulty: "Easy",
        score: 95,
        totalQuestions: 2,
        correctAnswers: 2,
        timeSpent: 15,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        feedback: "Excellent! You have a solid understanding of atomic structure."
      },
      
      // Sarah Chen's quiz attempts
      {
        userId: sampleUsers[1]._id.toString(),
        quizId: "quiz_1",
        title: "Introduction to Forces",
        subject: "Physics",
        difficulty: "Easy",
        score: 98,
        totalQuestions: 5,
        correctAnswers: 5,
        timeSpent: 20,
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        feedback: "Perfect score! Outstanding performance."
      },
      {
        userId: sampleUsers[1]._id.toString(),
        quizId: "quiz_4",
        title: "Cell Structure and Function",
        subject: "Biology",
        difficulty: "Medium",
        score: 94,
        totalQuestions: 2,
        correctAnswers: 2,
        timeSpent: 18,
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        feedback: "Excellent work on cell biology!"
      },
      
      // Mike Wilson's quiz attempts
      {
        userId: sampleUsers[2]._id.toString(),
        quizId: "quiz_5",
        title: "Algebra Fundamentals",
        subject: "Mathematics",
        difficulty: "Easy",
        score: 76,
        totalQuestions: 2,
        correctAnswers: 1,
        timeSpent: 30,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        feedback: "Good effort! Review algebraic expressions for better results."
      }
    ];
    
    // Clear existing attempts and insert new ones
    await db.collection('quiz_attempts').deleteMany({});
    await db.collection('quiz_attempts').insertMany(sampleQuizAttempts);
    
    console.log('✅ Sample quiz attempts created');
    
    // 4. Verify data
    console.log('🔍 Verifying data...');
    
    const userCount = await db.collection('users').countDocuments();
    const attemptCount = await db.collection('quiz_attempts').countDocuments();
    
    console.log(`📊 Final Database Stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Quiz Attempts: ${attemptCount}`);
    
    // 5. Test queries
    console.log('🧪 Testing dashboard queries...');
    
    // Test user lookup
    const testUser = await db.collection('users').findOne({ email: "john.student@quixpro.com" });
    console.log(`✅ User lookup: ${testUser?.name} (${testUser?.points} points)`);
    
    // Test quiz attempts lookup
    const userAttempts = await db.collection('quiz_attempts').find({ userId: testUser?._id.toString() }).toArray();
    console.log(`✅ Quiz attempts: ${userAttempts.length} attempts found`);
    
    // Test leaderboard query
    const leaderboard = await db.collection('users').find({}).sort({ points: -1 }).limit(5).toArray();
    console.log(`✅ Leaderboard: ${leaderboard.length} users`);
    leaderboard.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} - ${user.points} points`);
    });
    
    console.log('🎉 User database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the setup
if (require.main === module) {
  setupUserDatabase()
    .then(() => {
      console.log('🎉 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupUserDatabase };
