'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { SelectionCard } from '@/components/quiz/SelectionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

interface Course {
  _id: string
  name: string
  code?: string
  description?: string
  unitCount?: number
  levelId?: string
}

interface PageProps {
  params: { level: string }
}

export default function SelectCoursePage({ params }: PageProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [levelName, setLevelName] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const levelId = decodeURIComponent(params.level)

  useEffect(() => {
    fetchCourses()
  }, [levelId])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/courses?levelId=${encodeURIComponent(levelId)}`)
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses || [])
        setLevelName(data.levelName || 'Your Level')
      }
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <QuizBreadcrumb
            steps={[
              { label: 'Select Level', href: '/quiz' },
              { label: 'Select Course', active: true },
            ]}
          />

          {/* Header */}
          <div className="mb-12">
            <Button
              asChild
              variant="ghost"
              className="mb-6"
            >
              <Link href="/quiz" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Levels
              </Link>
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="h-10 w-10 text-primary glow-text" />
                <h1 className="text-4xl font-bold glow-text">Select a Course</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from available subjects for <span className="font-semibold text-foreground">{levelName}</span>
              </p>
            </div>
          </div>

          {/* Course Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <SelectionCard
                key={course._id}
                option={{
                  id: course._id,
                  name: course.name,
                  description: course.description,
                  count: course.unitCount,
                  icon: <BookOpen className="h-6 w-6" />,
                }}
                href={`/quiz/unit/${encodeURIComponent(course._id)}?level=${encodeURIComponent(levelId)}`}
                variant="compact"
                selected={selectedCourse === course._id}
                onSelect={setSelectedCourse}
              />
            ))}
          </div>

          {courses.length === 0 && (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses available</h3>
                <p className="text-muted-foreground mb-6">No courses found for this level</p>
                <Button asChild>
                  <Link href="/quiz">Choose Another Level</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
