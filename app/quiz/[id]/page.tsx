"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, ArrowLeft, Home, Mic } from "lucide-react"
import Link from "next/link"
import { QuizQuestion } from "@/components/quiz/quiz-question"
import { QuizResults } from "@/components/quiz/quiz-results"

// Mock quiz data - in real app this would come from API
const mockQuiz = {
  id: "1",
  title: "Rwanda History & Culture",
  subject: "Social Studies",
  level: "S3",
  description: "Test your knowledge of Rwanda's rich history and cultural heritage",
  questions: [
    {
      id: "q1",
      text: "What year did Rwanda gain independence?",
      options: [
        { id: "a", text: "1960", correct: false },
        { id: "b", text: "1962", correct: true },
        { id: "c", text: "1964", correct: false },
        { id: "d", text: "1966", correct: false },
      ],
      explanation: "Rwanda gained independence from Belgium on July 1, 1962, becoming a sovereign nation.",
      marks: 1,
    },
    {
      id: "q2",
      text: "Which traditional dance is most famous in Rwanda?",
      options: [
        { id: "a", text: "Intore", correct: true },
        { id: "b", text: "Kinyatrap", correct: false },
        { id: "c", text: "Ubusabane", correct: false },
        { id: "d", text: "Amaraba", correct: false },
      ],
      explanation:
        "Intore is Rwanda's most famous traditional dance, performed by warriors and known for its energetic movements.",
      marks: 1,
    },
    {
      id: "q3",
      text: "What is the capital city of Rwanda?",
      options: [
        { id: "a", text: "Butare", correct: false },
        { id: "b", text: "Gisenyi", correct: false },
        { id: "c", text: "Kigali", correct: true },
        { id: "d", text: "Ruhengeri", correct: false },
      ],
      explanation:
        "Kigali is the capital and largest city of Rwanda, known for its cleanliness and modern development.",
      marks: 1,
    },
  ],
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowExplanation(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setShowExplanation(!!answers[mockQuiz.questions[currentQuestion - 1].id])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    let correct = 0
    mockQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find((opt) => opt.correct)
      if (userAnswer === correctOption?.id) {
        correct++
      }
    })
    return {
      correct,
      total: mockQuiz.questions.length,
      percentage: Math.round((correct / mockQuiz.questions.length) * 100),
    }
  }

  if (isCompleted) {
    return <QuizResults quiz={mockQuiz} answers={answers} timeElapsed={timeElapsed} />
  }

  const question = mockQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100

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
                <h1 className="text-xl font-bold glow-text">{mockQuiz.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{mockQuiz.subject}</Badge>
                  <Badge variant="outline">{mockQuiz.level}</Badge>
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
                Question {currentQuestion + 1} of {mockQuiz.questions.length}
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
              {currentQuestion === mockQuiz.questions.length - 1 ? "Finish Quiz" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
