'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'

interface Quiz {
  _id: string
  title: string
}

export default function SearchQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const unit = searchParams.get('unit') || ''
  const unitId = searchParams.get('unitId') || ''
  const course = searchParams.get('course') || ''
  const courseId = searchParams.get('courseId') || ''
  const level = searchParams.get('level') || ''
  const levelId = searchParams.get('levelId') || ''
  const difficulty = searchParams.get('difficulty') || ''

  useEffect(() => {
    const findAndRedirectToQuiz = async () => {
      try {
        setLoading(true)
        const baseUrl = getBaseUrl()

        // Build query with ID-based filters if available, fallback to name-based
        const params = new URLSearchParams()
        if (unitId) params.set('unitId', unitId)
        if (unit) params.set('unit', unit)
        if (courseId) params.set('courseId', courseId)
        if (course) params.set('course', course)
        if (levelId) params.set('levelId', levelId)
        if (level) params.set('level', level)
        if (difficulty) params.set('difficulty', difficulty)

        const res = await fetch(`${baseUrl}/api/quiz?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          const quizzes: Quiz[] = data.quizzes || []
          if (quizzes.length > 0) {
            router.push(`/quiz/play/${quizzes[0]._id}`)
            return
          }
        }

        setError('No quiz found for the selected criteria')
      } catch (err) {
        console.error('Failed to find quiz:', err)
        setError('Failed to find quiz. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    findAndRedirectToQuiz()
  }, [difficulty, unit, unitId, course, courseId, level, levelId, router])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Finding a quiz for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <Card className="glass-effect border-border/50 max-w-md">
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Quiz Found</h3>
          <p className="text-muted-foreground mb-6">
            {error || 'No quiz found for the selected criteria. Please try another combination.'}
          </p>
          <Button asChild>
            <Link href="/quiz">Back to Quiz Selection</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
