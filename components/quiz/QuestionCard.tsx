'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Calculator } from 'lucide-react'
import { useState } from 'react'
import { MathInput } from '@/components/math/MathInput'

export interface Question {
  _id?: string
  question: string
  options: string[]
  correctAnswer: number | string
  explanation?: string
  type?: 'multiple-choice' | 'math' // Add question type
}

interface QuestionCardProps {
  question: Question | null
  questionNumber: number
  totalQuestions: number
  onAnswerSelect: (answerIndex: number | string) => void
  onNext: () => void
  onPrevious?: () => void
  selectedAnswer?: number | string | null
  showFeedback?: boolean
  canGoBack?: boolean
  canGoForward?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  onNext,
  onPrevious,
  selectedAnswer,
  showFeedback = false,
  canGoBack = true,
  canGoForward = true,
}: QuestionCardProps) {
  const [submitted, setSubmitted] = useState(false)
  const [showMathKeyboard, setShowMathKeyboard] = useState(false)
  const isAnswered = selectedAnswer !== null && selectedAnswer !== undefined
  
  // Determine if this is a math question (no options provided)
  const isMathQuestion = question && (!question.options || question.options.length === 0)

  // Return loading state if question is null
  if (!question) {
    return (
      <Card className="w-full max-w-4xl mx-auto glass-effect border-border/50">
        <CardContent className="p-8 text-center">
          <p>Loading question...</p>
        </CardContent>
      </Card>
    )
  }
  const isCorrect = showFeedback && isAnswered && (
    isMathQuestion 
      ? String(selectedAnswer) === String(question.correctAnswer)
      : String(selectedAnswer) === String(question.correctAnswer)
  )

  const handleAnswerSelect = (value: string) => {
    if (!submitted || !showFeedback) {
      if (isMathQuestion) {
        // For math questions, pass the value directly
        onAnswerSelect(value)
      } else {
        // For multiple choice, convert to index
        const answerIndex = parseInt(value)
        onAnswerSelect(answerIndex)
      }
    }
  }

  const handleSubmit = () => {
    if (isAnswered) {
      setSubmitted(true)
    }
  }

  const handleNext = () => {
    setSubmitted(false)
    onNext()
  }

  return (
    <Card className="glass-effect border-border/50 h-full flex flex-col">
      <CardHeader className="border-b border-border/50 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </h3>
            <div className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </div>
          </div>
          <p className="text-xl font-bold text-foreground leading-relaxed">
            {question.question}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pt-6 space-y-4">
        {isMathQuestion ? (
          // Math Question Mode
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-blue-600">Math Question</p>
              <Button
                onClick={() => setShowMathKeyboard(!showMathKeyboard)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                {showMathKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
              </Button>
            </div>
            
            {showMathKeyboard ? (
              <MathInput
                value={selectedAnswer as string || ''}
                onChange={onAnswerSelect}
                placeholder="Enter your mathematical answer..."
              />
            ) : (
              <Input
                value={selectedAnswer as string || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAnswerSelect(e.target.value)}
                placeholder="Type your answer..."
                className="w-full"
              />
            )}
          </div>
        ) : (
          // Multiple Choice Mode
          <RadioGroup
            value={selectedAnswer !== null && selectedAnswer !== undefined ? String(selectedAnswer) : ''}
            onValueChange={handleAnswerSelect}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = String(selectedAnswer) === String(index)
                const optionIsCorrect = String(question.correctAnswer) === String(index)
                const shouldShowCorrect = submitted && showFeedback && optionIsCorrect
                const shouldShowIncorrect = submitted && showFeedback && isSelected && !isCorrect

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      submitted && showFeedback
                        ? shouldShowCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : shouldShowIncorrect
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-border/50 bg-background'
                        : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <RadioGroupItem value={String(index)} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-grow cursor-pointer font-medium"
                    >
                      {option}
                    </Label>
                    {submitted && showFeedback && shouldShowCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {submitted && showFeedback && shouldShowIncorrect && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        )}

        {submitted && showFeedback && question.explanation && (
          <div className={`p-4 rounded-lg border-l-4 ${
            isCorrect
              ? 'border-green-500 bg-green-500/10'
              : 'border-orange-500 bg-orange-500/10'
          }`}>
            <p className="text-sm font-semibold mb-2">
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Explanation: </span>
              {question.explanation}
            </p>
          </div>
        )}

        {!submitted && isAnswered && !showFeedback && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
            <p className="text-sm text-blue-600 font-medium">
              Answer selected. Click submit to see feedback.
            </p>
          </div>
        )}
      </CardContent>

      <div className="border-t border-border/50 p-6 space-y-3">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!isAnswered}
            className="w-full glow-effect"
            size="lg"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canGoForward}
            className="w-full glow-effect"
            size="lg"
          >
            {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
          </Button>
        )}

        {canGoBack && (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Previous Question
          </Button>
        )}
      </div>
    </Card>
  )
}
