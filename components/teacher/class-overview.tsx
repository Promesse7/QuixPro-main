"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Brain, TrendingUp, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ClassData {
  id: string
  name: string
  students: number
  level: string
  subject: string
  avgScore: number
  activeQuizzes: number
}

interface ClassOverviewProps {
  classes: ClassData[]
}

export function ClassOverview({ classes }: ClassOverviewProps) {
  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 glow-text">
            <Users className="h-5 w-5" />
            <span>My Classes</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/teacher/classes">
              View All <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((classData) => (
          <div key={classData.id} className="p-4 bg-accent/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{classData.name}</h4>
              <Badge variant="outline">{classData.level}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{classData.students} students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span>{classData.activeQuizzes} active quizzes</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>{classData.avgScore}% avg score</span>
              </div>
              <Button variant="ghost" size="sm" asChild className="justify-start p-0 h-auto">
                <Link href={`/teacher/classes/${classData.id}`} className="text-primary hover:text-primary/80">
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
