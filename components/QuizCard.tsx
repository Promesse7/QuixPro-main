"use client"

import Link from "next/link"
import { Clock, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface QuizCardProps {
  _id: string | { $oid: string }
  title: string
  description: string
  subject: string
  level: string
  duration: number
  questions?: any[]
  difficulty?: string
}

export function QuizCard({ _id, title, description, subject, level, duration, questions, difficulty }: QuizCardProps) {
  const quizId = typeof _id === "string" ? _id : _id?.$oid

  return (
    <div className="glass-effect border border-border/50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Badge variant="secondary">{subject}</Badge>
          <Badge variant="outline">{level}</Badge>
          {difficulty && <Badge>{difficulty}</Badge>}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{questions?.length || 0} Qs</span>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/quiz/${quizId}`}>Start Quiz</Link>
        </Button>
      </div>
    </div>
  )
}
