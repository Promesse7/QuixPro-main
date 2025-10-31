import Link from "next/link"
import { redirect } from "next/navigation"

async function findQuiz(search: { unit?: string; course?: string; level?: string; difficulty?: string }) {
  const qs = new URLSearchParams()
  if (search.unit) qs.set("unit", search.unit)
  if (search.course) qs.set("course", search.course)
  if (search.level) qs.set("level", search.level)
  if (search.difficulty) qs.set("difficulty", search.difficulty)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/quiz?${qs.toString()}`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.quizzes || []
}

export default async function SearchQuizPage({ searchParams }: { searchParams: { unit?: string; course?: string; level?: string; difficulty?: string } }) {
  const quizzes = await findQuiz(searchParams)
  if (quizzes.length > 0) {
    redirect(`/quiz/play/${quizzes[0]._id}`)
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-muted-foreground">No quiz found for the selected criteria.</p>
      <div className="mt-4 underline text-primary">
        <Link href="/quiz">Back to quiz selection</Link>
      </div>
    </div>
  )
}


