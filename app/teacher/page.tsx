"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Brain, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"
import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherStats } from "@/components/teacher/teacher-stats"
import { QuizManagement } from "@/components/teacher/quiz-management"
import { StudentAnalytics } from "@/components/teacher/student-analytics"
import { ClassOverview } from "@/components/teacher/class-overview"
import { QuickNavigation } from "@/components/navigation/quick-navigation"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

type TeacherStatsState = {
  totalQuizzes: number
  totalStudents: number
  activeClasses: number
  averageScore: number
  totalAttempts: number
  thisWeekAttempts: number
}

type TeacherUser = {
  id: string
  name: string
  email: string
  role: "teacher" | "student" | "admin"
  subject?: string
  school?: string
  avatar?: string
}

type StudentSummary = {
  id: string
  name: string
  email: string
  level?: string
  averageScore: number
}

type ClassData = {
  id: string
  name: string
  students: number
  level: string
  subject: string
  avgScore: number
  activeQuizzes: number
}

type QuizSummary = {
  id: string
  title: string
  subject: string
  level: string
  students: number
  avgScore: number
  created: string
  status: "active" | "draft" | "archived"
}

export default function TeacherDashboard() {
  const router = useRouter()
  const baseUrl = getBaseUrl ? getBaseUrl() : ""

  const [teacher, setTeacher] = useState<TeacherUser | null>(null)
  const [stats, setStats] = useState<TeacherStatsState | null>(null)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Auth guard and basic teacher info from client auth
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/auth')
      return
    }

    if (user.role === 'student') {
      router.push('/dashboard')
      return
    }

    if (user.role === 'admin') {
      router.push('/admin')
      return
    }

    // We only get here if the user is a teacher
    setTeacher({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'teacher',
      subject: user.level || 'Teacher',
      school: '',
      avatar: user.avatar || '/teacher-avatar.png',
    })
  }, [router])

  // Refresh data function
  const refreshData = async () => {
    if (!teacher) return
    setError(null)
    setLoading(true)
    try {
      // 1) Fetch full teacher record (for school, etc.)
      // 2) Fetch teacher analytics
      // 3) Fetch students 
      // 4) Fetch teacher's quizzes
      const [teacherRes, analyticsRes, studentsRes, quizzesRes] = await Promise.all([
        fetch(`${baseUrl}/api/user?userId=${encodeURIComponent(teacher.id)}`),
        fetch(`${baseUrl}/api/teacher/analytics?teacherId=${encodeURIComponent(teacher.id)}`),
        fetch(`${baseUrl}/api/teacher/students?teacherId=${encodeURIComponent(teacher.id)}`),
        fetch(`${baseUrl}/api/teacher/quizzes?teacherId=${encodeURIComponent(teacher.id)}`),
      ])

      if (teacherRes.ok) {
        const data = await teacherRes.json()
        const t = data.user as any
        setTeacher((prev) =>
          prev
            ? {
                ...prev,
                school: t?.school || prev.school,
                subject: prev.subject || t?.level || 'Teacher',
              }
            : prev,
        )
      }

      // Fetch real analytics
      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setStats(data.stats)
      }

      let studentSummaries: StudentSummary[] = []
      if (studentsRes.ok) {
        const data = await studentsRes.json()
        const allStudents = (data.students || []) as any[]
        studentSummaries = allStudents.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          level: u.level,
          averageScore: u.averageScore ?? 0,
        }))
        setStudents(studentSummaries)
      }

      if (quizzesRes.ok) {
        const data = await quizzesRes.json()
        const items = (data.quizzes || []) as any[]
        const teacherQuizzes: QuizSummary[] = items.map((q) => ({
          id: q.id,
          title: q.title,
          subject: q.subject,
          level: q.level,
          students: q.students,
          avgScore: q.avgScore,
          created: q.created,
          status: q.status,
        }))
        setQuizzes(teacherQuizzes)
      }

      // Derive pseudo class/group overview from student levels
      const classMap = new Map<string, ClassData>()
      for (const s of studentSummaries) {
        const lvl = s.level || 'Unknown'
        if (!classMap.has(lvl)) {
          classMap.set(lvl, {
            id: lvl,
            name: `${lvl} Class`,
            students: 0,
            level: lvl,
            subject: teacher?.subject || 'General',
            avgScore: 0,
            activeQuizzes: 0,
          })
        }
        const entry = classMap.get(lvl)!
        entry.students += 1
        entry.avgScore += s.averageScore || 0
      }
      const classList: ClassData[] = Array.from(classMap.values()).map((c) => ({
        ...c,
        avgScore: c.students > 0 ? Math.round(c.avgScore / c.students) : 0,
      }))
      setClasses(classList)
      setLastRefresh(new Date())
    } catch (err) {
      setError("Failed to refresh data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when teacher is available
  useEffect(() => {
    if (!teacher) return
    
    const fetchData = async () => {
      if (!teacher) return
      setLoading(true)
      try {
        // 1) Fetch full teacher record (for school, etc.)
        // 2) Fetch teacher analytics
        // 3) Fetch students 
        // 4) Fetch teacher's quizzes
        const [teacherRes, analyticsRes, studentsRes, quizzesRes] = await Promise.all([
          fetch(`${baseUrl}/api/user?userId=${encodeURIComponent(teacher.id)}`),
          fetch(`${baseUrl}/api/teacher/analytics?teacherId=${encodeURIComponent(teacher.id)}`),
          fetch(`${baseUrl}/api/teacher/students?teacherId=${encodeURIComponent(teacher.id)}`),
          fetch(`${baseUrl}/api/teacher/quizzes?teacherId=${encodeURIComponent(teacher.id)}`),
        ])

        if (teacherRes.ok) {
          const data = await teacherRes.json()
          const t = data.user as any
          setTeacher((prev) =>
            prev
              ? {
                  ...prev,
                  school: t?.school || prev.school,
                  subject: prev.subject || t?.level || 'Teacher',
                }
              : prev,
          )
        }

        // Fetch real analytics
        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          setStats(data.stats)
        }

        let studentSummaries: StudentSummary[] = []
        if (studentsRes.ok) {
          const data = await studentsRes.json()
          const allStudents = (data.students || []) as any[]
          studentSummaries = allStudents.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            level: u.level,
            averageScore: u.averageScore ?? 0,
          }))
          setStudents(studentSummaries)
        }

        if (quizzesRes.ok) {
          const data = await quizzesRes.json()
          const items = (data.quizzes || []) as any[]
          const teacherQuizzes: QuizSummary[] = items.map((q) => ({
            id: q.id,
            title: q.title,
            subject: q.subject,
            level: q.level,
            students: q.students,
            avgScore: q.avgScore,
            created: q.created,
            status: q.status,
          }))
          setQuizzes(teacherQuizzes)
        }

        // If analytics failed, calculate basic stats
        if (!analyticsRes.ok && stats === null) {
          const totalStudents = studentSummaries.length
          const activeClassesSet = new Set(studentSummaries.map((s) => s.level).filter(Boolean) as string[])
          const activeClasses = activeClassesSet.size
          const averageScore =
            studentSummaries.length > 0
              ? Math.round(
                  studentSummaries.reduce((sum, s) => sum + (s.averageScore || 0), 0) /
                    studentSummaries.length,
                )
              : 0

          const teacherStats: TeacherStatsState = {
            totalQuizzes: quizzes.length,
            totalStudents,
            activeClasses,
            averageScore,
            totalAttempts: 0,
            thisWeekAttempts: 0,
          }
          setStats(teacherStats)
        }

        // Derive pseudo class/group overview from student levels
        const classMap = new Map<string, ClassData>()
        for (const s of studentSummaries) {
          const lvl = s.level || 'Unknown'
          if (!classMap.has(lvl)) {
            classMap.set(lvl, {
              id: lvl,
              name: `${lvl} Class`,
              students: 0,
              level: lvl,
              subject: teacher?.subject || 'General',
              avgScore: 0,
              activeQuizzes: 0,
            })
          }
          const entry = classMap.get(lvl)!
          entry.students += 1
          entry.avgScore += s.averageScore || 0
        }
        const classList: ClassData[] = Array.from(classMap.values()).map((c) => ({
          ...c,
          avgScore: c.students > 0 ? Math.round(c.avgScore / c.students) : 0,
        }))
        setClasses(classList)
        setLastRefresh(new Date())
      } catch (error) {
        console.error("Error fetching teacher data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teacher, baseUrl])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!teacher) return
    
    const interval = setInterval(() => {
      refreshData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [teacher])

  return (
    <div className="min-h-screen gradient-bg">
      {teacher && (
        <TeacherHeader
          teacher={{
            name: teacher.name,
            email: teacher.email,
            subject: teacher.subject || 'Teacher',
            school: teacher.school || 'My School',
            avatar: teacher.avatar || '/teacher-avatar.png',
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">
                  {teacher ? `Welcome back, ${teacher.name.split(" ")[0]}!` : 'Welcome, Teacher!'}
                </h1>
                <p className="text-muted-foreground">Manage your classes and track student progress on Qouta</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="glow-effect" size="lg">
                  <Link href="/quix-editor">
                    <Brain className="h-5 w-5 mr-2" />
                    Quix Editor
                  </Link>
                </Button>
                <Button asChild className="glow-effect" size="lg">
                  <Link href="/teacher/quiz/create">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Quiz
                  </Link>
                </Button>
              </div>
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
          {stats && <TeacherStats stats={stats} />}

          <div className="grid lg:grid-cols-4 gap-8 mt-8">
            {/* Sidebar with Quick Navigation */}
            <div className="lg:col-span-1">
              <QuickNavigation />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Quiz Management */}
              <QuizManagement quizzes={quizzes} />

              {/* Student Analytics */}
              <StudentAnalytics students={students} />
            </div>
          </div>

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
  )
}
