"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Clock, Users, Search, Filter, Play, Star } from "lucide-react"
import Link from "next/link"

// Mock quiz data
const mockQuizzes = [
  {
    id: "1",
    title: "Rwanda History & Culture",
    subject: "Social Studies",
    level: "S3",
    description: "Test your knowledge of Rwanda's rich history and cultural heritage",
    questions: 15,
    duration: 20,
    difficulty: "Medium",
    rating: 4.8,
    attempts: 1250,
    tags: ["History", "Culture", "Independence"],
  },
  {
    id: "2",
    title: "Basic Mathematics",
    subject: "Mathematics",
    level: "P6",
    description: "Fundamental math concepts for primary level students",
    questions: 20,
    duration: 25,
    difficulty: "Easy",
    rating: 4.6,
    attempts: 2100,
    tags: ["Numbers", "Operations", "Geometry"],
  },
  {
    id: "3",
    title: "English Grammar Essentials",
    subject: "English",
    level: "S6",
    description: "Master advanced English grammar rules and usage",
    questions: 25,
    duration: 30,
    difficulty: "Hard",
    rating: 4.7,
    attempts: 890,
    tags: ["Grammar", "Syntax", "Writing"],
  },
  {
    id: "4",
    title: "Science Fundamentals",
    subject: "Science",
    level: "S3",
    description: "Basic principles of physics, chemistry, and biology",
    questions: 18,
    duration: 22,
    difficulty: "Medium",
    rating: 4.5,
    attempts: 1560,
    tags: ["Physics", "Chemistry", "Biology"],
  },
]

export default function QuizListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || quiz.subject === selectedSubject
    const matchesLevel = selectedLevel === "all" || quiz.level === selectedLevel
    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty

    return matchesSearch && matchesSubject && matchesLevel && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "Hard":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary glow-text" />
              <h1 className="text-4xl font-bold glow-text">Available Quizzes</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of CBC-aligned quizzes and test your knowledge
            </p>
          </div>

          {/* Filters */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Quizzes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-effect border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="P6">Primary 6 (P6)</SelectItem>
                      <SelectItem value="S3">Lower Secondary 3 (S3)</SelectItem>
                      <SelectItem value="S6">Upper Secondary 6 (S6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="glass-effect border-border/50 hover:glow-effect transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl glow-text">{quiz.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{quiz.subject}</Badge>
                        <Badge variant="outline">{quiz.level}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{quiz.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-pretty">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.attempts.toLocaleString()} attempts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <span className={`font-medium ${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {quiz.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button asChild className="w-full glow-effect">
                      <Link href={`/quiz/${quiz.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more quizzes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
