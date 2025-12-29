"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Target, Award, Home, RotateCcw, Share2 } from "lucide-react"
import Link from "next/link"

interface QuizResultsProps {
  quiz: {
    _id?: string
    id?: string
    title: string
    subject: string
    level: string
    questions: Array<{
      _id?: string
      id?: string
      question: string
      options: string[]
      correctAnswer: number | string
      explanation?: string
    }>
  }
  answers: Record<string, string | number>
  timeElapsed: number
}

export function QuizResults({ quiz, answers, timeElapsed }: QuizResultsProps) {
  // Safety check for quiz data
  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions)) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Error: Invalid quiz data</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question) => {
      const questionId = question._id?.toString() || question.id
      if (!questionId) return // Skip if no valid ID
      
      const userAnswer = answers[questionId]
      const correctAnswer = question.correctAnswer
      if (userAnswer === correctAnswer) {
        correct++
      }
    })
    const questionsLength = quiz.questions.length
    return {
      correct,
      total: questionsLength,
      percentage: questionsLength ? Math.round((correct / questionsLength) * 100) : 0,
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const score = calculateScore()
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-400", message: "Outstanding!" }
    if (percentage >= 80) return { grade: "A", color: "text-green-400", message: "Excellent!" }
    if (percentage >= 70) return { grade: "B", color: "text-blue-400", message: "Good job!" }
    if (percentage >= 60) return { grade: "C", color: "text-yellow-400", message: "Keep practicing!" }
    return { grade: "D", color: "text-red-400", message: "Need improvement" }
  }

  const gradeInfo = getGrade(score.percentage)

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="glass-effect border-border/50 glow-effect mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center glow-effect">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl glow-text mb-2">Quiz Complete!</CardTitle>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Badge variant="secondary">{quiz.subject}</Badge>
                <Badge variant="outline">{quiz.level}</Badge>
              </div>
              <h2 className="text-xl text-muted-foreground">{quiz.title}</h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Score</span>
                  </div>
                  <div className="text-3xl font-bold glow-text">
                    {score.correct}/{score.total}
                  </div>
                  <div className={`text-2xl font-bold ${gradeInfo.color}`}>{score.percentage}%</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Grade</span>
                  </div>
                  <div className={`text-4xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                  <div className="text-sm text-muted-foreground">{gradeInfo.message}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Time</span>
                  </div>
                  <div className="text-3xl font-bold glow-text">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-muted-foreground">Total time</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Overall Progress</span>
                  <span>{score.percentage}%</span>
                </div>
                <Progress value={score.percentage} className="h-3 glow-effect" />
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="glow-text">Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quiz.questions.map((question, index) => {
                const questionId = question._id?.toString() || question.id
                const userAnswer = answers[questionId]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div key={questionId} className="border border-border/50 rounded-lg p-4 glass-effect">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-lg">
                        {index + 1}. {question.question}
                      </h4>
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Your answer:</span>
                        <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                          {userAnswer !== undefined ? question.options[userAnswer as number] || "Invalid answer" : "Not answered"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Correct answer:</span>
                          <span className="text-green-400">
                            {question.options[question.correctAnswer as number]}
                          </span>
                        </div>
                      )}
                      <div className="mt-3 p-3 bg-accent/20 rounded-md">
                        <p className="text-muted-foreground text-sm">{question.explanation || "No explanation available"}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="glass-effect bg-transparent">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="glass-effect bg-transparent">
              <Link href={`/quiz/${quiz._id || quiz.id}`}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Link>
            </Button>
            <Button className="glow-effect">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            {score.percentage >= 70 && (
              <Button asChild className="glow-effect">
                <Link href="/certificates">
                  <Award className="h-4 w-4 mr-2" />
                  Get Certificate
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
