"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { recordGuestQuizAttempt, shouldPromptSignup } from "@/lib/guest-session"
import SignupPromptModal from "./SignupPromptModal"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface GuestQuizModalProps {
  quiz: any
  isOpen: boolean
  onClose: () => void
}

export default function GuestQuizModal({ quiz, isOpen, onClose }: GuestQuizModalProps) {
  const [fullQuiz, setFullQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && quiz?._id) {
      fetchFullQuiz()
    }
  }, [isOpen, quiz])

  const fetchFullQuiz = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/quiz/${quiz._id}`)
      const data = await res.json()
      setFullQuiz(data.quiz)
    } catch (error) {
      console.error("Failed to fetch quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
  }

  const handleNext = () => {
    if (!selectedAnswer) return
    if (!fullQuiz || !Array.isArray(fullQuiz.questions)) return

    const qId = fullQuiz.questions[currentQuestion]?.id
    const newAnswers = qId
      ? { ...answers, [qId]: selectedAnswer }
      : { ...answers }
    setAnswers(newAnswers)

    const questionsLength = Array.isArray(fullQuiz.questions) ? fullQuiz.questions.length : 0
    if (currentQuestion < questionsLength - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      // Quiz completed - calculate score
      finishQuiz(newAnswers)
    }
  }

  const finishQuiz = (finalAnswers: Record<string, string>) => {
    if (!fullQuiz || !Array.isArray(fullQuiz.questions)) return

    let correctCount = 0
    fullQuiz.questions.forEach((question: any) => {
      const userAnswer = finalAnswers[question.id]
      const correctOption = (question.options || []).find((opt: any) => opt.correct || opt.isCorrect)
      if (userAnswer === correctOption?.id) {
        correctCount++
      }
    })

    const questionsLength = Array.isArray(fullQuiz.questions) ? fullQuiz.questions.length : 0
    const finalScore = questionsLength ? Math.round((correctCount / questionsLength) * 100) : 0
    setScore(finalScore)
    setShowResult(true)

    // Record attempt in guest session
    recordGuestQuizAttempt(quiz._id, finalScore, finalAnswers)

    // Check if should prompt signup
    if (shouldPromptSignup()) {
      setTimeout(() => {
        setShowSignupPrompt(true)
      }, 2000)
    }
  }

  const handleClose = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers({})
    setShowResult(false)
    setScore(0)
    setFullQuiz(null)
    onClose()
  }

  if (!isOpen) return null

  const questionsLength = Array.isArray(fullQuiz?.questions) ? fullQuiz!.questions.length : 0
  const progress = questionsLength ? ((currentQuestion + 1) / questionsLength) * 100 : 0
  const currentQ = Array.isArray(fullQuiz?.questions) ? fullQuiz!.questions[currentQuestion] : undefined

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-400" />
                    {quiz?.title || "Sample Quiz"}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                {!showResult && fullQuiz && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                      <span>Question {currentQuestion + 1} of {questionsLength}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  </div>
                ) : showResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      score >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {score >= 70 ? (
                        <Trophy className="w-12 h-12 text-green-400" />
                      ) : (
                        <Brain className="w-12 h-12 text-red-400" />
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {score >= 70 ? 'Great Job!' : 'Keep Practicing!'}
                    </h3>
                    <p className="text-white/70 mb-8">
                      You scored {score}% on this quiz
                    </p>

                    <div className="bg-white/5 rounded-xl p-6 mb-8">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {Object.keys(answers).length}
                          </div>
                          <div className="text-sm text-white/60">Questions</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {Math.round(score * Object.keys(answers).length / 100)}
                          </div>
                          <div className="text-sm text-white/60">Correct</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {score}%
                          </div>
                          <div className="text-sm text-white/60">Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                      <p className="text-white/90 mb-4">
                        🎯 <strong>Want to save your progress and earn certificates?</strong>
                      </p>
                      <p className="text-white/70 text-sm">
                        Create a free account to track your learning journey, compete on leaderboards, and unlock badges!
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleClose}
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => setShowSignupPrompt(true)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        Create Account
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : currentQ ? (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {currentQ.question || currentQ.text}
                    </h3>

                    <div className="space-y-3">
                      {(currentQ.options || []).map((option: any) => {
                        const isSelected = selectedAnswer === option.id
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleAnswerSelect(option.id)}
                            className={`
                              w-full p-4 rounded-xl text-left transition-all border-2
                              ${isSelected 
                                ? 'bg-blue-500/20 border-blue-500 text-white' 
                                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-white/30'}
                              `}>
                                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <span className="flex-1">{option.text}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              {!showResult && !loading && (
                <div className="p-6 border-t border-white/10">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion < (questionsLength || 0) - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        quizScore={score}
      />
    </>
  )
}