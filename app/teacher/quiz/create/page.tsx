"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft, Save, Eye, Loader2, Brain, Clock } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface Question {
  id: string
  text: string
  options: Array<{ id: string; text: string; correct: boolean }>
  explanation: string
  marks: number
  difficulty: string
}

interface Level {
  _id: string
  name: string
}

interface Course {
  _id: string
  name: string
}

interface Unit {
  _id: string
  name: string
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Hierarchy data
  const [levels, setLevels] = useState<Level[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  // Quiz data
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    difficulty: "",
    duration: 20,
    levelId: "",
    courseId: "",
    unitId: "",
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
      difficulty: "medium",
    },
  ])

  // Load user and levels
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    fetchLevels()
  }, [])

  // Fetch levels
  const fetchLevels = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/quiz/levels`)
      if (response.ok) {
        const data = await response.json()
        setLevels(data.levels || [])
      }
    } catch (error) {
      console.error("Error fetching levels:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch courses when level changes
  useEffect(() => {
    if (quizData.levelId) {
      fetchCourses(quizData.levelId)
    }
  }, [quizData.levelId])

  // Fetch units when course changes
  useEffect(() => {
    if (quizData.courseId) {
      fetchUnits(quizData.courseId)
    }
  }, [quizData.courseId])

  const fetchCourses = async (levelId: string) => {
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/quiz/courses?levelId=${levelId}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const fetchUnits = async (courseId: string) => {
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/quiz/units?courseId=${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setUnits(data.units || [])
      }
    } catch (error) {
      console.error("Error fetching units:", error)
    }
  }

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
      difficulty: "medium",
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

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to create a quiz")
      return
    }

    // Validate form
    if (!quizData.title || !quizData.description || !quizData.difficulty || !quizData.levelId || !quizData.courseId || !quizData.unitId) {
      alert("Please fill in all quiz settings")
      return
    }

    // Validate questions
    const invalidQuestions = questions.filter(q => !q.text || q.options.some(opt => !opt.text))
    if (invalidQuestions.length > 0) {
      alert("Please complete all question text and options")
      return
    }

    const questionsWithoutCorrect = questions.filter(q => !q.options.some(opt => opt.correct))
    if (questionsWithoutCorrect.length > 0) {
      alert("Each question must have exactly one correct answer")
      return
    }

    try {
      setSaving(true)
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...quizData,
          questions,
          createdBy: user.id,
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        alert("Quiz created successfully!")
        router.push("/teacher")
      } else {
        alert(result.error || "Failed to create quiz")
      }
    } catch (error) {
      console.error("Error saving quiz:", error)
      alert("Failed to save quiz")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quiz builder...</p>
        </div>
      </div>
    )
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
              <Button onClick={handleSave} disabled={saving} className="glow-effect">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="20"
                    value={quizData.duration}
                    onChange={(e) => setQuizData({ ...quizData, duration: parseInt(e.target.value) || 20 })}
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
                  rows={3}
                />
              </div>

              {/* Hierarchy Selection */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={quizData.levelId} onValueChange={(value) => setQuizData({ ...quizData, levelId: value, courseId: "", unitId: "" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level._id} value={level._id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select 
                    value={quizData.courseId} 
                    onValueChange={(value) => setQuizData({ ...quizData, courseId: value, unitId: "" })}
                    disabled={!quizData.levelId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select 
                    value={quizData.unitId} 
                    onValueChange={(value) => setQuizData({ ...quizData, unitId: value })}
                    disabled={!quizData.courseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id.toString()}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={quizData.difficulty} onValueChange={(value) => setQuizData({ ...quizData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="application">Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold glow-text">Questions ({questions.length})</h2>
              <Button onClick={addQuestion} className="glow-effect">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="glass-effect border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select value={question.difficulty} onValueChange={(value) => updateQuestion(question.id, "difficulty", value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline">{question.marks} marks</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={questions.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                      placeholder="Enter your question here"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                              {option.id.toUpperCase()}
                            </span>
                            <Input
                              placeholder={`Option ${option.id.toUpperCase()}`}
                              value={option.text}
                              onChange={(e) => updateOption(question.id, option.id, "text", e.target.value)}
                            />
                          </div>
                          <Button
                            variant={option.correct ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCorrectAnswer(question.id, option.id)}
                            className={option.correct ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {option.correct ? "Correct" : "Mark Correct"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={question.marks}
                        onChange={(e) => updateQuestion(question.id, "marks", parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Explanation (Optional)</Label>
                      <Input
                        placeholder="Explain the correct answer"
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
