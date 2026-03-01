"use client"

import { useState, useEffect, useCallback } from "react"
import { getCurrentUser } from "@/lib/auth"
import type { User as AuthUser } from "@/lib/auth"

interface User {
  id?: string
  _id?: string
  name: string
  email: string
  level: string
  avatar: string
  token?: string
  sessionToken?: string
  points?: number
  streak?: number
}

interface ProgressStats {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  totalPoints: number
  certificates: number
  streak: number
}

interface DashboardData {
  progressStats: ProgressStats
  stats?: ProgressStats // Add this for API compatibility
  analytics: any
  activities: any[]
  recommendedQuizzes: any[]
  leaderboard: any[]
  achievements: any[]
  socialSignals: any
  badges: any[]
  earnedBadgesCount: number
  certificates: any[]
}

interface TransformedData {
  progressStats: ProgressStats
  analytics: any
  activities: any[]
  recommendedQuizzes: any[]
  leaderboard: any[]
  achievements: any[]
  socialSignals: any
}

export function useDashboardData() {
  const [user, setUser] = useState<User | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data function
  const getFallbackData = useCallback((): DashboardData => ({
    progressStats: {
      totalQuizzes: 10,
      completedQuizzes: 0,
      averageScore: 0,
      totalPoints: 0,
      certificates: 0,
      streak: 0,
    },
    analytics: {
      weeklyActivity: [],
      subjectDistribution: [],
      difficultyBreakdown: [],
      chatActivity: [],
    },
    recommendedQuizzes: [
      { id: 1, title: "Getting Started Quiz", difficulty: "Easy", time: "10 min", enrolled: 0, completion: 0 },
      { id: 2, title: "Math Basics", difficulty: "Easy", time: "15 min", enrolled: 0, completion: 0 },
      { id: 3, title: "Science Introduction", difficulty: "Medium", time: "20 min", enrolled: 0, completion: 0 },
    ],
    badges: [],
    earnedBadgesCount: 0,
    certificates: [],
    activities: [
      {
        id: 1,
        type: "welcome",
        title: "Welcome to Quix! Start your first quiz to see your progress.",
        time: "Just now",
        icon: "Star",
        color: "#3b82f6",
      },
    ],
    leaderboard: [{ rank: 1, name: "You", score: 0, avatar: "YU", isUser: true }],
    achievements: [],
    socialSignals: {
      unreadMessages: 0,
      groupUpdates: 0,
      newMessages: 0,
    },
  }), [])

  // Transform database data to UI format
  const getTransformedData = useCallback((data: DashboardData | null): TransformedData => {
    if (!data) return getFallbackData()

    const { stats, analytics, activities, recommendedQuizzes, leaderboard, achievements, socialSignals } = data

    return {
      // Progress stats component format
      progressStats: {
        totalQuizzes: stats?.totalQuizzes || data.progressStats?.totalQuizzes || 10,
        completedQuizzes: stats?.completedQuizzes || data.progressStats?.completedQuizzes || 0,
        averageScore: stats?.averageScore || data.progressStats?.averageScore || 0,
        totalPoints: stats?.totalPoints || data.progressStats?.totalPoints || 0,
        certificates: stats?.certificates || data.progressStats?.certificates || 0,
        streak: stats?.streak || data.progressStats?.streak || 0,
      },
      // Analytics component format
      analytics: analytics || {
        weeklyActivity: [],
        subjectDistribution: [],
        difficultyBreakdown: [],
        chatActivity: [],
      },
      // Recommended quizzes component format
      recommendedQuizzes: recommendedQuizzes || [],
      // Activity feed component format
      activities:
        activities?.map((activity: any) => ({
          type: activity.type || "general",
          description: activity.title || activity.description || "Activity",
          time: activity.time || new Date().toISOString(),
          link: activity.link,
        })) || [],
      // Leaderboard component format
      leaderboard: leaderboard || [],
      // Achievements component format
      achievements:
        achievements?.map((achievement: any) => ({
          id: achievement.id || "1",
          title: achievement.title || "Achievement",
          description: achievement.description || "Description",
          type: "certificate" as const,
        })) || [],
      // Social signals component format
      socialSignals: socialSignals || {
        unreadMessages: 0,
        groupUpdates: 0,
        newMessages: 0,
      },
    }
  }, [getFallbackData])

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user first
      const currentUser = getCurrentUser() as AuthUser | null
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          level: currentUser.level || "Beginner",
          avatar: currentUser.avatar || "",
          points: 0,
          streak: 0
        })
      }

      // If no user, use fallback data immediately
      if (!currentUser) {
        console.log("No current user found, using fallback data")
        setDashboardData(getFallbackData())
        setLoading(false)
        return
      }

      // Try to fetch from API
      try {
        const token = (currentUser as any)?.token || (currentUser as any)?.sessionToken
        const response = await fetch("/api/dashboard-data", {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })

        if (!response.ok) {
          if (response.status === 401) {
            console.log("User not authenticated, using fallback data")
            setDashboardData(getFallbackData())
            setLoading(false)
            return
          }
          if (response.status === 404) {
            console.log("Dashboard API not found, using fallback data")
            throw new Error("Dashboard API not available")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        let data = await response.json()

        // Fetch additional data in parallel
        const [leaderboardResponse, badgesResponse, certificatesResponse] = await Promise.allSettled([
          fetch("/api/leaderboard"),
          fetch(`/api/badges?userId=${currentUser.id}`),
          fetch(`/api/certificates?userId=${currentUser.id}`)
        ])

        // Handle leaderboard data
        if (leaderboardResponse.status === 'fulfilled' && leaderboardResponse.value.ok) {
          const leaderboardData = await leaderboardResponse.value.json()
          data.leaderboard = leaderboardData.leaderboard || []
        }

        // Handle badges data
        if (badgesResponse.status === 'fulfilled' && badgesResponse.value.ok) {
          const badgesData = await badgesResponse.value.json()
          data.badges = badgesData.badges || []
          data.earnedBadgesCount = badgesData.badges.filter((b: any) => b.isEarned).length
        }

        // Handle certificates data
        if (certificatesResponse.status === 'fulfilled' && certificatesResponse.value.ok) {
          const certificatesData = await certificatesResponse.value.json()
          data.certificates = certificatesData.certificates || []
          if (data.stats) {
            data.stats.certificates = certificatesData.certificates.length
          }
        }

        setDashboardData(data)
      } catch (apiError) {
        console.error("API call failed, using fallback data:", apiError)
        setDashboardData(getFallbackData())
      }
    } catch (error) {
      console.error("Error in fetchDashboardData:", error)
      setError((error as Error).message)
      setDashboardData(getFallbackData())
    } finally {
      setLoading(false)
    }
  }, [getFallbackData])

  // Initialize data on mount
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Get transformed data for components
  const transformedData = getTransformedData(dashboardData)

  return {
    // State
    user,
    dashboardData,
    transformedData,
    loading,
    error,

    // Actions
    refetch,

    // Computed values
    isAuthenticated: !!user,
    hasData: !!dashboardData,
    stats: transformedData.progressStats,
    activities: transformedData.activities,
    achievements: transformedData.achievements,
  }
}

export type { User, DashboardData, TransformedData, ProgressStats }
