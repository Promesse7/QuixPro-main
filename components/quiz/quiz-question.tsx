"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Lightbulb, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizOption {
  id: string
  text: string
  correct: boolean
}

interface QuizQuestionProps {
  question: {
    id: string
    text: string
    options: QuizOption[]
    explanation: string
    marks: number
  }
  selectedAnswer?: string
  showExplanation: boolean
  onAnswerSelect: (questionId: string, answerId: string) => void
  isVoiceMode?: boolean
}

export function QuizQuestion({
  question,
  selectedAnswer,
  showExplanation,
  onAnswerSelect,
  isVoiceMode = false,
}: QuizQuestionProps) {
  const [isListening, setIsListening] = useState(false)

  const handleVoiceCommand = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      // Mock voice selection - in real app this would use speech recognition
      const randomOption = question.options[Math.floor(Math.random() * question.options.length)]
      onAnswerSelect(question.id, randomOption.id)
    }, 2000)
  }

  const speakQuestion = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(question.text)
      speechSynthesis.speak(utterance)
    }
  }

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
            const isSelected = selectedAnswer === option.id
            const isCorrect = option.correct
            const showResult = showExplanation && isSelected

            return (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => !showExplanation && onAnswerSelect(question.id, option.id)}
                disabled={showExplanation}
                className={cn(
                  "h-auto p-4 text-left justify-start glass-effect border-border/50 transition-all duration-300",
                  isSelected && !showExplanation && "ring-2 ring-primary glow-effect",
                  showResult && isCorrect && "bg-green-500/20 border-green-500/50 text-green-400",
                  showResult && !isCorrect && "bg-red-500/20 border-red-500/50 text-red-400",
                  !isSelected && showExplanation && isCorrect && "bg-green-500/10 border-green-500/30",
                )}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                      isSelected && !showExplanation && "border-primary bg-primary/20",
                      showResult && isCorrect && "border-green-500 bg-green-500/20",
                      showResult && !isCorrect && "border-red-500 bg-red-500/20",
                      !isSelected && showExplanation && isCorrect && "border-green-500 bg-green-500/10",
                    )}
                  >
                    {showExplanation ? (
                      isCorrect ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        isSelected && <XCircle className="h-4 w-4" />
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
