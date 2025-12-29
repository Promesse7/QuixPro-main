'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap, Clock, Brain, Loader2 } from 'lucide-react'
import { SelectionCard } from '@/components/quiz/SelectionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'
import { useState, useEffect } from 'react'

// Database difficulty configurations
const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    description: 'Perfect for beginners. Basic concepts and straightforward questions.',
    icon: '😊',
    color: 'from-green-500/20 to-transparent',
    badge: 'Recommended for starters',
  },
  medium: {
    name: 'Moderate',
    description: 'Intermediate level. Requires understanding of core concepts.',
    icon: '💪',
    color: 'from-yellow-500/20 to-transparent',
    badge: 'Standard difficulty',
  },
  hard: {
    name: 'Hard',
    description: 'Advanced questions. Tests deep understanding and application.',
    icon: '🔥',
    color: 'from-orange-500/20 to-transparent',
    badge: 'Challenging',
  },
  application: {
    name: 'Application',
    description: 'Real-world scenarios. Requires synthesis and critical thinking.',
    icon: '🚀',
    color: 'from-red-500/20 to-transparent',
    badge: 'Master level',
  },
}

interface PageProps {
  params: { unit: string }
}

export default function SelectDifficultyPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const unitId = decodeURIComponent(params.unit)
  const courseId = searchParams?.get('course') || ''
  const levelId = searchParams?.get('level') || ''
  
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([])
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({})
  const [quizIds, setQuizIds] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [unitName, setUnitName] = useState('')
  const [courseName, setCourseName] = useState('')

  useEffect(() => {
    async function fetchDifficulties() {
      try {
        // Fetch available difficulties for this unit
        const response = await fetch(
          `/api/quiz/difficulties?unit=${encodeURIComponent(unitId)}&course=${encodeURIComponent(courseId)}&level=${encodeURIComponent(levelId)}`
        )
        
        if (response.ok) {
          const data = await response.json()
          setAvailableDifficulties(data.difficulties || [])
          setQuestionCounts(data.counts || {})
          setQuizIds(data.quizIds || {})
          setUnitName(data.unitName || unitId)
          setCourseName(data.courseName || courseId)
        }
      } catch (error) {
        console.error('Error fetching difficulties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDifficulties()
  }, [unitId, courseId, levelId])

  // Filter difficulties to only show available ones
  const difficulties = Object.entries(DIFFICULTY_CONFIG)
    .filter(([id]) => availableDifficulties.includes(id))
    .map(([id, config]) => ({
      id,
      ...config,
      questionCount: questionCounts[id] || 0,
      quizId: quizIds[id] || '',
    }))

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <QuizBreadcrumb
            steps={[
              { label: 'Select Level', href: '/quiz' },
              { label: 'Select Course', href: `/quiz/course/${encodeURIComponent(levelId)}` },
              { label: 'Select Unit', href: `/quiz/unit/${encodeURIComponent(courseId)}?level=${encodeURIComponent(levelId)}` },
              { label: 'Select Difficulty', active: true },
            ]}
          />

          {/* Header */}
          <div className="mb-12">
            <Button
              asChild
              variant="ghost"
              className="mb-6"
            >
              <Link
                href={`/quiz/unit/${encodeURIComponent(courseId)}?level=${encodeURIComponent(levelId)}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Units
              </Link>
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="h-10 w-10 text-primary glow-text" />
                <h1 className="text-4xl font-bold glow-text">Choose Your Challenge Level</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {unitName && <span className="font-semibold text-foreground">{unitName}</span>}
                {unitName && ' - '}Select the difficulty that matches your current skill level
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading difficulties...</span>
            </div>
          )}

          {/* No Difficulties Available */}
          {!loading && difficulties.length === 0 && (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No quiz difficulties available for this unit yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href={`/quiz/unit/${encodeURIComponent(courseId)}?level=${encodeURIComponent(levelId)}`}>
                    Back to Units
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Difficulty Selection Cards */}
          {!loading && difficulties.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {difficulties.map((difficulty) => (
                  <Link
                    key={difficulty.id}
                    href={`/quiz/play/${encodeURIComponent(difficulty.quizId)}`}
                    className="block h-full"
                  >
                    <Card className={`glass-effect border-border/50 hover:glow-effect transition-all duration-300 h-full bg-gradient-to-r ${difficulty.color}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-grow">
                            <CardTitle className="text-2xl">{difficulty.name}</CardTitle>
                            <CardDescription className="text-base">{difficulty.description}</CardDescription>
                          </div>
                          <span className="text-4xl ml-4">{difficulty.icon}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                            {difficulty.badge}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Brain className="h-3 w-3" />
                            <span>{difficulty.questionCount} questions</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full glow-effect">
                          Start Quiz →
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Tips Card */}
              <Card className="glass-effect border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>💡</span>
                    Choosing the Right Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ <span className="font-medium text-foreground">Easy</span> - Start here if you're new to this topic</li>
                    <li>✓ <span className="font-medium text-foreground">Moderate</span> - Choose this after mastering the basics</li>
                    <li>✓ <span className="font-medium text-foreground">Hard</span> - Challenge yourself with advanced questions</li>
                    <li>✓ <span className="font-medium text-foreground">Application</span> - Apply concepts to real-world scenarios</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}