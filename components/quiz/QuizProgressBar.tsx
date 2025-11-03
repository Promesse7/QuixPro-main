'use client'

import { Progress } from '@/components/ui/progress'

interface QuizProgressBarProps {
  currentQuestion: number
  totalQuestions: number
  answered: number
}

export function QuizProgressBar({ currentQuestion, totalQuestions, answered }: QuizProgressBarProps) {
  const progressPercentage = (answered / totalQuestions) * 100
  const currentProgressPercentage = ((currentQuestion) / totalQuestions) * 100

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Progress: {answered}/{totalQuestions} answered</span>
        <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={currentProgressPercentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Question {currentQuestion} of {totalQuestions}</span>
      </div>
    </div>
  )
}
