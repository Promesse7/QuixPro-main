// test-db.js
// Script to test MongoDB connection and data retrieval

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/QuixDB";

async function testDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    const db = client.db();
    
    // Test quizzes collection
    const quizzesCount = await db.collection('quizzes').countDocuments();
    console.log(`Found ${quizzesCount} quizzes in the database`);
    
    // Test users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Found ${usersCount} users in the database`);
    
    // Test stories collection
    const storiesCount = await db.collection('stories').countDocuments();
    console.log(`Found ${storiesCount} stories in the database`);
    
    console.log('✅ Database test completed successfully');
  } catch (err) {
    console.error('❌ Error testing database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

testDatabase().catch(console.error);














=================================


/**
 * MongoDB Quiz Seeder for Quix Platform - Physics S1 Units
 * Run with: node seed-questions.js
 */

import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

async function seedQuestions() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("QuixDB");
    const quizzesCol = db.collection("quizzes");

    // ====== CHANGEABLE PART: Define quizzes for each unit ======
    // Update courseId/unitId with actual ObjectIds from DB
    const quizzesData = [
      {
        id: "quiz-physics-s1-unit1",
        title: "Physics S1 - Unit 1: Laboratory safety rules and measurements of physical quantities",
        subject: "Physics",
        level: "S1",
        description: "Test your understanding of lab safety and physical measurements",
        courseId: new ObjectId("REPLACE_WITH_PHYSICS_S1_COURSE_ID"), // e.g., from courses collection
        unitId: new ObjectId("REPLACE_WITH_UNIT1_ID"),
        duration: 20,
        difficulty: "medium",
        isAdaptive: false,
        questionTemplates: [
        
        ]
      },
      {
        id: "quiz-physics-s1-unit2",
        title: "Physics S1 - Unit 2: Qualitative analysis of linear motion",
        subject: "Physics",
        level: "S1",
        description: "Test your understanding of linear motion concepts",
        courseId: new ObjectId("REPLACE_WITH_PHYSICS_S1_COURSE_ID"),
        unitId: new ObjectId("REPLACE_WITH_UNIT2_ID"),
        duration: 20,
        difficulty: "medium",
        isAdaptive: false,
        questionTemplates: [
          
        ]
      },
      {
        id: "quiz-physics-s1-unit3",
        title: "Physics S1 - Unit 3: Force (I)",
        subject: "Physics",
        level: "S1",
        description: "Test your understanding of force concepts",
        courseId: new ObjectId("REPLACE_WITH_PHYSICS_S1_COURSE_ID"),
        unitId: new ObjectId("REPLACE_WITH_UNIT3_ID"),
        duration: 20,
        difficulty: "medium",
        isAdaptive: false,
        questionTemplates: [
           ]
      }
    ];
    // ===================================================

    // Difficulty mapping
    const difficultyMap = { easy: 1, moderate: 3, application: 4 };

    for (const data of quizzesData) {
      // Build questions from templates
      const questions = [];
      data.questionTemplates.forEach((template, index) => {
        const optLetters = ['a', 'b', 'c', 'd'];
        const opts = template.options.map((text, i) => ({
          id: optLetters[i],
          text,
          correct: text === template.correctAnswer
        }));
        questions.push({
          id: `q${index + 1}`,
          text: template.question,
          options: opts,
          explanation: template.explanation,
          marks: 1,
          difficultyLevel: difficultyMap[template.difficulty] || 2,
          hints: ["Think about the basic concept first", "Review the key terms from the unit"],
          tags: ["physics-s1", data.id.split('-')[3]], // e.g., unit1
          timeEstimate: 60
        });
      });

      const quizDoc = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        level: data.level,
        description: data.description,
        courseId: data.courseId,
        unitId: data.unitId,
        questions,
        duration: data.duration,
        difficulty: data.difficulty,
        createdAt: new Date(),
        updatedAt: new Date(),
        adaptiveSettings: null,
        analytics: {
          totalAttempts: 0,
          averageScore: 0,
          averageTimeSpent: 0,
          commonMistakes: []
        },
        isAdaptive: data.isAdaptive
      };

      // Clear existing quiz with this ID
      await quizzesCol.deleteOne({ id: data.id });

      // Insert the quiz
      await quizzesCol.insertOne(quizDoc);
      console.log(`✅ Inserted quiz: ${data.title} with ${questions.length} questions.`);
    }

    console.log(`✅ Seeded ${quizzesData.length} quizzes for Physics S1.`);
  } catch (err) {
    console.error("❌ Error seeding quizzes:", err);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed.");
  }
}

seedQuestions();