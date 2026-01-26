#!/usr/bin/env node

// Test script to verify quiz completion flow
// This simulates a user completing a quiz to test the recording system
// Run with: node scripts/test-quiz-flow.js

const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function testQuizFlow() {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()
    const db = client.db("QuixDB")

    // Get a sample quiz
    const quizzesCol = db.collection("quizzes")
    const sampleQuiz = await quizzesCol.findOne()
    
    if (!sampleQuiz) {
      console.log("❌ No quizzes found in database")
      return
    }

    console.log(`📝 Found quiz: ${sampleQuiz.title}`)
    console.log(`📊 Quiz has ${sampleQuiz.questions?.length || 0} questions`)

    // Get a test user
    const usersCol = db.collection("users")
    const testUser = await usersCol.findOne({ role: "student" })
    
    if (!testUser) {
      console.log("❌ No student users found")
      return
    }

    console.log(`👤 Using test user: ${testUser.name}`)

    // Simulate quiz completion
    const attemptsCol = db.collection("quiz_attempts")
    
    // Check if user already completed this quiz
    const existingAttempt = await attemptsCol.findOne({
      userId: testUser._id.toString(),
      quizId: sampleQuiz._id.toString(),
      status: "completed"
    })

    if (existingAttempt) {
      console.log("⚠️  User already completed this quiz")
      console.log(`   Previous score: ${existingAttempt.percentage}%`)
      console.log("   Deleting previous attempt to test new flow...")
      
      await attemptsCol.deleteOne({ _id: existingAttempt._id })
    }

    // Calculate sample answers (answer first question correctly, others incorrectly)
    const sampleAnswers = {}
    let correctCount = 0
    
    sampleQuiz.questions?.forEach((question, index) => {
      const questionId = question._id?.toString() || `q${index}`
      // Answer first question correctly, rest incorrectly
      const answerIndex = index === 0 ? question.correctAnswer : (question.correctAnswer + 1) % question.options.length
      sampleAnswers[questionId] = [answerIndex.toString()]
      
      if (answerIndex === question.correctAnswer) {
        correctCount++
      }
    })

    const percentage = Math.round((correctCount / (sampleQuiz.questions?.length || 1)) * 100)
    const score = {
      correct: correctCount,
      total: sampleQuiz.questions?.length || 1,
      percentage
    }

    console.log(`🎯 Simulating quiz completion...`)
    console.log(`   Correct answers: ${correctCount}/${sampleQuiz.questions?.length || 0}`)
    console.log(`   Score: ${percentage}%`)

    // Create quiz attempt
    const attempt = {
      _id: new ObjectId(),
      userId: testUser._id.toString(),
      quizId: sampleQuiz._id.toString(),
      answers: sampleAnswers,
      timeElapsed: 300, // 5 minutes
      score,
      percentage,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await attemptsCol.insertOne(attempt)
    console.log("✅ Quiz attempt recorded successfully")

    // Update user stats (simulate the API logic)
    const newPoints = Math.round(percentage / 10) // 10 points per 10%
    
    await usersCol.updateOne(
      { _id: testUser._id },
      {
        $inc: {
          "stats.completedQuizzes": 1,
          "stats.totalPoints": newPoints,
        },
        $set: {
          "stats.averageScore": percentage, // For this test, set to current score
          updatedAt: new Date(),
        }
      }
    )

    console.log(`✅ User stats updated`)
    console.log(`   Points added: ${newPoints}`)
    console.log(`   Total completed: ${(testUser.stats?.completedQuizzes || 0) + 1}`)

    // Generate certificate if score >= 70%
    if (percentage >= 70) {
      const certificatesCol = db.collection("certificates")
      
      const certificate = {
        _id: new ObjectId(),
        userId: testUser._id.toString(),
        quizId: sampleQuiz._id.toString(),
        title: `${sampleQuiz.title} - Completion Certificate`,
        course: sampleQuiz.subject,
        level: sampleQuiz.level,
        score: percentage,
        type: "quiz",
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await certificatesCol.insertOne(certificate)
      console.log("🏆 Certificate generated (score >= 70%)")
    }

    console.log("\n🎉 Quiz flow test completed successfully!")
    console.log("📊 Check the leaderboard to see updated rankings")

  } catch (error) {
    console.error("❌ Test failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

testQuizFlow()
