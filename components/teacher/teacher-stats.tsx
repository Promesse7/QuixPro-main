"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Users, TrendingUp, Target } from "lucide-react"

interface TeacherStatsProps {
  stats: {
    totalQuizzes: number
    totalStudents: number
    activeClasses: number
    averageScore: number
    totalAttempts: number
    thisWeekAttempts: number
  }
}

export function TeacherStats({ stats }: TeacherStatsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">{stats.totalQuizzes}</div>
          <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">Across {stats.activeClasses} classes</p>
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
            {stats.averageScore >= 80 ? "Excellent performance!" : "Room for improvement"}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold glow-text">{stats.totalAttempts}</div>
          <p className="text-xs text-muted-foreground mt-1">+{stats.thisWeekAttempts} this week</p>
        </CardContent>
      </Card>
    </div>
  )
}
