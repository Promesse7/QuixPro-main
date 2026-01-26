#!/usr/bin/env node

// Script to sync user stats with actual quiz attempts
// This will fix the data inconsistency by recalculating stats from attempts
// Run with: node scripts/sync-user-stats.js

const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function syncUserStats() {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()
    const db = client.db("QuixDB")

    const usersCol = db.collection("users")
    const attemptsCol = db.collection("quiz_attempts")
    const certificatesCol = db.collection("certificates")

    // Get all students
    const students = await usersCol.find({ role: "student" }).toArray()
    console.log(`👥 Found ${students.length} students`)

    let updatedCount = 0

    for (const student of students) {
      const userId = student._id.toString()
      
      // Get all completed attempts for this user
      const attempts = await attemptsCol.find({ 
        userId: userId,
        status: "completed" 
      }).toArray()

      // Get certificates count
      const certificatesCount = await certificatesCol.countDocuments({ 
        userId: userId 
      })

      // Calculate stats
      const completedQuizzes = attempts.length
      const totalPoints = attempts.reduce((sum, attempt) => sum + Math.round(attempt.percentage / 10), 0)
      const averageScore = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
        : 0

      // Update user stats
      await usersCol.updateOne(
        { _id: student._id },
        {
          $set: {
            "stats.completedQuizzes": completedQuizzes,
            "stats.totalPoints": totalPoints,
            "stats.averageScore": averageScore,
            "stats.certificates": certificatesCount,
            updatedAt: new Date()
          }
        }
      )

      console.log(`✓ Updated ${student.name}:`)
      console.log(`   Completed: ${completedQuizzes} quizzes`)
      console.log(`   Points: ${totalPoints}`)
      console.log(`   Average: ${averageScore}%`)
      console.log(`   Certificates: ${certificatesCount}`)
      console.log("")

      updatedCount++
    }

    console.log(`✅ Successfully synced stats for ${updatedCount} students`)

    // Show updated leaderboard
    console.log("\n🏆 Updated Leaderboard:")
    const leaderboard = await usersCol
      .find({ role: "student" })
      .sort({ "stats.totalPoints": -1 })
      .limit(10)
      .toArray()

    leaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.stats?.totalPoints || 0} pts`)
    })

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

syncUserStats()
