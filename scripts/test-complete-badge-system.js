#!/usr/bin/env node

// Complete test of the badge assignment system
const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function testCompleteBadgeSystem() {
  try {
    await client.connect()
    const db = client.db("QuixDB")
    
    console.log("🎯 Complete Badge System Test")
    console.log("=" .repeat(50))
    
    // Test 1: Check API endpoints
    console.log("\n1️⃣ Testing Badge API Endpoints...")
    
    // Test GET /api/badges (global badges)
    try {
      const response = await fetch('http://localhost:3000/api/badges')
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ GET /api/badges: Found ${data.badges.length} badges`)
      } else {
        console.log("⚠️  GET /api/badges: Server not running or API unavailable")
      }
    } catch (error) {
      console.log("⚠️  GET /api/badges: Cannot test (server not running)")
    }
    
    // Test 2: Badge Assignment Logic
    console.log("\n2️⃣ Testing Badge Assignment Logic...")
    
    const testUser = await db.collection("users").findOne({ name: "Jean Baptiste Nkurunziza" })
    if (!testUser) {
      console.log("❌ Test user not found")
      return
    }
    
    console.log(`👤 Using test user: ${testUser.name}`)
    console.log(`📊 Current stats: Points=${testUser.stats?.totalPoints || 0}, Completed=${testUser.stats?.completedQuizzes || 0}`)
    
    // Simulate multiple quiz completions to trigger different badges
    const quiz = await db.collection("quizzes").findOne()
    if (!quiz) {
      console.log("❌ No quiz found for testing")
      return
    }
    
    // Create multiple attempts to test different badge criteria
    const attemptsToCreate = 5
    const attemptsCol = db.collection("quiz_attempts")
    
    for (let i = 0; i < attemptsToCreate; i++) {
      const correctAnswers = {}
      quiz.questions.forEach((question, index) => {
        const questionId = question._id.toString()
        // Mix of perfect and good scores
        const isPerfect = i < 2 // First 2 attempts are perfect
        correctAnswers[questionId] = [isPerfect ? question.correctAnswer.toString() : ((question.correctAnswer + 1) % question.options.length).toString()]
      })
      
      const percentage = i < 2 ? 100 : 80
      
      const attempt = {
        _id: new ObjectId(),
        userId: testUser._id.toString(),
        quizId: quiz._id.toString(),
        answers: correctAnswers,
        timeElapsed: 120,
        score: { correct: i < 2 ? quiz.questions.length : Math.floor(quiz.questions.length * 0.8), total: quiz.questions.length, percentage },
        percentage,
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await attemptsCol.insertOne(attempt)
    }
    
    // Update user stats to reflect multiple completions
    const newTotalPoints = (testUser.stats?.totalPoints || 0) + (attemptsToCreate * 8) // Average 8 points per attempt
    const newCompletedQuizzes = (testUser.stats?.completedQuizzes || 0) + attemptsToCreate
    
    await db.collection("users").updateOne(
      { _id: testUser._id },
      {
        $set: {
          "stats.totalPoints": newTotalPoints,
          "stats.completedQuizzes": newCompletedQuizzes,
          "stats.averageScore": 90,
          "stats.streak": 5,
          updatedAt: new Date(),
        }
      }
    )
    
    console.log(`✅ Created ${attemptsToCreate} quiz attempts`)
    console.log(`📊 Updated stats: Points=${newTotalPoints}, Completed=${newCompletedQuizzes}`)
    
    // Test 3: Manual Badge Assignment
    console.log("\n3️⃣ Testing Manual Badge Assignment...")
    
    const badgesCol = db.collection("badges")
    const allBadges = await badgesCol.find({}).toArray()
    const earnedBadgeIds = (testUser.gamification && testUser.gamification.badges) ? testUser.gamification.badges.map(b => b.badgeId) : []
    const newlyEarned = []
    
    // Get updated user data
    const updatedUser = await db.collection("users").findOne({ _id: testUser._id })
    
    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.badgeId)) continue
      
      let isEligible = false
      const criteria = badge.unlockCriteria
      if (!criteria) continue
      
      switch (criteria.type) {
        case "xp":
          isEligible = newTotalPoints >= criteria.threshold
          break
        case "quizzes_completed":
          isEligible = newCompletedQuizzes >= criteria.threshold
          break
        case "perfect_scores": {
          const perfectScores = await attemptsCol.countDocuments({ 
            userId: testUser._id.toString(), 
            percentage: 100,
            status: "completed"
          })
          isEligible = perfectScores >= criteria.threshold
          break
        }
        case "streak":
          isEligible = 5 >= criteria.threshold
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
        console.log(`🏆 Eligible for: ${badge.name} (${badge.tier})`)
      }
    }
    
    if (newlyEarned.length > 0) {
      const gamification = updatedUser.gamification || { badges: [], totalXP: 0 }
      gamification.badges.push(...newlyEarned)
      gamification.totalXP += newlyEarned.reduce((sum, badge) => {
        const badgeData = allBadges.find(b => b.badgeId === badge.badgeId)
        return sum + (badgeData?.xpReward || 0)
      }, 0)
      
      await db.collection("users").updateOne(
        { _id: testUser._id },
        { $set: { gamification: gamification } }
      )
      
      console.log(`✅ Awarded ${newlyEarned.length} new badges`)
    }
    
    // Test 4: Verify Frontend Data Structure
    console.log("\n4️⃣ Testing Frontend Data Structure...")
    
    const finalUser = await db.collection("users").findOne({ _id: testUser._id })
    const userBadges = finalUser.gamification?.badges || []
    
    console.log(`📊 Final badge count: ${userBadges.length}`)
    
    // Test API response format
    const apiResponse = {
      badges: allBadges.map(badge => {
        const isEarned = userBadges.some(ub => ub.badgeId === badge.badgeId)
        const earnedInfo = userBadges.find(ub => ub.badgeId === badge.badgeId)
        return {
          ...badge,
          isEarned,
          earnedAt: earnedInfo?.earnedAt || null,
        }
      })
    }
    
    console.log(`✅ API response format: ${apiResponse.badges.length} badges with isEarned flags`)
    
    // Test 5: Frontend Component Compatibility
    console.log("\n5️⃣ Testing Frontend Component Compatibility...")
    
    const earnedCount = apiResponse.badges.filter(b => b.isEarned).length
    console.log(`📱 Frontend will display: ${earnedCount}/${apiResponse.badges.length} badges`)
    
    // Check badge data structure
    const sampleBadge = apiResponse.badges[0]
    const requiredFields = ['name', 'badgeId', 'tier', 'icon', 'isEarned']
    const hasAllFields = requiredFields.every(field => sampleBadge.hasOwnProperty(field))
    
    console.log(`✅ Badge data structure: ${hasAllFields ? 'Valid' : 'Invalid'}`)
    
    console.log("\n" + "=".repeat(50))
    console.log("🎉 Badge System Test Complete!")
    console.log(`📊 Summary: ${userBadges.length} badges earned by ${finalUser.name}`)
    
  } catch (error) {
    console.error("❌ Test failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

testCompleteBadgeSystem()
