"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Award, Target, TrendingUp } from "lucide-react"

interface ProgressStatsProps {
  stats: {
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    totalPoints: number
    certificates: number
    streak: number
  }
}

export function ProgressStats({ stats }: ProgressStatsProps) {
  const completionRate = (stats.completedQuizzes / stats.totalQuizzes) * 100

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quiz Progress</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">
            {stats.completedQuizzes}/{stats.totalQuizzes}
          </div>
          <Progress value={completionRate} className="mt-2 h-2 glow-effect" />
          <p className="text-xs text-muted-foreground mt-2">{Math.round(completionRate)}% completed</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">{stats.averageScore}%</div>
          <Progress value={stats.averageScore} className="mt-2 h-2 glow-effect" />
          <p className="text-xs text-muted-foreground mt-2">
            {stats.averageScore >= 80 ? "Excellent!" : stats.averageScore >= 70 ? "Good!" : "Keep improving!"}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">{stats.totalPoints.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2">+120 this week</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
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
  )
}
