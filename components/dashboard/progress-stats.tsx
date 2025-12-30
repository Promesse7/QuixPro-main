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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="border-border/50 hover-lift bg-card/50 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quiz Progress</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black glow-text flex items-baseline gap-1">
            {stats.completedQuizzes}
            <span className="text-sm font-medium text-muted-foreground">/{stats.totalQuizzes}</span>
          </div>
          <Progress value={completionRate} className="mt-4 h-2 rounded-full bg-muted shadow-inner" />
          <p className="text-xs font-bold text-muted-foreground mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {Math.round(completionRate)}% completed
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover-lift bg-card/50 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Average Score</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black glow-text text-green-500">{stats.averageScore}%</div>
          <Progress value={stats.averageScore} className="mt-4 h-2 rounded-full bg-muted shadow-inner" />
          <p className="text-xs font-bold text-muted-foreground mt-3">
            {stats.averageScore >= 80 ? "🔥 Excellent performance!" : stats.averageScore >= 70 ? "✨ Doing great!" : "💪 Keep pushing!"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover-lift bg-card/50 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Points</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black glow-text text-yellow-500">
            {stats.totalPoints.toLocaleString()}
          </div>
          <div className="h-2 mt-4 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 w-[60%] rounded-full shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
          </div>
          <p className="text-xs font-bold text-muted-foreground mt-3 text-yellow-600/80">
            +120 earned this week
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover-lift bg-card/50 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Certificates</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Award className="h-5 w-5 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black glow-text text-purple-500">{stats.certificates}</div>
          <div className="flex gap-1.5 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < stats.certificates ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-muted'}`} />
            ))}
          </div>
          <p className="text-xs font-bold text-muted-foreground mt-3">
            {stats.certificates >= 3 ? "🏆 Expert status reached!" : "🎯 Goal: 5 certificates"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
