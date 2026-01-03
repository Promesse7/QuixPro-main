const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function initializeBadges() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    
    const db = client.db('QuixDB');
    const badgesCol = db.collection('badges');

    // Default badges to initialize
    const defaultBadges = [
      {
        id: 'account_creator',
        name: 'Account Creator',
        description: 'Welcome to QuixPro! You created your account.',
        icon: '🎯',
        category: 'achievement',
        rarity: 'common',
        points: 10,
        criteria: {
          type: 'account_creation',
          value: true
        },
        createdAt: new Date()
      },
      {
        id: 'first_quiz',
        name: 'Quiz Beginner',
        description: 'Completed your first quiz.',
        icon: '📝',
        category: 'achievement',
        rarity: 'common',
        points: 15,
        criteria: {
          type: 'quiz_completion',
          value: 1
        },
        createdAt: new Date()
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Completed 10 quizzes.',
        icon: '🏆',
        category: 'milestone',
        rarity: 'rare',
        points: 50,
        criteria: {
          type: 'quiz_completion',
          value: 10
        },
        createdAt: new Date()
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Achieved 100% on a quiz.',
        icon: '💯',
        category: 'achievement',
        rarity: 'rare',
        points: 30,
        criteria: {
          type: 'perfect_score',
          value: 1
        },
        createdAt: new Date()
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintained a 7-day quiz streak.',
        icon: '🔥',
        category: 'milestone',
        rarity: 'epic',
        points: 75,
        criteria: {
          type: 'streak',
          value: 7
        },
        createdAt: new Date()
      },
      {
        id: 'certificate_earner',
        name: 'Certificate Earner',
        description: 'Earned your first certificate.',
        icon: '🎓',
        category: 'achievement',
        rarity: 'rare',
        points: 40,
        criteria: {
          type: 'certificate',
          value: 1
        },
        createdAt: new Date()
      },
      {
        id: 'knowledge_seeker',
        name: 'Knowledge Seeker',
        description: 'Completed quizzes in 3 different subjects.',
        icon: '📚',
        category: 'milestone',
        rarity: 'rare',
        points: 45,
        criteria: {
          type: 'subject_diversity',
          value: 3
        },
        createdAt: new Date()
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Completed a quiz in under 2 minutes.',
        icon: '⚡',
        category: 'achievement',
        rarity: 'epic',
        points: 60,
        criteria: {
          type: 'speed_completion',
          value: 120 // seconds
        },
        createdAt: new Date()
      }
    ];

    console.log("🏆 Initializing badges...");
    
    for (const badge of defaultBadges) {
      const existing = await badgesCol.findOne({ id: badge.id });
      
      if (!existing) {
        await badgesCol.insertOne(badge);
        console.log(`✅ Created badge: ${badge.name}`);
      } else {
        console.log(`⏭️  Badge already exists: ${badge.name}`);
      }
    }

    console.log("🎉 Badge initialization completed!");
    
  } catch (err) {
    console.error("❌ Error initializing badges:", err);
  } finally {
    await client.close();
  }
}

// Run the initialization
initializeBadges();
