"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  text: string
  options: Array<{ id: string; text: string; correct: boolean }>
  explanation: string
  marks: number
}

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    duration: 20,
    isPublic: true,
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      text: "",
      options: [
        { id: "a", text: "", correct: false },
        { id: "b", text: "", correct: false },
        { id: "c", text: "", correct: false },
        { id: "d", text: "", correct: false },
      ],
      explanation: "",
      marks: 1,
    },
  ])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      text: "",
      options: [
        { id: "a", text: "", correct: false },
        { id: "b", text: "", correct: false },
        { id: "c", text: "", correct: false },
        { id: "d", text: "", correct: false },
      ],
      explanation: "",
      marks: 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)))
  }

  const updateOption = (questionId: string, optionId: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt)),
            }
          : q,
      ),
    )
  }

  const setCorrectAnswer = (questionId: string, correctOptionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) => ({
                ...opt,
                correct: opt.id === correctOptionId,
              })),
            }
          : q,
      ),
    )
  }

  const handleSave = () => {
    console.log("Saving quiz:", { quizData, questions })
    // In real app, this would save to backend
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/teacher">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold glow-text">Create New Quiz</h1>
                <p className="text-muted-foreground">Build an engaging assessment for your students</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="glass-effect bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} className="glow-effect">
                <Save className="h-4 w-4 mr-2" />
                Save Quiz
              </Button>
            </div>
          </div>

          {/* Quiz Settings */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="glow-text">Quiz Settings</CardTitle>
              <CardDescription>Configure your quiz details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    className="glass-effect border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={quizData.duration}
                    onChange={(e) => setQuizData({ ...quizData, duration: Number.parseInt(e.target.value) })}
                    className="glass-effect border-border/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this quiz covers"
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  className="glass-effect border-border/50"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={quizData.subject}
                    onValueChange={(value) => setQuizData({ ...quizData, subject: value })}
                  >
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                      <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={quizData.level} onValueChange={(value) => setQuizData({ ...quizData, level: value })}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P6">Primary 6 (P6)</SelectItem>
                      <SelectItem value="S3">Lower Secondary 3 (S3)</SelectItem>
                      <SelectItem value="S6">Upper Secondary 6 (S6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="glow-text">Questions</CardTitle>
                  <CardDescription>Add questions and multiple choice answers</CardDescription>
                </div>
                <Badge variant="secondary">{questions.length} questions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={question.id} className="p-6 bg-accent/20 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Question {questionIndex + 1}</h4>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                      placeholder="Enter your question"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      className="glass-effect border-border/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={option.correct}
                          onChange={() => setCorrectAnswer(question.id, option.id)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <Input
                            placeholder={`Option ${option.id.toUpperCase()}`}
                            value={option.text}
                            onChange={(e) => updateOption(question.id, option.id, "text", e.target.value)}
                            className="glass-effect border-border/50"
                          />
                        </div>
                        <Badge variant={option.correct ? "default" : "outline"} className="text-xs">
                          {option.correct ? "Correct" : "Option"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Explanation</Label>
                    <Textarea
                      placeholder="Explain why this is the correct answer"
                      value={question.explanation}
                      onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                      className="glass-effect border-border/50"
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addQuestion} variant="outline" className="w-full glass-effect bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
