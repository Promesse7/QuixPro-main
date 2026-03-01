"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Flame,
  Users,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatCard {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  icon: React.ReactNode
  description?: string
  color: string
  bgGradient: string
}

interface ModernStatsGridProps {
  stats?: {
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    totalPoints: number
    certificates: number
    streak: number
  }
}

export function ModernStatsGrid({ stats }: ModernStatsGridProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const defaultStats = {
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalPoints: 0,
    certificates: 0,
    streak: 0,
  }

  const currentStats = stats || defaultStats

  const statCards: StatCard[] = [
    {
      title: "Total Quizzes",
      value: currentStats.totalQuizzes,
      change: {
        value: 12,
        trend: 'up'
      },
      icon: <Target className="w-5 h-5" />,
      description: "Available quizzes",
      color: "text-blue-600",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Completed",
      value: currentStats.completedQuizzes,
      change: {
        value: 8,
        trend: 'up'
      },
      icon: <BookOpen className="w-5 h-5" />,
      description: "Quizzes finished",
      color: "text-green-600",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Average Score",
      value: `${currentStats.averageScore}%`,
      change: {
        value: 5,
        trend: 'up'
      },
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Performance metric",
      color: "text-purple-600",
      bgGradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Total Points",
      value: currentStats.totalPoints.toLocaleString(),
      change: {
        value: 250,
        trend: 'up'
      },
      icon: <Star className="w-5 h-5" />,
      description: "Achievement points",
      color: "text-yellow-600",
      bgGradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      title: "Certificates",
      value: currentStats.certificates,
      change: {
        value: 2,
        trend: 'up'
      },
      icon: <Award className="w-5 h-5" />,
      description: "Earned certificates",
      color: "text-indigo-600",
      bgGradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
      title: "Current Streak",
      value: `${currentStats.streak} days`,
      change: {
        value: currentStats.streak > 0 ? 1 : 0,
        trend: currentStats.streak > 0 ? 'up' : 'neutral'
      },
      icon: <Flame className="w-5 h-5" />,
      description: "Daily streak",
      color: "text-red-600",
      bgGradient: "from-red-500/20 to-orange-500/20"
    }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3 text-green-600" />
      case 'down':
        return <ArrowDown className="w-3 h-3 text-red-600" />
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-muted-foreground bg-muted/50 border-border'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onHoverStart={() => setHoveredCard(index)}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card className={cn(
            "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20",
            hoveredCard === index && "scale-[1.02] border-primary/30"
          )}>
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
              card.bgGradient,
              hoveredCard === index && "opacity-100"
            )} />

            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50",
                      card.color
                    )}>
                      {card.icon}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium border",
                        getTrendColor(card.change?.trend || 'neutral')
                      )}
                    >
                      {getTrendIcon(card.change?.trend || 'neutral')}
                      <span className="ml-1">
                        {card.change?.value && card.change.value > 0 && '+'}{card.change?.value || 0}
                      </span>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Decorative Element */}
                <motion.div
                  className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${card.color.replace('text-', '').replace('600', '500')}, transparent)`
                  }}
                  animate={{
                    scale: hoveredCard === index ? 1.2 : 1,
                    rotate: hoveredCard === index ? 45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Progress Bar for visual representation */}
              <div className="mt-4">
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      card.bgGradient
                    )}
                    initial={{ width: 0 }}
                    animate={{
                      width: typeof card.value === 'number'
                        ? `${Math.min((card.value / 100) * 100, 100)}%`
                        : card.value.includes('%')
                          ? card.value
                          : '30%'
                    }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
