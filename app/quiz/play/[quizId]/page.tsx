'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { QuizTimer } from '@/components/quiz/QuizTimer'
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar'
import { QuestionCard, type Question } from '@/components/quiz/QuestionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import { QuickStartCTA } from '@/components/app/QuickStartCTA'

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  difficulty: string
  questions: Question[]
  subject?: string
  level?: string
}

interface PageProps {
  params: { quizId: string }
}

export default function PlayQuizPage({ params }: PageProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [timeUp, setTimeUp] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const quizId = decodeURIComponent(params.quizId)

  useEffect(() => {
    fetchQuizMeta()
  }, [quizId])

  const fetchQuizMeta = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/quiz/${encodeURIComponent(quizId)}?fields=meta`)
      if (res.ok) {
        const data = await res.json()
        setQuiz(data.quiz)
      } else {
        setError('Failed to load quiz')
      }
    } catch (err) {
      console.error('Failed to load quiz:', err)
      setError('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchFullQuiz = async () => {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/quiz/${encodeURIComponent(quizId)}?fields=all`)
      if (res.ok) {
        const data = await res.json()
        setQuiz(data.quiz)
      }
    } catch (err) {
      console.error('Failed to load full quiz:', err)
    }
  }

  const handleAnswerSelect = (answerIndex: number | string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex,
    })
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return

    try {
      const baseUrl = getBaseUrl()
      const score = calculateScore()

      // Transform answers to match format expected by API
      const answersForAPI: Record<number, boolean> = {}
      quiz.questions.forEach((q, index) => {
        const userAnswer = answers[index]
        answersForAPI[index] = userAnswer !== undefined && String(userAnswer) === String(q.correctAnswer)
      })

      const res = await fetch(`${baseUrl}/api/progress/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz._id,
          answers: answersForAPI,
          score,
          accuracy: score,
          timeSpent: quiz.duration * 60,
          difficulty: quiz.difficulty,
          totalQuestions: quiz.questions.length,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/quiz/results/${data.resultId}`)
      } else {
        const error = await res.json()
        setError(error.error || 'Failed to submit quiz')
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err)
      setError('Failed to submit quiz')
    }
  }

  const handleNextQuestion = () => {
    if (!showFeedback) {
      // Show feedback first
      setShowFeedback(true)
    } else if (currentQuestion === quiz!.questions.length - 1) {
      // Last question - submit quiz
      handleSubmitQuiz()
    } else {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1)
      setShowFeedback(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((q, index) => {
      if (String(answers[index]) === String(q.correctAnswer)) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card className="glass-effect border-border/50 max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Quiz</h3>
            <p className="text-muted-foreground mb-6">{error || 'Quiz not found'}</p>
            <Button asChild>
              <Link href="/quiz">Back to Quiz Selection</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button
              asChild
              variant="ghost"
              className="mb-6"
            >
              <Link href="/quiz" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz Selection
              </Link>
            </Button>

            <Card className="glass-effect border-border/50">
              <CardHeader className="space-y-4">
                <div>
                  <CardTitle className="text-3xl glow-text mb-2">{quiz.title}</CardTitle>
                  <p className="text-muted-foreground">{quiz.description}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/50">
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-2xl font-bold text-primary">{quiz.questions.length}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/50">
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                    <p className="text-2xl font-bold text-orange-500">{quiz.duration} min</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/50">
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="text-2xl font-bold text-purple-500 capitalize">{quiz.difficulty}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/50">
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="text-2xl font-bold text-green-500">{quiz.subject || 'General'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
                  <p className="text-sm font-medium text-blue-600 mb-2">📋 Quiz Guidelines</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Answer all questions to the best of your ability</li>
                    <li>✓ You can review and change your answers before submitting</li>
                    <li>✓ The timer will stop automatically when time is up</li>
                    <li>✓ Your score will be calculated based on correct answers</li>
                  </ul>
                </div>

                <Button
                  size="lg"
                  className="w-full glow-effect"
                  onClick={async () => { await fetchFullQuiz(); setQuizStarted(true) }}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const totalSeconds = quiz.duration * 60
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <AppBreadcrumb items={[{ label: 'Quiz', href: '/quiz' }, { label: quiz.title }]} />
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="mb-6 p-4 rounded-lg glass-effect border border-border/50 flex items-center justify-between">
            <div className="flex-grow">
              <h2 className="font-semibold text-foreground">{quiz.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <QuizTimer
              totalSeconds={totalSeconds}
              paused={false}
              onTimeUp={() => {
                setTimeUp(true)
                handleSubmitQuiz()
              }}
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <QuizProgressBar
              currentQuestion={currentQuestion + 1}
              totalQuestions={quiz.questions.length}
              answered={answeredCount}
            />
          </div>

          {/* Question Card */}
          <div className="mb-6">
            <QuestionCard
              question={quiz.questions[currentQuestion]}
              questionNumber={currentQuestion + 1}
              totalQuestions={quiz.questions.length}
              selectedAnswer={answers[currentQuestion] ?? null}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              showFeedback={showFeedback}
              canGoBack={currentQuestion > 0}
              canGoForward={true}
            />
          </div>

          {/* Question Navigation */}
          <div className="mt-6 p-4 rounded-lg glass-effect border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-3">Jump to Question</p>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setShowFeedback(false)
                  }}
                  className={`p-2 rounded text-sm font-medium transition-all ${
                    index === currentQuestion
                      ? 'bg-primary text-primary-foreground glow-effect'
                      : answers[index] !== undefined
                      ? 'bg-green-500/20 text-green-600 border border-green-500/50'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
