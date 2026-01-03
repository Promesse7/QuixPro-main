'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, XCircle, BarChart3, Clock, Zap, Home, RotateCcw, Award } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

interface QuizAttempt {
  _id: string
  userId: string
  quizId: string
  answers: Array<{
    questionId: string
    selectedAnswer: number | string
    isCorrect: boolean
    timeSpent?: number
    answeredAt?: string
  }>
  score: {
    correct: number
    total: number
    percentage: number
  }
  timeSpent: number
  status: "in_progress" | "completed" | "abandoned"
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  difficulty?: string
  subject?: string
  level?: string
  certificateEarned?: boolean
  certificateId?: string
}

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  difficulty: string
  subject?: string
  level?: string
}

interface PageProps {
  params: { resultId: string }
}

export default function ResultPage({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const resultId = decodeURIComponent(params.resultId)
  const quizId = searchParams.get('quizId')

  useEffect(() => {
    fetchResult()
  }, [resultId, quizId])

  useEffect(() => {
    if (attempt && quiz) {
      const triggerNotifications = async () => {
        try {
          // Trigger quiz completion notification
          const response = await fetch('/api/notifications/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'quiz_completed',
              quizId: quiz._id,
              score: attempt.score.percentage,
              quizTitle: quiz.title
            })
          })

          // Trigger certificate notification if earned
          if (attempt.certificateEarned && attempt.certificateId) {
            await fetch('/api/notifications/trigger', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'certificate_earned',
                certificateId: attempt.certificateId,
                quizTitle: quiz.title
              })
            })
          }
        } catch (error) {
          console.error('Failed to trigger notifications:', error)
        }
      }

      triggerNotifications()
    }
  }, [attempt, quiz])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const quizId = searchParams.get('quizId')
      
      // Fetch the attempt data
      const attemptRes = await fetch(`${baseUrl}/api/quiz-attempts/${encodeURIComponent(resultId)}`)
      if (!attemptRes.ok) {
        setError('Quiz attempt not found')
        return
      }
      const attemptData = await attemptRes.json()
      setAttempt(attemptData.attempt)
      
      // Fetch quiz data if quizId is provided
      if (quizId) {
        const quizRes = await fetch(`${baseUrl}/api/quiz/${encodeURIComponent(quizId)}?fields=meta`)
        if (quizRes.ok) {
          const quizData = await quizRes.json()
          setQuiz(quizData.quiz)
        }
      }
    } catch (err) {
      console.error('Failed to load result:', err)
      setError('Failed to load result')
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-500', icon: '🌟' }
    if (accuracy >= 75) return { level: 'Good', color: 'text-blue-500', icon: '👍' }
    if (accuracy >= 60) return { level: 'Fair', color: 'text-yellow-500', icon: '📈' }
    return { level: 'Needs Improvement', color: 'text-red-500', icon: '💪' }
  }

  const getXPReward = (accuracy: number) => {
    if (accuracy >= 90) return 100
    if (accuracy >= 75) return 75
    if (accuracy >= 60) return 50
    return 25
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card className="glass-effect border-border/50 max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Results</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/quiz">Back to Quiz Selection</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const performance = getPerformanceLevel(attempt.score.percentage)
  const xpReward = getXPReward(attempt.score.percentage)
  const timeTakenMinutes = Math.floor(attempt.timeSpent / 60)
  const timeTakenSeconds = attempt.timeSpent % 60
  const wrongAnswers = attempt.score.total - attempt.score.correct

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <QuizBreadcrumb steps={[{ label: 'Quiz Results', active: true }]} />

          {/* Score Display Card */}
          <Card className={`glass-effect border-border/50 mb-8 bg-gradient-to-r ${
            performance.level === 'Excellent'
              ? 'from-green-500/20 to-transparent'
              : performance.level === 'Good'
              ? 'from-blue-500/20 to-transparent'
              : performance.level === 'Fair'
              ? 'from-yellow-500/20 to-transparent'
              : 'from-red-500/20 to-transparent'
          }`}>
            <CardHeader className="text-center py-8">
              <div className="mb-4">
                <span className="text-6xl">{performance.icon}</span>
              </div>
              <CardTitle className="text-5xl glow-text mb-2">
                {Math.round(attempt.score.percentage)}%
              </CardTitle>
              <CardDescription className="text-xl">
                <span className={`font-bold ${performance.color}`}>{performance.level}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-muted-foreground mb-6">
                You scored <span className="font-bold text-foreground">{attempt.score.correct}/{attempt.score.total}</span> correct
              </p>
              
              {/* XP Reward */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 mb-6">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-600">+{xpReward} XP Earned</span>
              </div>

              {/* Certificate Badge */}
              {attempt.certificateEarned && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 mb-6">
                  <Award className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-green-600">Certificate Earned!</span>
                </div>
              )}

              {/* Quiz Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📚 <span className="font-medium text-foreground">{quiz?.title || 'Quiz'}</span></p>
                <p>📍 {attempt.subject || 'Unknown'} • {attempt.level || 'Unknown'}</p>
                <p>⚡ Difficulty: <Badge className="ml-2" variant="secondary">{attempt.difficulty || 'Unknown'}</Badge></p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{attempt.score.correct}</p>
                  <p className="text-xs text-muted-foreground mt-1">Correct Answers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{wrongAnswers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Wrong Answers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-500">{timeTakenMinutes}:{String(timeTakenSeconds).padStart(2, '0')}</p>
                  <p className="text-xs text-muted-foreground mt-1">Time Taken</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-500">{attempt.score.percentage}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Final Score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Cards */}
          <div className="space-y-4 mb-8">
            {attempt.score.percentage >= 90 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-green-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-green-600">
                    🎉 Outstanding performance! You've mastered this topic. Try the next difficulty level to challenge yourself further.
                  </p>
                </CardContent>
              </Card>
            )}

            {attempt.score.percentage >= 75 && attempt.score.percentage < 90 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-blue-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-blue-600">
                    ✨ Great job! You have a solid understanding. Review the questions you missed and try harder difficulty next.
                  </p>
                </CardContent>
              </Card>
            )}

            {attempt.score.percentage >= 60 && attempt.score.percentage < 75 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-yellow-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-yellow-600">
                    📚 Good effort! Practice more topics in this unit before moving to the next difficulty. You're making progress!
                  </p>
                </CardContent>
              </Card>
            )}

            {attempt.score.percentage < 60 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-orange-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-orange-600">
                    💪 Keep learning! Review the concepts and try again. Every attempt helps you improve. Don't give up!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              asChild
              className="w-full glow-effect"
              size="lg"
            >
              <Link href="/quiz" className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Try Another Quiz
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>

            <Button
              onClick={() => fetchResult()}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              Review Details
            </Button>
          </div>

          {/* Tips Section */}
          <Card className="glass-effect border-border/50 mt-8 bg-gradient-to-r from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💡</span>
                Tips for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Review the questions you got wrong and understand the correct answer</li>
                <li>✓ Study the related concepts and topics before retaking the quiz</li>
                <li>✓ Practice similar questions to strengthen your skills</li>
                <li>✓ Try taking the quiz again after studying to see your improvement</li>
                <li>✓ Track your progress across multiple quiz attempts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
