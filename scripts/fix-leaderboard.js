#!/usr/bin/env node

// Script to test and fix leaderboard functionality
// Run with: node scripts/fix-leaderboard.js

const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function testLeaderboard() {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()
    const db = client.db("QuixDB")

    // Check collections
    const collections = await db.listCollections().toArray()
    console.log("📊 Available collections:", collections.map(c => c.name))

    // Check quiz attempts
    const attemptsCol = db.collection("quiz_attempts")
    const attemptsCount = await attemptsCol.countDocuments()
    console.log(`📝 Quiz attempts found: ${attemptsCount}`)

    // Check users with stats
    const usersCol = db.collection("users")
    const usersWithStats = await usersCol.find({
      "stats.totalPoints": { $exists: true, $gt: 0 }
    }).toArray()
    
    console.log(`👥 Users with quiz stats: ${usersWithStats.length}`)
    
    if (usersWithStats.length > 0) {
      console.log("\n🏆 Top 5 Users:")
      usersWithStats
        .sort((a, b) => (b.stats?.totalPoints || 0) - (a.stats?.totalPoints || 0))
        .slice(0, 5)
        .forEach((user, index) => {
          console.log(`${index + 1}. ${user.name}`)
          console.log(`   Points: ${user.stats?.totalPoints || 0}`)
          console.log(`   Completed: ${user.stats?.completedQuizzes || 0}`)
          console.log(`   Average: ${user.stats?.averageScore || 0}%`)
          console.log(`   Certificates: ${user.stats?.certificates || 0}`)
          console.log("")
        })
    }

    // Test leaderboard query
    console.log("🧪 Testing leaderboard query...")
    const leaderboardQuery = await usersCol
      .find({ role: "student" })
      .sort({ "stats.totalPoints": -1 })
      .limit(10)
      .toArray()

    console.log(`📈 Leaderboard query returned ${leaderboardQuery.length} students`)

    // Check for data inconsistencies
    console.log("\n🔍 Checking data consistency...")
    let issuesFound = 0

    for (const user of leaderboardQuery) {
      if (!user.stats) {
        console.log(`⚠️  User ${user.name} has no stats object`)
        issuesFound++
        continue
      }

      // Verify stats match attempts
      const userAttempts = await attemptsCol.find({ 
        userId: user._id.toString(),
        status: "completed" 
      }).toArray()

      if (userAttempts.length !== user.stats.completedQuizzes) {
        console.log(`⚠️  ${user.name}: Stats show ${user.stats.completedQuizzes} completed, but ${userAttempts.length} attempts found`)
        issuesFound++
      }

      // Calculate actual average
      if (userAttempts.length > 0) {
        const actualAvg = Math.round(
          userAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / userAttempts.length
        )
        if (actualAvg !== user.stats.averageScore) {
          console.log(`⚠️  ${user.name}: Stats show ${user.stats.averageScore}% avg, actual is ${actualAvg}%`)
          issuesFound++
        }
      }
    }

    if (issuesFound === 0) {
      console.log("✅ No data inconsistencies found!")
    } else {
      console.log(`❌ Found ${issuesFound} data inconsistencies`)
    }

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

testLeaderboard()
