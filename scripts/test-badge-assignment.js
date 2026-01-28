#!/usr/bin/env node

// Test badge assignment by simulating quiz completion
const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function testBadgeAssignment() {
  try {
    await client.connect()
    const db = client.db("QuixDB")
    
    console.log("🧪 Testing badge assignment system...")
    
    // Get a user and quiz
    const user = await db.collection("users").findOne({ name: "Aline Uwimana" })
    const quiz = await db.collection("quizzes").findOne()
    
    if (!user || !quiz) {
      console.log("❌ User or quiz not found")
      return
    }
    
    console.log(`👤 Testing with user: ${user.name}`)
    console.log(`📝 Using quiz: ${quiz.title}`)
    
    // Create a quiz attempt to trigger badge checking
    const attemptsCol = db.collection("quiz_attempts")
    
    // Create a perfect score attempt
    const correctAnswers = {}
    quiz.questions.forEach((question, index) => {
      const questionId = question._id.toString()
      correctAnswers[questionId] = [question.correctAnswer.toString()]
    })
    
    const attempt = {
      _id: new ObjectId(),
      userId: user._id.toString(),
      quizId: quiz._id.toString(),
      answers: correctAnswers,
      timeElapsed: 120,
      score: { correct: quiz.questions.length, total: quiz.questions.length, percentage: 100 },
      percentage: 100,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    await attemptsCol.insertOne(attempt)
    console.log("✅ Perfect score quiz attempt created")
    
    // Update user stats
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $inc: {
          "stats.completedQuizzes": 1,
          "stats.totalPoints": 10,
        },
        $set: {
          "stats.averageScore": 100,
          updatedAt: new Date(),
        }
      }
    )
    console.log("✅ User stats updated")
    
    // Manually trigger badge checking (simulate the API logic)
    const badgesCol = db.collection("badges")
    const allBadges = await badgesCol.find({}).toArray()
    const earnedBadgeIds = (user.gamification && user.gamification.badges) ? user.gamification.badges.map(b => b.badgeId) : []
    const newlyEarned = []
    
    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.badgeId)) continue
      
      let isEligible = false
      const criteria = badge.unlockCriteria
      if (!criteria) continue
      
      switch (criteria.type) {
        case "xp":
          isEligible = 10 >= criteria.threshold
          break
        case "quizzes_completed":
          isEligible = 1 >= criteria.threshold
          break
        case "perfect_scores":
          isEligible = 1 >= criteria.threshold
          break
        case "streak":
          isEligible = 0 >= criteria.threshold
          break
        case "account_created":
          isEligible = true
          break
      }
      
      if (isEligible) {
        newlyEarned.push({
          badgeId: badge.badgeId,
          name: badge.name,
          earnedAt: new Date(),
          tier: badge.tier,
        })
        console.log(`🏆 Eligible for badge: ${badge.name}`)
      }
    }
    
    if (newlyEarned.length > 0) {
      // Update user with new badges
      const currentUser = await db.collection("users").findOne({ _id: user._id })
      const gamification = currentUser.gamification || { badges: [], totalXP: 0 }
      
      gamification.badges.push(...newlyEarned)
      gamification.totalXP += newlyEarned.reduce((sum, badge) => sum + (badge.xpReward || 0), 0)
      
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { gamification: gamification } }
      )
      
      console.log(`✅ Awarded ${newlyEarned.length} badges to ${user.name}:`)
      newlyEarned.forEach(badge => {
        console.log(`   - ${badge.name} (${badge.tier})`)
      })
    } else {
      console.log("ℹ️  No new badges earned")
    }
    
    // Verify the badge assignment
    const updatedUser = await db.collection("users").findOne({ _id: user._id })
    console.log(`\n📊 Final badge count: ${updatedUser.gamification?.badges?.length || 0}`)
    
  } catch (error) {
    console.error("❌ Test failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

testBadgeAssignment()
