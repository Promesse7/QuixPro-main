'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, BookOpen, Target, ArrowRight } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { SelectionCard } from '@/components/quiz/SelectionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

interface Level {
  _id: string
  name: string
  stage?: string
  code?: string
  description?: string
  courseCount?: number
}

export default function SelectLevelPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    try {
      setLoading(true)
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/levels`)
      if (res.ok) {
        const data = await res.json()
        setLevels(data.levels || [])
      }
    } catch (error) {
      console.error('Failed to load levels:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelIcon = (stage?: string) => {
    switch (stage?.toLowerCase()) {
      case 'primary':
        return <BookOpen className="h-6 w-6 text-blue-500" />
      case 'lower secondary':
        return <Target className="h-6 w-6 text-purple-500" />
      case 'upper secondary':
        return <GraduationCap className="h-6 w-6 text-orange-500" />
      default:
        return <BookOpen className="h-6 w-6 text-primary" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading levels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <QuizBreadcrumb steps={[{ label: 'Select Level', active: true }]} />

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-10 w-10 text-primary glow-text" />
              <h1 className="text-4xl font-bold glow-text">Select Your Education Level</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your education level to begin your personalized learning journey. We'll show you courses and quizzes tailored to your level.
            </p>
          </div>

          {/* Level Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {levels.map((level) => (
              <SelectionCard
                key={level._id}
                option={{
                  id: level._id,
                  name: level.name,
                  description: level.description || `${level.stage} level education`,
                  icon: getLevelIcon(level.stage),
                  count: level.courseCount,
                }}
                href={`/quiz/course/${encodeURIComponent(level._id)}`}
                variant="compact"
                selected={selectedLevel === level._id}
                onSelect={setSelectedLevel}
              />
            ))}
          </div>

          {levels.length === 0 && (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No levels available</h3>
                <p className="text-muted-foreground mb-6">Please check back later or contact support</p>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="glass-effect border-border/50 mt-8 bg-gradient-to-r from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Select your education level to begin</p>
                <p>✓ Choose a course that matches your subjects</p>
                <p>✓ Select specific units to practice</p>
                <p>✓ Pick your difficulty level and start the quiz</p>
                <p>✓ View detailed results and track your progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
