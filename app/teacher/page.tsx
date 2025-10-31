"use client"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Brain, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"
import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherStats } from "@/components/teacher/teacher-stats"
import { QuizManagement } from "@/components/teacher/quiz-management"
import { StudentAnalytics } from "@/components/teacher/student-analytics"
import { ClassOverview } from "@/components/teacher/class-overview"
import { getCurrentUser } from "@/lib/auth"
// Mock teacher data
const mockTeacher = {
  id: "t1",
  name: "Jean Baptiste Nzeyimana",
  email: "jean.nzeyimana@teacher.rw",
  role: "teacher",
  subject: "Mathematics",
  school: "Kigali Secondary School",
  avatar: "/teacher-avatar.png",
  joinedDate: "2023-08-15",
  stats: {
    totalQuizzes: 15,
    totalStudents: 120,
    activeClasses: 4,
    averageScore: 78,
    totalAttempts: 450,
    thisWeekAttempts: 32,
  },
  recentQuizzes: [
    {
      id: "q1",
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      level: "S3",
      students: 28,
      avgScore: 82,
      created: "2024-01-10",
      status: "active",
    },
    {
      id: "q2",
      title: "Geometry Basics",
      subject: "Mathematics",
      level: "S3",
      students: 25,
      avgScore: 75,
      created: "2024-01-08",
      status: "active",
    },
    {
      id: "q3",
      title: "Number Theory",
      subject: "Mathematics",
      level: "S6",
      students: 22,
      avgScore: 88,
      created: "2024-01-05",
      status: "draft",
    },
  ],
  classes: [
    {
      id: "c1",
      name: "S3 Mathematics A",
      students: 30,
      level: "S3",
      subject: "Mathematics",
      avgScore: 79,
      activeQuizzes: 3,
    },
    {
      id: "c2",
      name: "S3 Mathematics B",
      students: 28,
      level: "S3",
      subject: "Mathematics",
      avgScore: 81,
      activeQuizzes: 2,
    },
    {
      id: "c3",
      name: "S6 Advanced Math",
      students: 24,
      level: "S6",
      subject: "Mathematics",
      avgScore: 85,
      activeQuizzes: 4,
    },
  ],
}

export default function TeacherDashboard() {
  // Add at the top of component
useEffect(() => {
  const user = getCurrentUser()
  if (!user) {
    router.push('/auth')
  } else if (user.role !== 'teacher') {
    router.push('/dashboard')
  }
}, [])
  return (
    <div className="min-h-screen gradient-bg">
      <TeacherHeader teacher={mockTeacher} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">Welcome back, {mockTeacher.name.split(" ")[0]}!</h1>
                <p className="text-muted-foreground">Manage your classes and track student progress on Qouta</p>
              </div>
              <Button asChild className="glow-effect" size="lg">
                <Link href="/teacher/quiz/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Quiz
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardContent className="p-4">
                <Button asChild variant="ghost" className="h-auto p-0 w-full">
                  <Link href="/teacher/quiz/create" className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">Create Quiz</p>
                      <p className="text-xs text-muted-foreground">Build new assessment</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardContent className="p-4">
                <Button asChild variant="ghost" className="h-auto p-0 w-full">
                  <Link href="/teacher/classes" className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">Manage Classes</p>
                      <p className="text-xs text-muted-foreground">View student progress</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardContent className="p-4">
                <Button asChild variant="ghost" className="h-auto p-0 w-full">
                  <Link href="/teacher/analytics" className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">Analytics</p>
                      <p className="text-xs text-muted-foreground">Performance insights</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardContent className="p-4">
                <Button asChild variant="ghost" className="h-auto p-0 w-full">
                  <Link href="/teacher/resources" className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">Resources</p>
                      <p className="text-xs text-muted-foreground">Teaching materials</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <TeacherStats stats={mockTeacher.stats} />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quiz Management */}
              <QuizManagement quizzes={mockTeacher.recentQuizzes} />

              {/* Student Analytics */}
              <StudentAnalytics />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Class Overview */}
              <ClassOverview classes={mockTeacher.classes} />

              {/* Recent Activity */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">New quiz attempt</p>
                      <p className="text-xs text-muted-foreground">Algebra Fundamentals - 5 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Student joined class</p>
                      <p className="text-xs text-muted-foreground">S3 Mathematics A - 1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Class average improved</p>
                      <p className="text-xs text-muted-foreground">S6 Advanced Math - 2 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Teaching Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <p className="font-medium text-sm mb-1">💡 Engagement Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Use voice commands in quizzes to make learning more interactive for students.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <p className="font-medium text-sm mb-1">📊 Analytics Insight</p>
                    <p className="text-xs text-muted-foreground">
                      Questions with low success rates may need clearer explanations.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <p className="font-medium text-sm mb-1">🎯 Best Practice</p>
                    <p className="text-xs text-muted-foreground">
                      Create quizzes with 10-15 questions for optimal student engagement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
