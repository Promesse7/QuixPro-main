"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, Users, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ExploreCoursesProps {
  courses: any[]
  loading: boolean
}

export default function ExploreCourses({ courses, loading }: ExploreCoursesProps) {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Popular Courses
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Start learning with our most engaging courses. No signup required to browse!
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                        {course.level || "S3"}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {course.difficulty || "Moderate"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60 mb-6">
                      {course.description || "Comprehensive course covering all essential topics"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-white/50 mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimatedHours || 20}hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount || 0} students</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-0 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500"
                    >
                      <Link href={`/explore/course/${course._id}`}>
                        View Course
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white hover:border-black text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-xl backdrop-blur-lg"
          >
            <Link href="/explore">
              Browse All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}