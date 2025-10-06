"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

export function StudentAnalytics() {
  // Mock analytics data
  const analyticsData = {
    topPerformers: [
      { name: "Marie Claire", score: 95, improvement: "+5%" },
      { name: "Jean Paul", score: 92, improvement: "+3%" },
      { name: "Aline Uwimana", score: 89, improvement: "+7%" },
    ],
    strugglingStudents: [
      { name: "Eric Nshimiyimana", score: 58, improvement: "-2%" },
      { name: "Grace Mukamana", score: 62, improvement: "+1%" },
    ],
    subjectPerformance: [
      { subject: "Algebra", avgScore: 82, trend: "up" },
      { subject: "Geometry", avgScore: 75, trend: "down" },
      { subject: "Statistics", avgScore: 88, trend: "up" },
    ],
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 glow-text">
          <BarChart3 className="h-5 w-5" />
          <span>Student Analytics</span>
        </CardTitle>
        <CardDescription>Performance insights and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>Top Performers</span>
            </h4>
            {analyticsData.topPerformers.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm font-bold text-green-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.score}% average</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-400">{student.improvement}</p>
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
            {analyticsData.strugglingStudents.map((student) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.score}% average</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${student.improvement.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {student.improvement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="mt-6">
          <h4 className="font-semibold mb-4">Subject Performance</h4>
          <div className="space-y-3">
            {analyticsData.subjectPerformance.map((subject) => (
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
      </CardContent>
    </Card>
  )
}
