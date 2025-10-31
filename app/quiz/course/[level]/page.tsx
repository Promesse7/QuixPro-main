import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CourseDoc {
  _id: string
  name: string
  code?: string
  description?: string
}

async function getCourses(level: string): Promise<CourseDoc[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/courses?level=${encodeURIComponent(level)}`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.courses || []
}

export default async function SelectCoursePage({ params }: { params: { level: string } }) {
  const level = decodeURIComponent(params.level)
  const courses = await getCourses(level)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Select a course for level {level}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course._id} className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/quiz/unit/${encodeURIComponent(course.name)}?level=${encodeURIComponent(level)}`}>Select</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {courses.length === 0 && <p className="text-muted-foreground">No courses found.</p>}
    </div>
  )
}


