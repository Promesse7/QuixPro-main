import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ResultDoc {
  _id: string
  score: number
  accuracy?: number
  timeSpent?: number
  difficulty?: string
}

async function getResult(id: string): Promise<ResultDoc | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/progress/result/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.result || null
}

export default async function ResultPage({ params }: { params: { resultId: string } }) {
  const result = await getResult(params.resultId)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-2">
              <p>Score: {result.score}</p>
              {result.accuracy !== undefined && <p>Accuracy: {result.accuracy}%</p>}
              {result.timeSpent !== undefined && <p>Time: {result.timeSpent}s</p>}
              {result.difficulty && <p>Difficulty: {result.difficulty}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground">Result not found.</p>
          )}
          <div className="mt-4 underline text-primary">
            <Link href="/dashboard">Go to dashboard</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


