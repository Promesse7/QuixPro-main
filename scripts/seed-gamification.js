const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";
const client = new MongoClient(uri);

async function seedGamificationData() {
  try {
    console.log("🎮 Seeding Gamification Data...");
    await client.connect();
    const db = client.db("QuixDB");

    // Collections
    const badgesCol = db.collection("badges");
    const unitsCol = db.collection("units");
    const quizzesCol = db.collection("quizzes");

    console.log("🗑️ Clearing existing gamification data...");
    await badgesCol.deleteMany({});

    // ===================================
    // BADGES SYSTEM
    // ===================================
    console.log("🏅 Creating badges...");
    
    const badges = [
      // XP-based badges
      {
        _id: new ObjectId(),
        badgeId: "xp_bronze",
        name: "Bronze Explorer",
        description: "Earn your first 500 XP",
        icon: "🥉",
        tier: "bronze",
        category: "xp",
        unlockCriteria: {
          type: "xp",
          threshold: 500
        },
        xpReward: 50,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "xp_silver",
        name: "Silver Scholar",
        description: "Reach 2000 XP milestone",
        icon: "🥈",
        tier: "silver",
        category: "xp",
        unlockCriteria: {
          type: "xp",
          threshold: 2000
        },
        xpReward: 100,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "xp_gold",
        name: "Gold Master",
        description: "Achieve 5000 XP",
        icon: "🥇",
        tier: "gold",
        category: "xp",
        unlockCriteria: {
          type: "xp",
          threshold: 5000
        },
        xpReward: 250,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "xp_platinum",
        name: "Platinum Legend",
        description: "Legendary 10000 XP achievement",
        icon: "💎",
        tier: "platinum",
        category: "xp",
        unlockCriteria: {
          type: "xp",
          threshold: 10000
        },
        xpReward: 500,
        createdAt: new Date()
      },

      // Quiz completion badges
      {
        _id: new ObjectId(),
        badgeId: "quiz_starter",
        name: "Quiz Starter",
        description: "Complete 10 quizzes",
        icon: "📝",
        tier: "bronze",
        category: "completion",
        unlockCriteria: {
          type: "quizzes_completed",
          threshold: 10
        },
        xpReward: 100,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "quiz_enthusiast",
        name: "Quiz Enthusiast",
        description: "Complete 50 quizzes",
        icon: "📚",
        tier: "silver",
        category: "completion",
        unlockCriteria: {
          type: "quizzes_completed",
          threshold: 50
        },
        xpReward: 200,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "quiz_master",
        name: "Quiz Master",
        description: "Complete 100 quizzes",
        icon: "🎓",
        tier: "gold",
        category: "completion",
        unlockCriteria: {
          type: "quizzes_completed",
          threshold: 100
        },
        xpReward: 500,
        createdAt: new Date()
      },

      // Perfect score badges
      {
        _id: new ObjectId(),
        badgeId: "perfect_first",
        name: "First Perfect",
        description: "Score 100% on your first quiz",
        icon: "⭐",
        tier: "bronze",
        category: "mastery",
        unlockCriteria: {
          type: "perfect_scores",
          threshold: 1
        },
        xpReward: 150,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "perfect_five",
        name: "Perfectionist",
        description: "Score 100% on 5 quizzes",
        icon: "🌟",
        tier: "silver",
        category: "mastery",
        unlockCriteria: {
          type: "perfect_scores",
          threshold: 5
        },
        xpReward: 300,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "perfect_ten",
        name: "Flawless Victory",
        description: "Score 100% on 10 quizzes",
        icon: "✨",
        tier: "gold",
        category: "mastery",
        unlockCriteria: {
          type: "perfect_scores",
          threshold: 10
        },
        xpReward: 600,
        createdAt: new Date()
      },

      // Streak badges
      {
        _id: new ObjectId(),
        badgeId: "streak_3",
        name: "Getting Started",
        description: "Maintain a 3-day learning streak",
        icon: "🔥",
        tier: "bronze",
        category: "streak",
        unlockCriteria: {
          type: "streak",
          threshold: 3
        },
        xpReward: 75,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "streak_7",
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        icon: "🔆",
        tier: "silver",
        category: "streak",
        unlockCriteria: {
          type: "streak",
          threshold: 7
        },
        xpReward: 150,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "streak_30",
        name: "Consistency King",
        description: "Maintain a 30-day learning streak",
        icon: "👑",
        tier: "gold",
        category: "streak",
        unlockCriteria: {
          type: "streak",
          threshold: 30
        },
        xpReward: 500,
        createdAt: new Date()
      },

      // Special badges
      {
        _id: new ObjectId(),
        badgeId: "early_bird",
        name: "Early Bird",
        description: "Complete a quiz before 8 AM",
        icon: "🌅",
        tier: "bronze",
        category: "special",
        unlockCriteria: {
          type: "special",
          threshold: 1
        },
        xpReward: 100,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        badgeId: "night_owl",
        name: "Night Owl",
        description: "Complete a quiz after 10 PM",
        icon: "🦉",
        tier: "bronze",
        category: "special",
        unlockCriteria: {
          type: "special",
          threshold: 1
        },
        xpReward: 100,
        createdAt: new Date()
      }
    ];

    await badgesCol.insertMany(badges);
    console.log(`✅ Created ${badges.length} badges`);

    // ===================================
    // ENHANCED UNITS WITH CONTENT
    // ===================================
    console.log("📚 Enhancing units with learning content...");
    
    const existingUnits = await unitsCol.find({}).toArray();
    
    for (const unit of existingUnits) {
      await unitsCol.updateOne(
        { _id: unit._id },
        {
          $set: {
            content: {
              story: generateStoryContent(unit.name),
              videoUrl: null,
              readingMaterial: generateReadingMaterial(unit.name),
              keyTerms: generateKeyTerms(unit.name)
            },
            learningObjectives: generateLearningObjectives(unit.name),
            estimatedTime: 45,
            difficulty: determineDifficulty(unit.name),
            xpReward: 100,
            unlockConditions: {
              requiredUnits: [],
              minScoreRequired: 0
            },
            resources: []
          }
        }
      );
    }
    console.log(`✅ Enhanced ${existingUnits.length} units with content`);

    // ===================================
    // ENHANCED QUIZZES WITH ADAPTIVE SETTINGS
    // ===================================
    console.log("🎯 Adding adaptive features to quizzes...");
    
    const existingQuizzes = await quizzesCol.find({}).toArray();
    
    for (const quiz of existingQuizzes) {
      const isAdaptive = Math.random() > 0.5; // 50% of quizzes are adaptive
      
      // Add difficulty levels to questions
      const enhancedQuestions = quiz.questions.map((q, idx) => ({
        ...q,
        id: q.id || `q${idx + 1}`,
        difficultyLevel: Math.floor(Math.random() * 5) + 1, // 1-5
        hints: [
          "Think about the basic concept first",
          "Review the key terms from the unit",
          "The answer relates to the main topic"
        ],
        tags: extractTags(q.text),
        timeEstimate: 60
      }));

      await quizzesCol.updateOne(
        { _id: quiz._id },
        {
          $set: {
            questions: enhancedQuestions,
            isAdaptive: isAdaptive,
            adaptiveSettings: isAdaptive ? {
              startDifficulty: 3,
              difficultyAdjustmentRate: 1,
              maxDifficultyJump: 2
            } : null,
            analytics: {
              totalAttempts: 0,
              averageScore: 0,
              averageTimeSpent: 0,
              commonMistakes: []
            }
          }
        }
      );
    }
    console.log(`✅ Enhanced ${existingQuizzes.length} quizzes with adaptive features`);

    // ===================================
    // INITIALIZE USER GAMIFICATION
    // ===================================
    console.log("👥 Initializing user gamification data...");
    
    const usersCol = db.collection("users");
    const users = await usersCol.find({}).toArray();
    
    for (const user of users) {
      if (!user.gamification) {
        await usersCol.updateOne(
          { _id: user._id },
          {
            $set: {
              gamification: {
                totalXP: user.stats?.totalPoints || 0,
                currentLevel: Math.floor((user.stats?.totalPoints || 0) / 1000) + 1,
                streak: user.stats?.streak || 0,
                lastActivityDate: new Date(),
                badges: [],
                achievements: []
              },
              analytics: {
                totalQuizzesTaken: user.stats?.totalQuizzes || 0,
                totalQuizzesPassed: user.stats?.completedQuizzes || 0,
                averageScore: user.stats?.averageScore || 0,
                totalTimeSpent: 0,
                strongSubjects: [],
                weakSubjects: [],
                learningStyle: "visual"
              },
              preferences: {
                dailyGoal: 500,
                notifications: {
                  email: true,
                  streak: true,
                  achievements: true
                },
                theme: "dark",
                language: "en"
              }
            }
          }
        );
      }
    }
    console.log(`✅ Initialized gamification for ${users.length} users`);

    console.log("🎉 Gamification seeding completed successfully!");

  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed");
  }
}

