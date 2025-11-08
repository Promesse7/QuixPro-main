'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap } from 'lucide-react'
import { SelectionCard } from '@/components/quiz/SelectionCard'
import { QuizBreadcrumb } from '@/components/quiz/QuizBreadcrumb'

const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Perfect for beginners. Basic concepts and straightforward questions.',
    icon: '😊',
    color: 'from-green-500/20 to-transparent',
    badge: 'Recommended for starters',
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: 'Intermediate level. Requires understanding of core concepts.',
    icon: '💪',
    color: 'from-yellow-500/20 to-transparent',
    badge: 'Standard difficulty',
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Advanced questions. Tests deep understanding and application.',
    icon: '🔥',
    color: 'from-orange-500/20 to-transparent',
    badge: 'Challenging',
  },
  {
    id: 'application',
    name: 'Application',
    description: 'Real-world scenarios. Requires synthesis and critical thinking.',
    icon: '🚀',
    color: 'from-red-500/20 to-transparent',
    badge: 'Master level',
  },
]

interface PageProps {
  params: { unit: string }
}

export default function SelectDifficultyPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const unitId = decodeURIComponent(params.unit)
  const courseId = searchParams.get('course') || ''
  const levelId = searchParams.get('level') || ''

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
                Select the difficulty that matches your current skill level and get started with the quiz
              </p>
            </div>
          </div>

          {/* Difficulty Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {DIFFICULTIES.map((difficulty) => (
              <Link
                key={difficulty.id}
                href={`/quiz/play/search?unit=${encodeURIComponent(unitId)}&course=${encodeURIComponent(courseId)}&level=${encodeURIComponent(levelId)}&difficulty=${difficulty.id}`}
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                        {difficulty.badge}
                      </span>
                      <Button size="sm" className="glow-effect">
                        Start Quiz →
                      </Button>
                    </div>
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
                <li>✓ <span className="font-medium text-foreground">Expert</span> - For complete mastery and competitive prep</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
