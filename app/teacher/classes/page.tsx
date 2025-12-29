"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, BarChart3, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface ClassData {
  id: string
  name: string
  students: number
  level: string
  subject: string
  avgScore: number
  activeQuizzes: number
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      fetchClasses()
    }
  }, [])

  const fetchClasses = async () => {
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/classes`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bgafil flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Teacher Dashboard', href: '/teacher' },
              { label: 'My Classes' }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">My Classes</h1>
                <p className="text-muted-foreground">Manage your classes and track student progress</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="glow-effect">
                  <Link href="/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button asChild className="glow-effect">
                  <Link href="/teacher/classes/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Class
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          {classes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl glow-text">{classItem.name}</CardTitle>
                        <p className="text-muted-foreground">{classItem.subject} • {classItem.level}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {classItem.students} students
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{classItem.avgScore}%</div>
                          <div className="text-xs text-muted-foreground">Avg Score</div>
                        </div>
                        <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-orange-500">{classItem.activeQuizzes}</div>
                          <div className="text-xs text-muted-foreground">Active Quizzes</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/teacher/classes/${classItem.id}`}>
                            <Users className="h-4 w-4 mr-2" />
                            Students
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/teacher/classes/${classItem.id}/analytics`}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first class to start managing students and tracking progress.
                </p>
                <Button asChild className="glow-effect">
                  <Link href="/teacher/classes/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Class
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
