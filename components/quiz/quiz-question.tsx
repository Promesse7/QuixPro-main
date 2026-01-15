"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Lightbulb, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizOption {
  id: string
  text: string
  correct: boolean
}

export interface QuizQuestionType {
  id: string
  text: string
  options: QuizOption[]
  explanation: string
  marks: number
  type?: 'single' | 'multiple'
}

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedAnswers?: string[]
  showExplanation: boolean
  onAnswerSelect: (questionId: string, answerIds: string[]) => void
  isVoiceMode?: boolean
}

export function QuizQuestion({
  question,
  selectedAnswers = [],
  showExplanation,
  onAnswerSelect,
  isVoiceMode = false,
}: QuizQuestionProps) {
  const [isListening, setIsListening] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set(selectedAnswers))
  const isMultipleChoice = question.type === 'multiple'

  // Update selected options when selectedAnswers prop changes
  useEffect(() => {
    setSelectedOptions(new Set(selectedAnswers))
  }, [selectedAnswers])

  const handleOptionSelect = (optionId: string) => {
    const newSelected = new Set(selectedOptions)
    
    if (isMultipleChoice) {
      // Toggle selection for multiple choice
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId)
      } else {
        newSelected.add(optionId)
      }
    } else {
      // Single selection for single choice
      newSelected.clear()
      newSelected.add(optionId)
    }
    
    setSelectedOptions(newSelected)
    onAnswerSelect(question.id, Array.from(newSelected))
  }

  const handleVoiceCommand = () => {
    setIsListening(true)
    // In a real app, this would use speech recognition
    setTimeout(() => {
      setIsListening(false)
      const randomOption = question.options[Math.floor(Math.random() * question.options.length)]
      handleOptionSelect(randomOption.id)
    }, 2000)
  }

  const speakQuestion = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(question.text)
      speechSynthesis.speak(utterance)
    }
  }

  // Check if an option is selected
  const isSelected = (optionId: string) => selectedOptions.has(optionId)

  // Check if an option is correct (for showing results)
  const isCorrect = (option: QuizOption) => option.correct

  // Check if an option should be shown as correct (for showing results)
  const showAsCorrect = (option: QuizOption) => 
    showExplanation && isCorrect(option)

  // Check if an option should be shown as incorrect (for showing results)
  const showAsIncorrect = (option: QuizOption) => 
    showExplanation && isSelected(option.id) && !isCorrect(option)

  return (
    <Card className="glass-effect border-border/50 glow-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl glow-text flex items-center gap-2">
            <span>{question.text}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={speakQuestion}
              className="text-muted-foreground hover:text-primary"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </CardTitle>
          <Badge variant="secondary">
            {question.marks} point{question.marks !== 1 ? "s" : ""}
            {isMultipleChoice && " (Multiple)"}
          </Badge>
        </div>
        {isVoiceMode && (
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleVoiceCommand}
              disabled={isListening || showExplanation}
              className={`glass-effect ${isListening ? "voice-wave" : ""}`}
            >
              {isListening ? "Listening..." : "Voice Answer"}
            </Button>
            {isListening && (
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-8 bg-primary rounded-full voice-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {question.options.map((option) => {
            const selected = isSelected(option.id)
            const showCorrect = showAsCorrect(option)
            const showIncorrect = showAsIncorrect(option)

            return (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => !showExplanation && handleOptionSelect(option.id)}
                disabled={showExplanation}
                className={cn(
                  "h-auto p-4 text-left justify-start glass-effect border-border/50 transition-all duration-300 group",
                  selected && !showExplanation && "ring-2 ring-primary glow-effect",
                  showCorrect && "bg-green-500/20 border-green-500/50 text-green-400",
                  showIncorrect && "bg-red-500/20 border-red-500/50 text-red-400",
                  !selected && showExplanation && isCorrect(option) && "bg-green-500/10 border-green-500/30",
                )}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                      selected && !showExplanation && "border-primary bg-primary/20",
                      showCorrect && "border-green-500 bg-green-500/20",
                      showIncorrect && "border-red-500 bg-red-500/20",
                      !selected && showExplanation && isCorrect(option) && "border-green-500 bg-green-500/10",
                    )}
                  >
                    {showExplanation ? (
                      isCorrect(option) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        selected && <XCircle className="h-4 w-4" />
                      )
                    ) : (
                      option.id.toUpperCase()
                    )}
                  </div>
                  <span className="flex-1 text-base">{option.text}</span>
                </div>
              </Button>
            )
          })}
        </div>

        {showExplanation && (
          <Card className="bg-accent/50 border-accent glass-effect">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-accent-foreground mb-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
