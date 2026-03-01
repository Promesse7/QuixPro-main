"use client"

import { useState, useEffect, useCallback } from "react"
import { useDashboardData } from "./useDashboardData"

interface Badge {
  badgeId: string
  name: string
  description: string
  icon: string
  tier: string
  category: string
  unlockCriteria?: {
    type: string
    threshold: number
    description: string
  }
  xpReward?: number
  isEarned?: boolean
  earnedAt?: string | null
  progress?: number
}

interface UseBadgesOptions {
  autoCheck?: boolean
  userId?: string
}

export function useBadges(options: UseBadgesOptions = {}) {
  const { user, transformedData, refetch } = useDashboardData()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(false)
  const [newlyEarned, setNewlyEarned] = useState<Badge[]>([])

  // Initialize badges from dashboard data
  useEffect(() => {
    if (transformedData?.badges) {
      setBadges(transformedData.badges)
    }
  }, [transformedData?.badges])

  // Check for new badges
  const checkForNewBadges = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await fetch('/api/badges/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.newlyEarned?.length > 0) {
          setNewlyEarned(data.newlyEarned)
          
          // Update badges state
          setBadges(prev => 
            prev.map(badge => 
              data.newlyEarned.some((newBadge: Badge) => newBadge.badgeId === badge.badgeId)
                ? { ...badge, isEarned: true, earnedAt: new Date().toISOString() }
                : badge
            )
          )

          // Trigger celebration
          triggerBadgeCelebration(data.newlyEarned)

          // Clear celebration after delay
          setTimeout(() => setNewlyEarned([]), 5000)

          // Refresh dashboard data
          refetch()
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, refetch])

  // Trigger badge celebration animation
  const triggerBadgeCelebration = (earnedBadges: Badge[]) => {
    // Create celebration elements
    earnedBadges.forEach((badge, index) => {
      setTimeout(() => {
        // Create floating badge animation
        const celebration = document.createElement('div')
        celebration.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none'
        celebration.innerHTML = `
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${badge.icon}</span>
              <span class="font-bold">Badge Earned!</span>
            </div>
          </div>
        `
        document.body.appendChild(celebration)

        // Remove celebration after animation
        setTimeout(() => {
          document.body.removeChild(celebration)
        }, 3000)
      }, index * 200)
    })
  }

  // Auto-check badges on mount and user actions
  useEffect(() => {
    if (options.autoCheck && user?.id && badges.length > 0) {
      // Check badges on mount
      checkForNewBadges()

      // Set up periodic checks (every 5 minutes)
      const interval = setInterval(checkForNewBadges, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [options.autoCheck, user?.id, badges.length, checkForNewBadges])

  // Calculate badge progress
  const calculateBadgeProgress = useCallback((badge: Badge): number => {
    if (badge.isEarned) return 100
    if (!badge.unlockCriteria) return 0

    // Get user stats from dashboard data
    const userStats = transformedData?.progressStats || {
      totalPoints: 0,
      completedQuizzes: 0,
      streak: 0,
      averageScore: 0
    }

    switch (badge.unlockCriteria.type) {
      case "xp":
        return Math.min((userStats.totalPoints / badge.unlockCriteria.threshold) * 100, 100)
      case "quizzes_completed":
        return Math.min((userStats.completedQuizzes / badge.unlockCriteria.threshold) * 100, 100)
      case "streak":
        return Math.min((userStats.streak / badge.unlockCriteria.threshold) * 100, 100)
      case "perfect_scores":
        // This would need additional data from quiz attempts
        return 0
      default:
        return 0
    }
  }, [transformedData?.progressStats])

  // Enrich badges with progress
  const enrichedBadges = badges.map(badge => ({
    ...badge,
    progress: calculateBadgeProgress(badge)
  }))

  // Filter badges
  const earnedBadges = enrichedBadges.filter(badge => badge.isEarned)
  const unearnedBadges = enrichedBadges.filter(badge => !badge.isEarned)
  const earnedCount = earnedBadges.length

  // Get badge statistics
  const getBadgeStats = useCallback(() => {
    const stats = {
      total: badges.length,
      earned: earnedCount,
      available: unearnedBadges.length,
      completionRate: badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0,
      byTier: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    }

    // Calculate tier and category breakdown
    badges.forEach(badge => {
      // Tier breakdown
      stats.byTier[badge.tier] = (stats.byTier[badge.tier] || 0) + 1
      
      // Category breakdown
      stats.byCategory[badge.category] = (stats.byCategory[badge.category] || 0) + 1
    })

    return stats
  }, [badges, earnedCount])

  // Get next available badges
  const getNextBadges = useCallback((count: number = 3) => {
    return unearnedBadges
      .filter(badge => badge.progress && badge.progress > 0)
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, count)
  }, [unearnedBadges])

  return {
    // State
    badges: enrichedBadges,
    earnedBadges,
    unearnedBadges,
    newlyEarned,
    loading,
    
    // Computed
    earnedCount,
    stats: getBadgeStats(),
    nextBadges: getNextBadges(),
    
    // Actions
    checkForNewBadges,
    triggerBadgeCelebration,
    calculateBadgeProgress,
    
    // Utilities
    refresh: () => {
      if (transformedData?.badges) {
        setBadges(transformedData.badges)
      }
    }
  }
}

export type { Badge }
