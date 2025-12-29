"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Brain, Clock, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface AnalyticsData {
  totalQuizzes: number
  totalStudents: number
  totalAttempts: number
  averageScore: number
  thisWeekAttempts: number
  quizDifficultyStats: Record<string, any>
  studentLevelStats: Record<string, any>
}

export default function TeacherAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      fetchAnalytics()
    }
  }, [])

  const fetchAnalytics = async () => {
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/analytics?teacherId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Teacher Dashboard', href: '/teacher' },
              { label: 'Analytics' }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Track your teaching performance and student progress</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="glow-effect">
                  <Link href="/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="glow-effect">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {analytics && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                        <p className="text-3xl font-bold glow-text">{analytics.totalQuizzes}</p>
                      </div>
                      <Brain className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <p className="text-3xl font-bold glow-text">{analytics.totalStudents}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                        <p className="text-3xl font-bold glow-text">{analytics.averageScore}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">This Week</p>
                        <p className="text-3xl font-bold glow-text">{analytics.thisWeekAttempts}</p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quiz Performance by Difficulty */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="glow-text">Quiz Performance by Difficulty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.quizDifficultyStats || {}).map(([difficulty, stats]: [string, any]) => (
                        <div key={difficulty} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{difficulty}</p>
                            <p className="text-sm text-muted-foreground">{stats.count} quizzes • {stats.attempts} attempts</p>
                          </div>
                          <Badge variant={stats.avgScore >= 70 ? "default" : stats.avgScore >= 50 ? "secondary" : "destructive"}>
                            {stats.avgScore}% avg
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Student Performance by Level */}
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="glow-text">Student Performance by Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.studentLevelStats || {}).map(([level, stats]: [string, any]) => (
                        <div key={level} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="font-medium">{level}</p>
                            <p className="text-sm text-muted-foreground">{stats.count} students</p>
                          </div>
                          <Badge variant={stats.avgScore >= 70 ? "default" : stats.avgScore >= 50 ? "secondary" : "destructive"}>
                            {stats.avgScore}% avg
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Recent Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Detailed activity tracking and charts coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
