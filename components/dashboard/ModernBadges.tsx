"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Lock,
  Star,
  Trophy,
  Zap,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  CheckCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBadges } from "@/hooks/useBadges"

interface ModernBadgesProps {
  userId?: string
  compact?: boolean
}

export function ModernBadges({ userId, compact = false }: ModernBadgesProps) {
  const {
    badges,
    earnedBadges,
    unearnedBadges,
    newlyEarned,
    loading,
    earnedCount,
    stats,
    nextBadges,
    checkForNewBadges
  } = useBadges({ userId, autoCheck: true })

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'achievement': return <Trophy className="w-4 h-4" />
      case 'skill': return <Target className="w-4 h-4" />
      case 'streak': return <Flame className="w-4 h-4" />
      case 'social': return <Users className="w-4 h-4" />
      case 'learning': return <BookOpen className="w-4 h-4" />
      case 'milestone': return <Star className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'bronze': return 'from-orange-500/20 to-amber-500/20 border-orange-400/50'
      case 'silver': return 'from-gray-500/20 to-slate-500/20 border-gray-400/50'
      case 'gold': return 'from-yellow-500/20 to-amber-500/20 border-yellow-400/50'
      case 'platinum': return 'from-purple-500/20 to-indigo-500/20 border-purple-400/50'
      case 'diamond': return 'from-cyan-500/20 to-blue-500/20 border-cyan-400/50'
      default: return 'from-blue-500/20 to-indigo-500/20 border-blue-400/50'
    }
  }

  const displayBadges = compact ? earnedBadges.slice(0, 6) : badges.slice(0, 12)

  if (compact) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recent Badges
            <BadgeUI variant="secondary" className="ml-auto">
              {earnedCount}/{badges.length}
            </BadgeUI>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {displayBadges.map((badge) => (
              <div
                key={badge.badgeId}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden",
                  badge.isEarned
                    ? `bg-gradient-to-br ${getTierColor(badge.tier)} border-2 shadow-lg`
                    : 'bg-muted/30 border-2 border-dashed border-muted-50'
                )}
                title={`${badge.name}${badge.earnedAt ? ` (Earned ${new Date(badge.earnedAt).toLocaleDateString()})` : ''}`}
              >
                {badge.isEarned ? (
                  <>
                    <span className="text-2xl mb-1 filter drop-shadow-sm">{badge.icon}</span>
                    <BadgeUI variant="secondary" className="text-xs px-1.5 py-0">
                      {badge.tier}
                    </BadgeUI>
                  </>
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Badges Celebration */}
      {newlyEarned.length > 0 && (
        <Card className="border-yellow-400/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              🎉 New Badge{newlyEarned.length > 1 ? 's' : ''} Earned!
            </h3>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {newlyEarned.map((badge) => (
                <div key={badge.badgeId} className="text-2xl p-2 bg-background rounded-lg">
                  {badge.icon}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              You've unlocked {newlyEarned.length} new achievement{newlyEarned.length > 1 ? 's' : ''}!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Badge Progress
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkForNewBadges}
              disabled={loading || !userId}
              className="gap-1"
            >
              <TrendingUp className="w-4 h-4" />
              {loading ? 'Checking...' : 'Check Progress'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="text-2xl font-bold text-primary mb-1">{earnedCount}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="text-2xl font-bold text-orange-500 mb-1">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="text-2xl font-bold text-green-500 mb-1">{stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Badges to Earn */}
      {nextBadges.length > 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Close to Unlocking
              <BadgeUI variant="secondary" className="ml-auto">
                {nextBadges.length}
              </BadgeUI>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextBadges.map((badge) => (
                <div
                  key={badge.badgeId}
                  className="p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50 border border-dashed border-muted-50">
                      {badge.progress === 100 ? (
                        <span className="text-lg">{badge.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  {badge.unlockCriteria && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {badge.unlockCriteria.description}
                        </span>
                        <span className="font-medium">
                          {Math.round(badge.progress || 0)}/{badge.unlockCriteria.threshold}
                        </span>
                      </div>
                      <Progress
                        value={badge.progress || 0}
                        className="h-2 bg-muted/50"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned Badges */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Earned Badges
              <BadgeUI variant="secondary" className="ml-auto">
                {earnedBadges.length}
              </BadgeUI>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnedBadges.length === 0 ? (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No badges earned yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete quizzes and achieve milestones to earn your first badges!
                </p>
                <Button onClick={checkForNewBadges} disabled={!userId}>
                  <Target className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {earnedBadges.slice(0, 6).map((badge) => (
                  <div
                    key={badge.badgeId}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/50 to-card border border-border/30 hover:shadow-md transition-all"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-xl",
                      `bg-gradient-to-br ${getTierColor(badge.tier)}`
                    )}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <BadgeUI variant="secondary" className="text-xs">
                          {badge.tier}
                        </BadgeUI>
                        {getCategoryIcon(badge.category || 'achievement')}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {earnedBadges.length > 6 && (
                  <Button variant="outline" className="w-full">
                    View All Earned Badges
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Badges */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Available Badges
              <BadgeUI variant="secondary" className="ml-auto">
                {stats.available}
              </BadgeUI>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unearnedBadges.slice(0, 6).map((badge) => (
                <div
                  key={badge.badgeId}
                  className="p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50 border border-dashed border-muted-50">
                      {badge.progress === 100 ? (
                        <span className="text-lg">{badge.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  {badge.unlockCriteria && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {badge.unlockCriteria.description}
                        </span>
                        <span className="font-medium">
                          {Math.round(badge.progress || 0)}/{badge.unlockCriteria.threshold}
                        </span>
                      </div>
                      <Progress
                        value={badge.progress || 0}
                        className="h-2 bg-muted/50"
                      />
                    </div>
                  )}
                </div>
              ))}
              {unearnedBadges.length > 6 && (
                <Button variant="outline" className="w-full">
                  View All Available Badges
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
