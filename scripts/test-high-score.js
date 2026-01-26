#!/usr/bin/env node

// Test script to create a high-scoring quiz attempt
const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function testHighScore() {
  try {
    await client.connect()
    const db = client.db("QuixDB")
    
    // Get quiz and user
    const quiz = await db.collection("quizzes").findOne()
    const user = await db.collection("users").findOne({ name: "Jean Baptiste Nkurunziza" })
    
    if (!quiz || !user) {
      console.log("Quiz or user not found")
      return
    }
    
    // Create high-scoring attempt
    const correctAnswers = {}
    let correctCount = 0
    
    quiz.questions.forEach((question, index) => {
      const questionId = question._id.toString()
      correctAnswers[questionId] = [question.correctAnswer.toString()]
      correctCount++
    })
    
    const percentage = Math.round((correctCount / quiz.questions.length) * 100)
    
    const attempt = {
      _id: new ObjectId(),
      userId: user._id.toString(),
      quizId: quiz._id.toString(),
      answers: correctAnswers,
      timeElapsed: 180,
      score: { correct: correctCount, total: quiz.questions.length, percentage },
      percentage,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    await db.collection("quiz_attempts").insertOne(attempt)
    
    // Update user stats
    const newPoints = Math.round(percentage / 10)
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $inc: {
          "stats.completedQuizzes": 1,
          "stats.totalPoints": newPoints,
        },
        $set: {
          "stats.averageScore": percentage,
          updatedAt: new Date(),
        }
      }
    )
    
    // Generate certificate
    if (percentage >= 70) {
      await db.collection("certificates").insertOne({
        _id: new ObjectId(),
        userId: user._id.toString(),
        quizId: quiz._id.toString(),
        title: `${quiz.title} - Completion Certificate`,
        course: quiz.subject,
        level: quiz.level,
        score: percentage,
        type: "quiz",
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("🏆 Certificate generated!")
    }
    
    console.log(`✅ High-scoring test completed: ${user.name} - ${percentage}%`)
    console.log(`📊 Points added: ${newPoints}`)
    
    client.close()
  } catch (error) {
    console.error("Test failed:", error)
  }
}

testHighScore()
