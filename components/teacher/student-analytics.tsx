"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

type StudentSummary = {
  id: string
  name: string
  email: string
  level?: string
  averageScore: number
}

interface StudentAnalyticsProps {
  students: StudentSummary[]
}

export function StudentAnalytics({ students }: StudentAnalyticsProps) {
  const sortedByScore = [...students].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
  const topPerformers = sortedByScore.slice(0, 3)
  const strugglingStudents = sortedByScore.filter((s) => (s.averageScore || 0) < 60).slice(0, 3)

  // Simple subject performance approximation by level
  const levelGroups = new Map<string, { total: number; count: number }>()
  for (const s of students) {
    const level = s.level || 'Unknown'
    if (!levelGroups.has(level)) {
      levelGroups.set(level, { total: 0, count: 0 })
    }
    const entry = levelGroups.get(level)!
    entry.total += s.averageScore || 0
    entry.count += 1
  }
  const subjectPerformance = Array.from(levelGroups.entries()).map(([level, { total, count }]) => ({
    subject: level,
    avgScore: count > 0 ? Math.round(total / count) : 0,
    trend: 'up' as 'up' | 'down',
  }))

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 glow-text">
          <BarChart3 className="h-5 w-5" />
          <span>Student Analytics</span>
        </CardTitle>
        <CardDescription>Performance insights and trends for all your students on board</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>Top Performers</span>
            </h4>
            {topPerformers.length === 0 && (
              <p className="text-xs text-muted-foreground">No performance data yet.</p>
            )}
            {topPerformers.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm font-bold text-green-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.averageScore}% average</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Students Needing Help */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Target className="h-4 w-4 text-yellow-400" />
              <span>Needs Attention</span>
            </h4>
            {strugglingStudents.length === 0 && (
              <p className="text-xs text-muted-foreground">No students flagged as struggling yet.</p>
            )}
            {strugglingStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.averageScore}% average</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject/Level Performance */}
        <div className="mt-6">
          <h4 className="font-semibold mb-4">Level Performance</h4>
          <div className="space-y-3">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject.subject}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{subject.avgScore}%</span>
                    <TrendingUp className={`h-4 w-4 ${subject.trend === "up" ? "text-green-400" : "text-red-400"}`} />
                  </div>
                </div>
                <Progress value={subject.avgScore} className="h-2 glow-effect" />
              </div>
            ))}
          </div>
        </div>

        {/* All students list */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">All Students On Board ({students.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs p-2 bg-accent/10 rounded">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-muted-foreground">{s.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">{s.level || 'Level N/A'}</p>
                  <p>{s.averageScore}%</p>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-xs text-muted-foreground">No students found yet.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
