'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { getCurrentUser } from '@/lib/auth-client'

interface UserBadge {
  badgeId: string
  name: string
  earnedAt: string
  icon: string
  description: string
  category: string
  rarity: string
  points: number
}

interface UserBadgesProps {
  userId?: string
  maxDisplay?: number
  showAll?: boolean
}

export function UserBadges({ userId, maxDisplay = 6, showAll = false }: UserBadgesProps) {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const currentUserId = userId || getCurrentUser()?.id
        if (!currentUserId) {
          setError('User not found')
          return
        }

        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/api/badges/${currentUserId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch badges')
        }

        const data = await response.json()
        setBadges(data.badges || [])
      } catch (err) {
        console.error('Error fetching badges:', err)
        setError('Failed to load badges')
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [userId])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'epic': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'rare': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      case 'common': 'bg-gray-100 text-gray-800 border-gray-300'
      default: 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': '🏆'
      case 'milestone': '🎯'
      case 'special': '⭐'
      case 'progress': '📈'
      default: '🎖️'
    }
  }

  const displayBadges = showAll ? badges : badges.slice(0, maxDisplay)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: maxDisplay }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (badges.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-4xl mb-2">🎖️</div>
          <p className="text-muted-foreground">No badges earned yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete quizzes and achieve milestones to earn badges!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayBadges.map((badge) => (
          <div
            key={badge.badgeId}
            className="group relative"
          >
            <div className={`
              relative overflow-hidden rounded-lg border-2 p-3 text-center transition-all
              hover:scale-105 hover:shadow-lg cursor-pointer
              ${getRarityColor(badge.rarity)}
            `}>
              {/* Badge Icon */}
              <div className="text-2xl mb-1">{badge.icon}</div>
              
              {/* Badge Name */}
              <div className="text-xs font-medium truncate">{badge.name}</div>
              
              {/* Points */}
              <div className="text-xs opacity-75">+{badge.points} XP</div>
              
              {/* Category Icon */}
              <div className="absolute top-1 right-1 text-xs opacity-50">
                {getCategoryIcon(badge.category)}
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg p-2 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full whitespace-nowrap">
              <div className="font-semibold">{badge.name}</div>
              <div>{badge.description}</div>
              <div className="text-yellow-400 mt-1">Rarity: {badge.rarity}</div>
              <div className="text-green-400">Earned: {new Date(badge.earnedAt).toLocaleDateString()}</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && badges.length > maxDisplay && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {maxDisplay} of {badges.length} badges
          </p>
        </div>
      )}
    </div>
  )
}

export function BadgeGrid({ badges }: { badges: UserBadge[] }) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': 'border-yellow-400 bg-yellow-50'
      case 'epic': 'border-purple-500 bg-purple-50'
      case 'rare': 'border-blue-500 bg-blue-50'
      case 'common': 'border-gray-300 bg-gray-50'
      default: 'border-gray-300 bg-gray-50'
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.badgeId}
          className={`
            relative overflow-hidden rounded-lg border-2 p-4 text-center transition-all
            hover:scale-105 hover:shadow-lg
            ${getRarityColor(badge.rarity)}
          `}
        >
          <div className="text-3xl mb-2">{badge.icon}</div>
          <div className="text-sm font-medium truncate">{badge.name}</div>
          <div className="text-xs text-muted-foreground">+{badge.points} XP</div>
        </div>
      ))}
    </div>
  )
}
