import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuizDoc {
  _id: string
  title: string
  questions?: Array<{
    question: string
    options: string[]
    correctAnswer?: number
    explanation?: string
  }>
  duration?: number
}

async function getQuizById(id: string): Promise<QuizDoc | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/quiz/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.quiz || null
}

export default async function PlayQuizPage({ params }: { params: { quizId: string } }) {
  const quiz = await getQuizById(params.quizId)
  if (!quiz) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">Duration: {quiz.duration || 0} min</p>
          <div className="text-sm text-muted-foreground">Implement question renderer here.</div>
          <div className="mt-6">
            <Button disabled>Submit (coming soon)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


