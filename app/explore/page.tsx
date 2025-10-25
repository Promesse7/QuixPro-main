"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, TrendingUp, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { getBaseUrl } from "@/lib/getBaseUrl"
import { useGuestSession } from "@/hooks/useGuestSession"

export default function ExplorePage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const { isGuest } = useGuestSession()

  useEffect(() => {
    fetchAllCourses()
  }, [])

  const fetchAllCourses = async () => {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/explore/courses?limit=12`)
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-white text-2xl font-bold">Qouta</span>
            </Link>
            
            {isGuest && (
              <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Link href="/auth">Sign Up Free</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Browse through our collection of courses aligned with African education systems
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="P1">Primary 1-6</SelectItem>
                  <SelectItem value="S1">Secondary 1-3</SelectItem>
                  <SelectItem value="S4">Secondary 4-6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-white/70">
              Showing <strong className="text-white">{filteredCourses.length}</strong> courses
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course: any, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all group h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">
                      {course.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                        {course.level || "All Levels"}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {course.difficulty || "Moderate"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60 mb-6">
                      {course.description || "Comprehensive course covering essential topics"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-white/50 mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimatedHours || 20}hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount || 0} enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{course.averageRating || 4.5}★</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-0 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500"
                    >
                      <Link href={`/explore/course/${course._id}`}>
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Bottom CTA */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to start your learning journey?
            </h3>
            <p className="text-white/70 mb-6">
              Create a free account to save your progress, earn certificates, and compete on leaderboards
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg"
            >
              <Link href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}