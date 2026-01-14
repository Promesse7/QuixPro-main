"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Clock, Zap } from "lucide-react"
import Link from "next/link"

interface QuizCardProps {
  quiz: any
}

export function QuizCard({ quiz }: QuizCardProps) {
  const difficultyColors: { [key: string]: string } = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {quiz.title || "Recommended Quiz"}
          </CardTitle>
          <Badge className={difficultyColors[quiz.difficulty] || difficultyColors.Medium}>
            {quiz.difficulty || "Medium"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{quiz.reason || "Recommended for your learning path"}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {quiz.time || "15 min"}
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            {quiz.enrolled || 0} taken
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
