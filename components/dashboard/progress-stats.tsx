"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Award, Target, TrendingUp, Flame, Calendar, Trophy } from "lucide-react"

interface ProgressStatsProps {
  stats: {
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    totalPoints: number
    certificates: number
    streak: number
  }
  weeklyPoints?: number
  subjectProgress?: Record<string, { quizzesTaken: number; averageScore: number; bestScore: number }>
}

export function ProgressStats({ stats, weeklyPoints = 0, subjectProgress = {} }: ProgressStatsProps) {
  const completionRate = stats.totalQuizzes > 0 ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0
  const bestSubject = Object.entries(subjectProgress).reduce((best, [subject, data]) => {
    if (!best || data.averageScore > best.averageScore) {
      return { subject, ...data }
    }
    return best
  }, null as { subject: string; quizzesTaken: number; averageScore: number; bestScore: number } | null)

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Progress</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold glow-text">
              {stats.completedQuizzes}/{stats.totalQuizzes}
            </div>
            <Progress value={completionRate} className="mt-2 h-2.5 rounded-full glow-effect" />
            <p className="text-xs text-muted-foreground mt-2">{Math.round(completionRate)}% completed</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold glow-text">{stats.averageScore}%</div>
            <Progress value={stats.averageScore} className="mt-2 h-2.5 rounded-full glow-effect" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.averageScore >= 80 ? "Excellent!" : stats.averageScore >= 70 ? "Good!" : "Keep improving!"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold glow-text">{stats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {weeklyPoints > 0 ? `+${weeklyPoints} this week` : "Keep practicing!"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold glow-text">{stats.certificates}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.certificates >= 3 ? "Great collection!" : "Keep earning!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/50 hover-lift bg-gradient-to-r from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.streak >= 7 ? "On fire! 🔥" : stats.streak >= 3 ? "Keep it going!" : "Start your streak!"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover-lift bg-gradient-to-r from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {bestSubject ? bestSubject.subject : "None"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {bestSubject ? `${bestSubject.averageScore}% avg • ${bestSubject.quizzesTaken} quizzes` : "Take more quizzes!"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover-lift bg-gradient-to-r from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Level</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {getPerformanceLevel(stats.averageScore)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {getPerformanceDescription(stats.averageScore)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getPerformanceLevel(score: number): string {
  if (score >= 90) return "Expert"
  if (score >= 80) return "Advanced"
  if (score >= 70) return "Proficient"
  if (score >= 60) return "Developing"
  return "Beginner"
}

function getPerformanceDescription(score: number): string {
  if (score >= 90) return "Outstanding performance!"
  if (score >= 80) return "Excellent work!"
  if (score >= 70) return "Good progress!"
  if (score >= 60) return "Keep improving!"
  return "Keep practicing!"
}
