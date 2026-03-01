"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ModernDashboardHeader } from "./ModernDashboardHeader"
import { ModernSidebar } from "./ModernSidebar"
import { ModernStatsGrid } from "./ModernStatsGrid"
import { ModernBadges } from "./ModernBadges"
import { ModernActivityFeed } from "./ModernActivityFeed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Target,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Star,
  Zap,
  ArrowRight,
  Play,
  Award,
  Flame,
  Sparkles,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernDashboardLayoutProps {
  dashboardData?: any
  user?: {
    id?: string
    name: string
    email: string
    level: string
    avatar: string
    points?: number
    streak?: number
  }
}

export function ModernDashboardLayout({
  dashboardData,
  user = { name: "User", email: "user@example.com", level: "Beginner", avatar: "", points: 0, streak: 0 }
}: ModernDashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const stats = dashboardData?.progressStats || {
    totalQuizzes: 12,
    completedQuizzes: 8,
    averageScore: 85,
    totalPoints: 2450,
    certificates: 3,
    streak: 7
  }

  const recentQuizzes = [
    { id: 1, title: "Advanced Mathematics", score: 92, time: "25 min", difficulty: "Hard" },
    { id: 2, title: "Physics Fundamentals", score: 88, time: "20 min", difficulty: "Medium" },
    { id: 3, title: "Chemistry Basics", score: 95, time: "15 min", difficulty: "Easy" }
  ]

  const achievements = [
    { id: 1, title: "Quick Learner", description: "Complete 5 quizzes", progress: 80, icon: <Zap className="w-4 h-4" /> },
    { id: 2, title: "Quiz Master", description: "Score 90%+ on 10 quizzes", progress: 60, icon: <Trophy className="w-4 h-4" /> },
    { id: 3, title: "Consistent Student", description: "7-day streak", progress: 100, icon: <Flame className="w-4 h-4" /> }
  ]

  const upcomingEvents = [
    { id: 1, title: "Math Study Group", time: "Today, 3:00 PM", type: "group" },
    { id: 2, title: "Physics Quiz Deadline", time: "Tomorrow, 11:59 PM", type: "deadline" },
    { id: 3, title: "Live Tutorial: Calculus", time: "Friday, 2:00 PM", type: "tutorial" }
  ]

  const QuickActionCard = ({
    title,
    description,
    icon,
    color,
    href,
    delay = 0
  }: {
    title: string
    description: string
    icon: React.ReactNode
    color: string
    href: string
    delay?: number
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className={cn(
        "group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 cursor-pointer",
        color
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50",
              color.replace('border-', 'text-').replace('/50', '')
            )}>
              {icon}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ModernDashboardHeader
        user={user}
        onMobileMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex">
        {/* Sidebar */}
        <ModernSidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          onCollapse={setIsSidebarCollapsed}
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-72"
        )}>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-6 space-y-8">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-2xl border border-border/50 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        Welcome back!
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      Ready to continue your learning journey? You're on a {user.streak || 0}-day streak!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button size="lg" className="gap-2">
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <ModernStatsGrid stats={stats} />

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <QuickActionCard
                        title="Take a Quiz"
                        description="Test your knowledge and earn points"
                        icon={<Target className="w-5 h-5 text-blue-500" />}
                        color="border-blue-200/50"
                        href="/quiz-selection"
                        delay={0.1}
                      />
                      <QuickActionCard
                        title="Browse Courses"
                        description="Explore new learning opportunities"
                        icon={<BookOpen className="w-5 h-5 text-green-500" />}
                        color="border-green-200/50"
                        href="/explore"
                        delay={0.2}
                      />
                      <QuickActionCard
                        title="Join Study Groups"
                        description="Connect with other learners"
                        icon={<Users className="w-5 h-5 text-purple-500" />}
                        color="border-purple-200/50"
                        href="/groups"
                        delay={0.3}
                      />
                      <QuickActionCard
                        title="View Progress"
                        description="Track your learning journey"
                        icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                        color="border-orange-200/50"
                        href="/leaderboard"
                        delay={0.4}
                      />
                    </div>
                  </div>

                  {/* Recent Quizzes */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Recent Quizzes</h2>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {recentQuizzes.map((quiz, index) => (
                            <motion.div
                              key={quiz.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Target className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{quiz.time}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {quiz.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{quiz.score}%</p>
                                <p className="text-xs text-muted-foreground">Score</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Achievements Progress */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Achievements</h2>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {achievements.map((achievement, index) => (
                            <motion.div
                              key={achievement.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  {achievement.icon}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-sm text-foreground">{achievement.title}</h3>
                                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{achievement.progress}%</span>
                                </div>
                                <Progress
                                  value={achievement.progress}
                                  className="h-2 bg-muted/50"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upcoming Events */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Upcoming</h2>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          {upcomingEvents.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                event.type === 'group' ? "bg-purple-100 text-purple-600" :
                                  event.type === 'deadline' ? "bg-red-100 text-red-600" :
                                    "bg-blue-100 text-blue-600"
                              )}>
                                {event.type === 'group' ? <Users className="w-4 h-4" /> :
                                  event.type === 'deadline' ? <Clock className="w-4 h-4" /> :
                                    <Calendar className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm text-foreground">{event.title}</h3>
                                <p className="text-xs text-muted-foreground">{event.time}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Badges Section */}
              <ModernBadges
                userId={user?.id}
                compact={true}
              />

              {/* Activity Feed */}
              <ModernActivityFeed activities={dashboardData?.activities} user={user} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}
