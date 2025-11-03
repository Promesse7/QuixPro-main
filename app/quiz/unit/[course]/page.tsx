'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Layers, ArrowLeft } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { SelectionCard } from '@/components/quiz/SelectionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

interface Unit {
  _id: string
  title?: string
  name?: string
  description?: string
  topicCount?: number
  courseId?: string
}

interface PageProps {
  params: { course: string }
}

export default function SelectUnitPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [courseName, setCourseName] = useState<string>('')
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  const courseId = decodeURIComponent(params.course)
  const levelId = searchParams.get('level') || ''

  useEffect(() => {
    fetchUnits()
  }, [courseId])

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/units?courseId=${encodeURIComponent(courseId)}`)
      if (res.ok) {
        const data = await res.json()
        setUnits(data.units || [])
        setCourseName(data.courseName || courseId)
      }
    } catch (error) {
      console.error('Failed to load units:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading units...</p>
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
              { label: 'Select Course', href: `/quiz/course/${encodeURIComponent(levelId)}` },
              { label: 'Select Unit', active: true },
            ]}
          />

          {/* Header */}
          <div className="mb-12">
            <Button
              asChild
              variant="ghost"
              className="mb-6"
            >
              <Link href={`/quiz/course/${encodeURIComponent(levelId)}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Link>
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Layers className="h-10 w-10 text-primary glow-text" />
                <h1 className="text-4xl font-bold glow-text">Select a Unit</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose a topic from <span className="font-semibold text-foreground">{courseName}</span> to begin your practice
              </p>
            </div>
          </div>

          {/* Unit Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {units.map((unit) => {
              const unitTitle = unit.title || unit.name || 'Unit'
              return (
                <SelectionCard
                  key={unit._id}
                  option={{
                    id: unit._id,
                    name: unitTitle,
                    description: unit.description,
                    count: unit.topicCount,
                    icon: <Layers className="h-6 w-6" />,
                  }}
                  href={`/quiz/difficulty/${encodeURIComponent(unit._id)}?course=${encodeURIComponent(courseId)}&level=${encodeURIComponent(levelId)}`}
                  variant="compact"
                  selected={selectedUnit === unit._id}
                  onSelect={setSelectedUnit}
                />
              )
            })}
          </div>

          {units.length === 0 && (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No units available</h3>
                <p className="text-muted-foreground mb-6">No units found for this course</p>
                <Button asChild>
                  <Link href={`/quiz/course/${encodeURIComponent(levelId)}`}>Choose Another Course</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
