'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, XCircle, BarChart3, Clock, Zap, Home, RotateCcw } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

interface Result {
  _id: string
  quizId: string
  score: number
  accuracy: number
  timeSpent: number
  difficulty: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  skipped: number
  answers: Record<string, any>
  quiz: {
    title: string
    subject: string
    level: string
    duration: number
  }
  createdAt: string
}

interface PageProps {
  params: { resultId: string }
}

export default function ResultPage({ params }: PageProps) {
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const resultId = decodeURIComponent(params.resultId)

  useEffect(() => {
    fetchResult()
  }, [resultId])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/progress/result/${encodeURIComponent(resultId)}`)
      if (res.ok) {
        const data = await res.json()
        setResult(data.result)
      } else {
        setError('Result not found')
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

  if (error || !result) {
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

  const performance = getPerformanceLevel(result.accuracy)
  const xpReward = getXPReward(result.accuracy)
  const timeTakenMinutes = Math.floor(result.timeSpent / 60)
  const timeTakenSeconds = result.timeSpent % 60

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
                {Math.round(result.accuracy)}%
              </CardTitle>
              <CardDescription className="text-xl">
                <span className={`font-bold ${performance.color}`}>{performance.level}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-muted-foreground mb-6">
                You scored <span className="font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</span> correct
              </p>
              
              {/* XP Reward */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 mb-6">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-600">+{xpReward} XP Earned</span>
              </div>

              {/* Quiz Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📚 <span className="font-medium text-foreground">{result.quiz.title}</span></p>
                <p>📍 {result.quiz.subject} • {result.quiz.level}</p>
                <p>⚡ Difficulty: <Badge className="ml-2" variant="secondary">{result.difficulty}</Badge></p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{result.correctAnswers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Correct Answers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{result.wrongAnswers}</p>
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
                  <p className="text-2xl font-bold text-purple-500">{result.score}</p>
                  <p className="text-xs text-muted-foreground mt-1">Final Score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Cards */}
          <div className="space-y-4 mb-8">
            {result.accuracy >= 90 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-green-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-green-600">
                    🎉 Outstanding performance! You've mastered this topic. Try the next difficulty level to challenge yourself further.
                  </p>
                </CardContent>
              </Card>
            )}

            {result.accuracy >= 75 && result.accuracy < 90 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-blue-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-blue-600">
                    ✨ Great job! You have a solid understanding. Review the questions you missed and try harder difficulty next.
                  </p>
                </CardContent>
              </Card>
            )}

            {result.accuracy >= 60 && result.accuracy < 75 && (
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-yellow-500/10 to-transparent">
                <CardContent className="py-4">
                  <p className="text-sm font-medium text-yellow-600">
                    📚 Good effort! Practice more topics in this unit before moving to the next difficulty. You're making progress!
                  </p>
                </CardContent>
              </Card>
            )}

            {result.accuracy < 60 && (
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
