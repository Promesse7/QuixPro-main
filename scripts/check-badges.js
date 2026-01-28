#!/usr/bin/env node

// Check badges in database and user badge assignments
const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function checkBadges() {
  try {
    await client.connect()
    const db = client.db("QuixDB")
    
    console.log("📊 Checking badges system...")
    
    // Check badges in database
    const badges = await db.collection("badges").find({}).toArray()
    console.log(`\n🏆 Found ${badges.length} badges in database:`)
    
    badges.forEach(badge => {
      console.log(`- ${badge.name} (${badge.badgeId})`)
      console.log(`  Category: ${badge.category}`)
      console.log(`  Tier: ${badge.tier}`)
      console.log(`  Criteria: ${JSON.stringify(badge.unlockCriteria)}`)
      console.log(`  XP Reward: ${badge.xpReward}`)
      console.log("")
    })
    
    // Check user badge assignments
    const users = await db.collection("users").find({}).toArray()
    console.log(`\n👥 Checking ${users.length} users for badges:`)
    
    let usersWithBadges = 0
    let totalBadgesEarned = 0
    
    users.forEach(user => {
      const userBadges = user.gamification?.badges || []
      if (userBadges.length > 0) {
        usersWithBadges++
        totalBadgesEarned += userBadges.length
        console.log(`✅ ${user.name}: ${userBadges.length} badges`)
        userBadges.forEach(badge => {
          console.log(`   - ${badge.name} earned at ${badge.earnedAt}`)
        })
      } else {
        console.log(`❌ ${user.name}: No badges`)
      }
    })
    
    console.log(`\n📈 Summary:`)
    console.log(`- Users with badges: ${usersWithBadges}/${users.length}`)
    console.log(`- Total badges earned: ${totalBadgesEarned}`)
    console.log(`- Badge completion rate: ${Math.round((totalBadgesEarned / (badges.length * users.length)) * 100)}%`)
    
    // Check if badges should be awarded based on current stats
    console.log(`\n🔍 Checking for missed badge assignments...`)
    
    for (const user of users) {
      if (user.role !== "student") continue
      
      const eligibleBadges = []
      const earnedBadgeIds = user.gamification?.badges?.map(b => b.badgeId) || []
      
      for (const badge of badges) {
        if (earnedBadgeIds.includes(badge.badgeId)) continue
        
        let isEligible = false
        const criteria = badge.unlockCriteria
        
        if (!criteria) continue
        
        switch (criteria.type) {
          case "xp":
            isEligible = (user.gamification?.totalXP || 0) >= criteria.threshold
            break
          case "quizzes_completed":
            isEligible = (user.stats?.completedQuizzes || 0) >= criteria.threshold
            break
          case "perfect_scores":
            // Check quiz attempts for perfect scores
            const attemptsCol = db.collection("quiz_attempts")
            const perfectScores = await attemptsCol.countDocuments({ 
              userId: user._id.toString(), 
              percentage: 100 
            })
            isEligible = perfectScores >= criteria.threshold
            break
          case "streak":
            isEligible = (user.stats?.streak || 0) >= criteria.threshold
            break
          case "account_created":
            isEligible = true
            break
        }
        
        if (isEligible) {
          eligibleBadges.push(badge.name)
        }
      }
      
      if (eligibleBadges.length > 0) {
        console.log(`⚠️  ${user.name} should have earned: ${eligibleBadges.join(", ")}`)
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking badges:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

checkBadges()
