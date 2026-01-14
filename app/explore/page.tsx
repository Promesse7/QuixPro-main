'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Search, Filter, Clock, Users, ArrowRight, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { useDebounce } from '@/hooks/useDebounce' // A custom hook for debouncing

// Assuming Course type is defined somewhere, let's define it for clarity
type Course = {
  _id: string
  name: string
  description: string
  level: string
  quizCount: number
  enrolledCount: number
}

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/api/explore/courses?limit=20`)
        const data = await res.json()
        setCourses(data.courses || [])
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
      return matchesSearch && matchesLevel
    })
  }, [courses, debouncedSearchTerm, selectedLevel])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
              <h1 className="text-2xl font-bold">Explore Courses</h1>
          </div>
      </header>
      
      <main className="container max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 w-full"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-56 h-11">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground"/>
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="P1-P6">Primary (P1-P6)</SelectItem>
              <SelectItem value="S1-S3">O-Level (S1-S3)</SelectItem>
              <SelectItem value="S4-S6">A-Level (S4-S6)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : filteredCourses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 rounded-lg border-2 border-dashed border-border">
            <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Courses Found</h3>
            <p className="text-muted-foreground">Your search for "{searchTerm}" in {selectedLevel} did not return any results.</p>
          </div>
        )}
      </main>
    </div>
  )
}

// --- Components --- //

const CourseCard = ({ course }: { course: Course }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  }

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
      <Link href={`/course/${course._id}`} className="block h-full">
        <div className="h-full rounded-2xl border bg-card p-6 flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg hover:border-primary/50">
          <div>
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <BookOpen className="w-4 h-4" />
                {course.level || 'General'}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{course.name}</h3>
            <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{course.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 mt-auto">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{course.enrolledCount || 0} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.quizCount || 0} Quizzes</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const CourseCardSkeleton = () => (
  <div className="rounded-2xl border bg-card p-6">
    <div className="animate-pulse">
      <div className="w-2/5 h-8 bg-muted rounded-md mb-4"></div>
      <div className="w-full h-6 bg-muted rounded-md mb-2"></div>
      <div className="w-4/5 h-6 bg-muted rounded-md"></div>
      <div className="mt-6 space-y-2">
        <div className="w-full h-4 bg-muted rounded-md"></div>
        <div className="w-2/3 h-4 bg-muted rounded-md"></div>
      </div>
      <div className="flex items-center justify-between border-t mt-6 pt-4">
        <div className="w-1/3 h-5 bg-muted rounded-md"></div>
        <div className="w-1/3 h-5 bg-muted rounded-md"></div>
      </div>
    </div>
  </div>
)
