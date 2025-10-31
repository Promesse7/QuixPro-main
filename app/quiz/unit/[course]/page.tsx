import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UnitDoc {
  _id: string
  name?: string
  title?: string
  description?: string
}

async function getUnits(course: string, level?: string): Promise<UnitDoc[]> {
  const qs = new URLSearchParams()
  qs.set("course", course)
  if (level) qs.set("level", level)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/units?${qs.toString()}`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.units || []
}

export default async function SelectUnitPage({ params, searchParams }: { params: { course: string }, searchParams: { level?: string } }) {
  const course = decodeURIComponent(params.course)
  const level = searchParams?.level
  const units = await getUnits(course, level)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Select a unit in {course}{level ? ` · ${level}` : ""}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const unitName = unit.name || unit.title || "Unit"
          const href = `/quiz/difficulty/${encodeURIComponent(unitName)}?course=${encodeURIComponent(course)}${level ? `&level=${encodeURIComponent(level)}` : ""}`
          return (
            <Card key={unit._id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{unitName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={href}>Select</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {units.length === 0 && <p className="text-muted-foreground">No units found.</p>}
    </div>
  )
}


