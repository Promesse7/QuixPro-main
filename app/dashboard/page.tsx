"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Trophy, Star, Award, Users, FileText, Briefcase, MessageSquare, BookOpen, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getBaseUrl } from "@/lib/getBaseUrl"
import { PageTransition, StaggerContainer, fadeInUp } from "@/components/ui/page-transition"

type DashboardUser = { id: string; name: string; email: string; role: string; level?: string; avatar?: string }

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalPoints: 0,
    certificates: 0,
    streak: 0,
  })
  const [activities, setActivities] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const baseUrl = getBaseUrl ? getBaseUrl() : ""

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.push("/auth")
      return
    }
    if (u.role === "admin") {
      router.push("/admin")
      return
    }
    if (u.role === "teacher") {
      router.push("/teacher")
      return
    }
    setUser(u)
  }, [router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      try {
        const [overviewRes, attemptsRes, certsRes] = await Promise.all([
          fetch(`${baseUrl}/api/user/overview?userId=${encodeURIComponent(user.id)}`),
          fetch(`${baseUrl}/api/quiz-attempts?userId=${encodeURIComponent(user.id)}`),
          fetch(`${baseUrl}/api/certificates?userId=${encodeURIComponent(user.id)}`),
        ])

        const overview = overviewRes.ok ? await overviewRes.json() : {}
        const attemptsJson = attemptsRes.ok ? await attemptsRes.json() : { attempts: [] }
        const certsJson = certsRes.ok ? await certsRes.json() : { certificates: [] }

        const attempts = attemptsJson.attempts || []
        const totalQuizzes = attempts.length
        const completedQuizzes = attempts.length
        const averageScore =
          totalQuizzes > 0
            ? Math.round(attempts.reduce((s: number, a: any) => s + (a.percentage || 0), 0) / totalQuizzes)
            : 0
        const certificates = (certsJson.certificates || []).length

        setStats({
          totalQuizzes,
          completedQuizzes,
          averageScore,
          totalPoints: overview?.xp ?? 0,
          certificates,
          streak: overview?.streak ?? 0,
        })

        setActivities(overview?.activities || [])
        setGoals(overview?.goals || [])
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user, baseUrl])

  if (!user) return null

  return (
    <PageTransition className="min-h-screen bg-background">
      <DashboardHeader
        user={{
          name: user?.name || "Student",
          email: user?.email || "",
          level: user?.level || "-",
          avatar: user?.avatar || "/student-avatar.png",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}
          </h1>
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-shimmer" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <BookOpen className="h-5 w-5" />,
                label: "Quizzes Taken",
                value: stats.totalQuizzes,
                color: "text-blue-600",
                bgColor: "from-blue-500/10 to-blue-500/5",
              },
              {
                icon: <Trophy className="h-5 w-5" />,
                label: "Average Score",
                value: `${stats.averageScore}%`,
                color: "text-green-600",
                bgColor: "from-green-500/10 to-green-500/5",
              },
              {
                icon: <Zap className="h-5 w-5" />,
                label: "Total XP",
                value: stats.totalPoints,
                color: "text-yellow-600",
                bgColor: "from-yellow-500/10 to-yellow-500/5",
              },
              {
                icon: <Target className="h-5 w-5" />,
                label: "Day Streak",
                value: stats.streak,
                color: "text-purple-600",
                bgColor: "from-purple-500/10 to-purple-500/5",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-default hover:shadow-lg"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-4 ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="text-2xl font-bold mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </StaggerContainer>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump back into learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        href: "/quiz",
                        icon: <FileText className="h-5 w-5" />,
                        title: "Take Quiz",
                        desc: "Start a new assessment",
                        gradient: "from-blue-500/10 to-transparent",
                      },
                      {
                        href: "/peer-tutoring",
                        icon: <Users className="h-5 w-5" />,
                        title: "Peer Tutoring",
                        desc: "Connect with tutors",
                        gradient: "from-green-500/10 to-transparent",
                      },
                      {
                        href: "/exam-simulation",
                        icon: <Target className="h-5 w-5" />,
                        title: "Mock Exam",
                        desc: "Practice full exams",
                        gradient: "from-purple-500/10 to-transparent",
                      },
                      {
                        href: "/career-explorer",
                        icon: <Briefcase className="h-5 w-5" />,
                        title: "Career Path",
                        desc: "Explore careers",
                        gradient: "from-orange-500/10 to-transparent",
                      },
                    ].map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                      >
                        <Link href={action.href}>
                          <div
                            className={`group p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-gradient-to-br ${action.gradient}`}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                              >
                                {action.icon}
                              </motion.div>
                              <div>
                                <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                  {action.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{action.desc}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Progress */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Goals
                </CardTitle>
                <CardDescription>Track your learning objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.slice(0, 3).map((goal: any) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
                {goals.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No active goals yet. Start by taking a quiz!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Your ranking in {user.level || "your level"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah M.", score: 2450, avatar: "🥇" },
                    { rank: 2, name: "John D.", score: 2380, avatar: "🥈" },
                    { rank: 3, name: user.name, score: stats.totalPoints, avatar: "🥉", isYou: true },
                  ].map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${player.isYou ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="font-medium text-sm">
                            {player.name}{" "}
                            {player.isYou && (
                              <Badge variant="secondary" className="ml-2">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{player.score} XP</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-muted-foreground">#{player.rank}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity: any, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: "🏆", title: "Quiz Master", desc: "Completed 20+ quizzes" },
                  { icon: "⭐", title: "High Achiever", desc: "85%+ average score" },
                  { icon: "🔥", title: "Streak Champion", desc: "7-day learning streak" },
                ].map((achievement, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Give Feedback CTA */}
            <Card className="border-border bg-primary/5">
              <CardContent className="pt-6">
                <MessageSquare className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Help Improve Content</h3>
                <p className="text-sm text-muted-foreground mb-4">Share your feedback on quizzes and stories</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/feedback">Give Feedback</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
