"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, ArrowLeft, Home, Mic, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { QuizQuestion } from "@/components/quiz/quiz-question"
import { QuizResults } from "@/components/quiz/quiz-results"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [existingAttempt, setExistingAttempt] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    // If no user, they're in guest mode
    if (!currentUser) {
      setIsGuestMode(true)
    }

    const fetchQuizData = async () => {
      try {
        setLoading(true)
        const baseUrl = getBaseUrl();
        
        // Fetch quiz details
        const quizRes = await fetch(`${baseUrl}/api/quiz/${params.id}`)
        if (!quizRes.ok) throw new Error("Failed to fetch quiz")
        const quizData = await quizRes.json()
        setQuiz(quizData.quiz)

        // Check for existing attempts
        if (currentUser) {
          const attemptsRes = await fetch(`${baseUrl}/api/quiz-attempts?userId=${currentUser.id}&quizId=${params.id}`)
          if (attemptsRes.ok) {
            const attemptsData = await attemptsRes.json()
            const completedAttempt = attemptsData.attempts.find((a: any) => a.status === "completed")
            if (completedAttempt) {
              setExistingAttempt(completedAttempt)
            }
          }
        }
      } catch (e) {
        console.error("Failed to load quiz data", e)
        setError("Failed to load quiz. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [params.id])

  useEffect(() => {
    if (!existingAttempt && !isCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      setTimerInterval(timer)
      return () => clearInterval(timer)
    } else if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [existingAttempt, isCompleted])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [timerInterval])

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }))
    setShowExplanation(true)
  }

  const handleNext = async () => {
    if (!quiz || !quiz.questions) return
    const questionsLengthLocal = Array.isArray(quiz.questions) ? quiz.questions.length : 0
    if (currentQuestion < questionsLengthLocal - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowExplanation(false)
    } else {
      // Quiz completed - record the attempt
      await recordQuizAttempt()
      setIsCompleted(true)
    }
  }

  const recordQuizAttempt = async () => {
    if (!user || !quiz) return

    try {
      const score = calculateScore()
      const attemptData = {
        userId: user.id,
        quizId: quiz.id,
        answers,
        timeElapsed,
        score,
      }

      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/quiz-attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attemptData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (res.status === 409) {
          // Quiz already completed
          setExistingAttempt(errorData.attempt)
        } else {
          throw new Error(errorData.error || "Failed to record attempt")
        }
      }
    } catch (e) {
      console.error("Failed to record quiz attempt", e)
    }
  }

  const handlePrevious = () => {
    if (!quiz || !quiz.questions) return
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      const prevQuestion = Array.isArray(quiz.questions) ? quiz.questions[currentQuestion - 1] : null
      setShowExplanation(!!(prevQuestion && answers[prevQuestion.id]))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    if (!quiz || !quiz.questions || !Array.isArray(quiz.questions)) {
      return { correct: 0, total: 0, percentage: 0 }
    }
    let correct = 0
    quiz.questions.forEach((question: any) => {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find((opt: any) => opt.correct)
      if (userAnswer === correctOption?.id) {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">{error || "Quiz not found"}</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Quiz already completed
  if (existingAttempt) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Already Completed</h2>
          <p className="text-gray-400 mb-4">
            You have already completed this quiz with a score of {existingAttempt.percentage}%
          </p>
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
            <Link href="/certificates">
              <Button variant="outline" className="w-full">View Certificates</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    // Ensure quiz data is properly structured before passing to QuizResults
    if (!quiz || !quiz.questions || !Array.isArray(quiz.questions)) {
      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Error: Quiz data is incomplete</p>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      )
    }
    
    return <QuizResults quiz={quiz} answers={answers} timeElapsed={timeElapsed} />
  }

  // Safety check for quiz data
  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Error: Quiz has no questions</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const questionsLength = Array.isArray(quiz.questions) ? quiz.questions.length : 0
  const progress = questionsLength ? ((currentQuestion + 1) / questionsLength) * 100 : 0

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold glow-text">{quiz.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{quiz.subject}</Badge>
                  <Badge variant="outline">{quiz.level}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`glass-effect ${isVoiceMode ? "voice-wave" : ""}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestion + 1} of {questionsLength}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 glow-effect" />
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <QuizQuestion
            question={question}
            selectedAnswer={answers[question.id]}
            showExplanation={showExplanation}
            onAnswerSelect={handleAnswerSelect}
            isVoiceMode={isVoiceMode}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="glass-effect bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {showExplanation ? "Ready for next question?" : "Select an answer to continue"}
              </p>
            </div>

            <Button onClick={handleNext} disabled={!showExplanation} className="glow-effect">
              {currentQuestion === questionsLength - 1 ? "Finish Quiz" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
