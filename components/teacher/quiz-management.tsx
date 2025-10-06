"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, BarChart3, Edit, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  subject: string
  level: string
  students: number
  avgScore: number
  created: string
  status: "active" | "draft" | "archived"
}

interface QuizManagementProps {
  quizzes: Quiz[]
}

export function QuizManagement({ quizzes }: QuizManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400"
      case "draft":
        return "text-yellow-400"
      case "archived":
        return "text-gray-400"
      default:
        return "text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 glow-text">
              <Brain className="h-5 w-5" />
              <span>My Quizzes</span>
            </CardTitle>
            <CardDescription>Manage and track your quiz performance</CardDescription>
          </div>
          <Button asChild className="glow-effect">
            <Link href="/teacher/quiz/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{quiz.title}</h4>
                  <Badge variant="outline">{quiz.subject}</Badge>
                  <Badge variant="secondary">{quiz.level}</Badge>
                  <Badge variant="outline" className={getStatusColor(quiz.status)}>
                    {quiz.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{quiz.students} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{quiz.avgScore}% avg score</span>
                  </div>
                  <span>Created {formatDate(quiz.created)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/teacher/quiz/${quiz.id}/analytics`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/teacher/quiz/${quiz.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
