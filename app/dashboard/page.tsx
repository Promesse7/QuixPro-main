"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth"

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Target,
  Zap,
  Play,
  Trophy,
  Star,
  Award,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { QuickStartCTA } from "@/components/app/QuickStartCTA";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProgressStats } from "@/components/dashboard/progress-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecommendedQuizzes } from "@/components/dashboard/recommended-quizzes";
import { Leaderboard } from "@/components/dashboard/leaderboard";

import { CourseProgressCard } from "@/components/progress/CourseProgressCard";
import { PageTransition } from "@/components/ui/page-transition";
import { BadgeShowcase } from "@/components/gamification/BadgeShowcase";
import { XPProgressBar } from "@/components/gamification/XPProgressBar";
import  { getBaseUrl }  from "@/lib/getBaseUrl"; // optional helper for API base URL

type DashboardUser = { id: string; name: string; email: string; role: string; level?: string; avatar?: string }

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [stats, setStats] = useState({ totalQuizzes: 0, completedQuizzes: 0, averageScore: 0, totalPoints: 0, certificates: 0 })
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [earnedCount, setEarnedCount] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])

  const baseUrl = getBaseUrl ? getBaseUrl() : ""

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.push('/auth')
      return
    }
    if (u.role === 'admin') { router.push('/admin'); return }
    if (u.role === 'teacher') { router.push('/teacher'); return }
    setUser(u)
  }, [router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      try {
        // Overview + supporting endpoints
        const [overviewRes, attemptsRes, badgesRes, certsRes] = await Promise.all([
          fetch(`${baseUrl}/api/user/overview?userId=${encodeURIComponent(user.id)}`),
          fetch(`${baseUrl}/api/quiz-attempts?userId=${encodeURIComponent(user.id)}`),
          fetch(`${baseUrl}/api/badges?userId=${encodeURIComponent(user.id)}`),
          fetch(`${baseUrl}/api/certificates?userId=${encodeURIComponent(user.id)}`)
        ])

        const overview = overviewRes.ok ? await overviewRes.json() : {}
        const attemptsJson = attemptsRes.ok ? await attemptsRes.json() : { attempts: [] }
        const badgesJson = badgesRes.ok ? await badgesRes.json() : { badges: [] }
        const certsJson = certsRes.ok ? await certsRes.json() : { certificates: [] }

        // Derive stats
        const attempts = attemptsJson.attempts || []
        const totalQuizzes = attempts.length
        const completedQuizzes = attempts.length
        const averageScore = totalQuizzes > 0 ? Math.round(attempts.reduce((s: number, a: any) => s + (a.percentage || 0), 0) / totalQuizzes) : 0
        const certificates = (certsJson.certificates || []).length

        setStats({
          totalQuizzes,
          completedQuizzes,
          averageScore,
          totalPoints: overview?.xp ?? 0,
          certificates,
          streak: overview?.streak ?? 0
        })

        setActivities(overview?.activities || [])
        setGoals(overview?.goals || [])

        const badges = badgesJson.badges || []
        setUserBadges(badges)
        setEarnedCount(badges.filter((b: any) => b.isEarned).length)

        // Optional: check for new badges based on server logic
        fetch(`${baseUrl}/api/badges/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) }).catch(() => {})
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      } finally {
        setLoadingProgress(false)
      }
    }
    fetchUserData()
  }, [user, baseUrl])

  const handleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) setTimeout(() => setIsVoiceActive(false), 3000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={{ name: user?.name || 'Student', email: user?.email || '', level: user?.level || '-', avatar: user?.avatar || '/student-avatar.png' }} />

      <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-2">
            <AppBreadcrumb items={[{ label: "Home" }, { label: "Dashboard" }]} />
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">
                  Welcome back, {user?.name?.split(" ")[0] || 'Student'}!
                </h1>
                <p className="text-muted-foreground">
                  Ready to continue your learning journey?
                </p>
              </div>
              <Button
                onClick={handleVoiceCommand}
                className={`glow-effect ${isVoiceActive ? "voice-wave" : ""}`}
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                {isVoiceActive ? "Listening..." : "Voice Command"}
              </Button>
            </div>
            <div className="mt-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">View Profile</Link>
              </Button>
            </div>
          </div>

          {/* Quick Start */}
          <QuickStartCTA />

          {/* Quick Actions */}
          <QuickActions />

          {/* Progress + Gamification */}
          {loadingProgress ? (
            <div className="space-y-4">
              <div className="animate-pulse grid md:grid-cols-2 gap-4">
                <div className="h-24 rounded-lg bg-muted/30" />
                <div className="h-24 rounded-lg bg-muted/30" />
              </div>
              <div className="animate-pulse h-20 rounded-lg bg-muted/30" />
              <div className="animate-pulse h-28 rounded-lg bg-muted/30" />
            </div>
          ) : (
            <>
              <ProgressStats stats={stats} />
              <StreakTracker streak={stats.streak} />
              <XPProgressBar currentXP={stats.totalPoints} currentLevel={Math.max(1, Math.floor(stats.totalPoints / 1000))} />
              <BadgeShowcase badges={userBadges} earnedCount={earnedCount} />
            </>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Goals Section */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 glow-text">
                    <Target className="h-5 w-5" />
                    <span>Current Goals</span>
                  </CardTitle>
                  <CardDescription>Track your learning objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.slice(0,5).map((goal:any) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">{goal.current}/{goal.target}</span>
                      </div>
                      <Progress value={goal.progress} className="h-2 glow-effect" />
                    </div>
                  ))}
                  {goals.length === 0 && (
                    <div className="text-sm text-muted-foreground">No active goals yet.</div>
                  )}
                  {goals.length > 5 && (
                    <div className="pt-2"><Link className="text-xs text-primary hover:underline" href="/progress">View all</Link></div>
                  )}
                </CardContent>
              </Card>

              {/* Explore Features */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Explore New Features</CardTitle>
                  <CardDescription>Enhance your learning experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        href: "/peer-tutoring",
                        icon: <Users className="h-8 w-8 mb-2 text-primary" />,
                        title: "Peer Tutoring",
                        desc: "Connect with student tutors",
                      },
                      {
                        href: "/exam-simulation",
                        icon: <FileText className="h-8 w-8 mb-2 text-primary" />,
                        title: "Exam Simulation",
                        desc: "Practice with mock exams",
                      },
                      {
                        href: "/career-explorer",
                        icon: <Briefcase className="h-8 w-8 mb-2 text-primary" />,
                        title: "Career Explorer",
                        desc: "Discover career paths",
                      },
                      {
                        href: "/feedback",
                        icon: <MessageSquare className="h-8 w-8 mb-2 text-primary" />,
                        title: "Give Feedback",
                        desc: "Help improve content",
                      },
                    ].map((feature) => (
                      <Link key={feature.href} href={feature.href}>
                        <div className="feature-card p-4 cursor-pointer hover:bg-accent/10 rounded-xl">
                          {feature.icon}
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Quizzes + Leaderboard */}
              <RecommendedQuizzes />
              <Leaderboard />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <RecentActivity activities={activities} maxItems={5} viewAllHref="/progress" />

              {/* Achievements */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 glow-text">
                    <Trophy className="h-5 w-5" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: <Star className="h-5 w-5 text-white" />, title: "Quiz Master", desc: "Completed 20+ quizzes" },
                    { icon: <Award className="h-5 w-5 text-white" />, title: "High Achiever", desc: "85%+ average score" },
                    { icon: <Zap className="h-5 w-5 text-white" />, title: "Streak Champion", desc: "7-day learning streak" },
                  ].map((achv, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        {achv.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achv.title}</p>
                        <p className="text-xs text-muted-foreground">{achv.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">5 quizzes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Subject</span>
                    <Badge variant="secondary">Mathematics</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Spent</span>
                    <span className="font-medium">12h 30m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Level Rank</span>
                    <span className="font-medium text-primary glow-text">#1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Rank</span>
                    <span className="font-medium text-primary glow-text">#23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
    </div>
  );
}
