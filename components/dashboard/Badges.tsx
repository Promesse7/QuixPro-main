"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Award, Lock } from "lucide-react"
import Link from "next/link"

interface BadgesProps {
  badges: any[]
  earnedCount: number
}

export function Badges({ badges, earnedCount }: BadgesProps) {
  const displayBadges = badges.slice(0, 6) // Show first 6 badges
  
  return (
    <Card className="border-border/50 hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Recent Badges
        </CardTitle>
        <Link 
          href="/profile/badges" 
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No badges earned yet</p>
            <p className="text-xs text-muted-foreground mt-1">Complete quizzes to earn badges!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{earnedCount}/{badges.length} earned</span>
            </div>
            
            {/* Badge Grid */}
            <div className="grid grid-cols-3 gap-3">
              {displayBadges.map((badge, index) => (
                <div
                  key={badge.badgeId || index}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all
                    ${badge.isEarned 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/50' 
                      : 'bg-muted/30 border border-dashed border-muted-50'
                    }
                  `}
                  title={badge.name}
                >
                  {badge.isEarned ? (
                    <>
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      <BadgeUI variant="secondary" className="text-xs px-1 py-0">
                        {badge.tier}
                      </BadgeUI>
                    </>
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Recent Earned */}
            {earnedCount > 0 && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Recently earned:</p>
                <div className="space-y-1">
                  {badges
                    .filter(b => b.isEarned)
                    .slice(0, 2)
                    .map((badge, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <span>{badge.icon}</span>
                        <span className="text-muted-foreground">{badge.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
