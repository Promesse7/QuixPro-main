"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, FileText, Target, Award, Play, Settings, BookOpen, Timer } from "lucide-react"

// Mock exam simulation data
const mockExamTemplates = [
  {
    id: "1",
    title: "O-Level Mathematics Final Exam",
    level: "S3",
    subject: "Mathematics",
    duration: 180, // minutes
    questions: 50,
    format: "Multiple Choice + Essays",
    difficulty: "Standard",
    description: "Complete simulation of Rwanda's O-Level Mathematics final examination",
    topics: ["Algebra", "Geometry", "Statistics", "Trigonometry"],
    attempts: 1250,
    averageScore: 72,
  },
  {
    id: "2",
    title: "A-Level Physics Mock Exam",
    level: "S5",
    subject: "Physics",
    duration: 150,
    questions: 40,
    format: "Mixed Format",
    difficulty: "Advanced",
    description: "Comprehensive A-Level Physics examination covering all major topics",
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Modern Physics"],
    attempts: 890,
    averageScore: 68,
  },
  {
    id: "3",
    title: "English Language Proficiency Test",
    level: "S4",
    subject: "English",
    duration: 120,
    questions: 60,
    format: "Multiple Choice",
    difficulty: "Intermediate",
    description: "Test your English language skills with this comprehensive assessment",
    topics: ["Grammar", "Vocabulary", "Reading Comprehension", "Writing"],
    attempts: 2100,
    averageScore: 78,
  },
]

const mockUserProgress = {
  totalExams: 12,
  completedExams: 8,
  averageScore: 82,
  bestSubject: "Mathematics",
  improvementNeeded: "Physics",
  timeSpent: "24h 30m",
  certificates: 3,
}

export default function ExamSimulationPage() {
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const filteredExams = mockExamTemplates.filter((exam) => {
    const matchesLevel = selectedLevel === "all" || exam.level === selectedLevel
    const matchesSubject = selectedSubject === "all" || exam.subject === selectedSubject
    return matchesLevel && matchesSubject
  })

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold glow-text mb-4">Exam Simulation Mode</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practice with full-length mock exams that mirror Rwanda's O-Level and A-Level formats. Build confidence
              and improve your test-taking skills.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-border/50">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold glow-text">{mockUserProgress.completedExams}</div>
                <div className="text-sm text-muted-foreground">Exams Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border/50">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold glow-text">{mockUserProgress.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border/50">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold glow-text">{mockUserProgress.timeSpent}</div>
                <div className="text-sm text-muted-foreground">Time Practiced</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border/50">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold glow-text">{mockUserProgress.certificates}</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-48 glass-effect">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="S1">S1 (O-Level)</SelectItem>
                    <SelectItem value="S2">S2 (O-Level)</SelectItem>
                    <SelectItem value="S3">S3 (O-Level)</SelectItem>
                    <SelectItem value="S4">S4 (A-Level)</SelectItem>
                    <SelectItem value="S5">S5 (A-Level)</SelectItem>
                    <SelectItem value="S6">S6 (A-Level)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48 glass-effect">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Exam Templates */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="feature-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl glow-text mb-2">{exam.title}</CardTitle>
                      <CardDescription>{exam.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{exam.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.difficulty}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exam.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{exam.attempts} students attempted</span>
                    <span>Avg: {exam.averageScore}%</span>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-border/50">
                    <Button className="flex-1 glow-effect">
                      <Play className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                    <Button variant="outline" size="icon" className="glass-effect bg-transparent">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Insights */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="glow-text">Performance Insights</CardTitle>
              <CardDescription>Track your progress and identify areas for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Subject Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mathematics</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2 glow-effect" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>English</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2 glow-effect" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Physics</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2 glow-effect" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <p className="font-medium">Focus on Physics</p>
                      <p className="text-muted-foreground">Your weakest subject. Practice more mechanics problems.</p>
                    </div>
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <p className="font-medium">Time Management</p>
                      <p className="text-muted-foreground">You're spending too much time on easy questions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