// ===================================
// HELPER FUNCTIONS
// ===================================

function generateStoryContent(unitName) {
  return `Welcome to ${unitName}! Let's embark on an exciting learning journey. 

In this unit, you'll discover fascinating concepts that will help you understand ${unitName} in depth. 

Imagine you're exploring a new world where every piece of knowledge unlocks new possibilities...`;
}

function generateReadingMaterial(unitName) {
  return `# Introduction to ${unitName}

This comprehensive guide will walk you through all the essential concepts you need to master ${unitName}.

## Key Topics Covered:
- Fundamental principles
- Practical applications
- Real-world examples
- Practice exercises

Let's dive in and make learning fun!`;
}

function generateKeyTerms(unitName) {
  return [
    {
      term: "Core Concept",
      definition: `The fundamental principle underlying ${unitName}`,
      example: "Example application in real scenarios"
    },
    {
      term: "Application",
      definition: "How this knowledge is used practically",
      example: "Real-world use case"
    }
  ];
}

function generateLearningObjectives(unitName) {
  return [
    `Understand the fundamental concepts of ${unitName}`,
    `Apply knowledge to solve practical problems`,
    `Analyze real-world scenarios using learned principles`,
    `Demonstrate mastery through quizzes and assessments`
  ];
}

function determineDifficulty(unitName) {
  const lowerName = unitName.toLowerCase();
  if (lowerName.includes("basic") || lowerName.includes("introduction")) return "easy";
  if (lowerName.includes("advanced") || lowerName.includes("complex")) return "hard";
  if (lowerName.includes("expert") || lowerName.includes("mastery")) return "expert";
  return "moderate";
}

function extractTags(questionText) {
  const tags = [];
  const lowerText = questionText.toLowerCase();
  
  if (lowerText.includes("calculate") || lowerText.includes("solve")) tags.push("calculation");
  if (lowerText.includes("explain") || lowerText.includes("describe")) tags.push("conceptual");
  if (lowerText.includes("analyze") || lowerText.includes("compare")) tags.push("analytical");
  if (lowerText.includes("apply") || lowerText.includes("use")) tags.push("application");
  
  return tags.length > 0 ? tags : ["general"];
}

// Run the seeding
seedGamificationData();
