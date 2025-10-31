import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DIFFICULTIES = ["Easy", "Moderate", "Hard", "Expert"]

export default async function SelectDifficultyPage({ params, searchParams }: { params: { unit: string }, searchParams: { course?: string, level?: string } }) {
  const unit = decodeURIComponent(params.unit)
  const { course, level } = searchParams || {}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Select difficulty · {unit}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIFFICULTIES.map((d) => {
          const qs = new URLSearchParams()
          qs.set("unit", unit)
          if (course) qs.set("course", course)
          if (level) qs.set("level", level)
          qs.set("difficulty", d)
          return (
            <Card key={d} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{d}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link className="text-primary underline" href={`/quiz/play/search?${qs.toString()}`}>Continue</Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


