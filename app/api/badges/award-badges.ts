import { ObjectId } from "mongodb"

// Helper function to check and award badges for a user
export async function checkAndAwardBadges(db: any, userId: string) {
  try {
    const usersCol = db.collection("users")
    const badgesCol = db.collection("badges")
    
    const user = await usersCol.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      console.log(`User ${userId} not found for badge checking`)
      return
    }

    const allBadges = await badgesCol.find({}).toArray()
    const earnedBadgeIds = user.gamification?.badges?.map((b: any) => b.badgeId) || []
    const newlyEarned: any[] = []
    let totalXPAdded = 0

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.badgeId)) continue

      let isEligible = false
      const criteria = badge.unlockCriteria
      if (!criteria) continue

      switch (criteria.type) {
        case "xp":
          isEligible = (user.stats?.totalPoints || 0) >= criteria.threshold
          break
        case "quizzes_completed":
          isEligible = (user.stats?.completedQuizzes || 0) >= criteria.threshold
          break
        case "perfect_scores": {
          const attemptsCol = db.collection("quiz_attempts")
          const perfectScores = await attemptsCol.countDocuments({ 
            userId: user._id.toString(), 
            percentage: 100,
            status: "completed"
          })
          isEligible = perfectScores >= criteria.threshold
          break
        }
        case "streak":
          isEligible = (user.stats?.streak || 0) >= criteria.threshold
          break
        case "account_created":
          isEligible = true
          break
        case "friends_added":
          isEligible = (user.social?.friends?.length || 0) >= criteria.threshold
          break
        case "groups_joined":
          isEligible = (user.social?.groups?.length || 0) >= criteria.threshold
          break
        case "courses_completed":
          isEligible = (user.progress?.completedCourses?.length || 0) >= criteria.threshold
          break
      }

      if (isEligible) {
        const newBadge = {
          badgeId: badge.badgeId,
          name: badge.name,
          earnedAt: new Date(),
          tier: badge.tier,
        }
        newlyEarned.push(newBadge)
        totalXPAdded += badge.xpReward || 0
      }
    }

    if (newlyEarned.length > 0) {
      // Get current user data
      const currentUser = await usersCol.findOne({ _id: user._id })
      
      // Initialize gamification if it doesn't exist
      const gamification = currentUser.gamification || { badges: [], totalXP: 0 }
      
      // Add new badges to the array
      gamification.badges.push(...newlyEarned)
      gamification.totalXP += totalXPAdded

      // Update the user document
      await usersCol.updateOne(
        { _id: user._id },
        {
          $set: { gamification: gamification }
        }
      )

      console.log(`🏆 User ${userId} earned new badges: ${newlyEarned.map((b: any) => b.name).join(", ")}`)
    }

    return { success: true, newlyEarned }
  } catch (error) {
    console.error("Badge check error:", error)
    return { success: false, error: "Internal server error" }
  }
}
