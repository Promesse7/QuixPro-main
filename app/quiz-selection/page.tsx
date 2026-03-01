"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, GraduationCap, Layers, Brain, Clock, Users } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { QuickStartCTA } from "@/components/app/QuickStartCTA"

interface Level {
  _id: string
  name: string
  stage: string
}

interface Course {
  _id: string
  name: string
  levelId: string
  displayName?: string
  subject?: string
  gradeLevel?: string
}

interface Unit {
  _id: string
  name: string
  courseId: string
  levelId: string
  description: string
}

interface Quiz {
  _id: string
  id: string
  title: string
  subject: string
  level: string
  description: string
  difficulty: string
  duration: number
  questions: any[]
}

export default function QuizSelectionPage() {
  const [user, setUser] = useState<any>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
  const [totalQuizzes, setTotalQuizzes] = useState<number>(0)
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedUnit, setSelectedUnit] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [isLoadingResume, setIsLoadingResume] = useState(true)

  const [loading, setLoading] = useState({
    levels: true,
    courses: false,
    units: false,
    quizzes: false,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    fetchLevels()
    // Fetch quiz count instead of all quizzes initially
    fetchQuizCount()
    // Only fetch all quizzes when filters are applied
    // fetchAllQuizzes()
    // Try preselect from resume info
    const preload = async () => {
      try {
        if (!currentUser?.id) {
          setIsLoadingResume(false)
          return
        }
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/user/resume?userId=${encodeURIComponent(currentUser.id)}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.lastLevelName) {
          setSelectedLevel(data.lastLevelName)
          await fetchCourses(data.lastLevelName)
        }
        if (data.lastCourseName) {
          setSelectedCourse(data.lastCourseName)
          await fetchUnits(data.lastLevelName || "", data.lastCourseName)
        }
        if (data.lastUnitName) {
          setSelectedUnit(data.lastUnitName)
          await fetchQuizzes(data.lastLevelName || "", data.lastCourseName || "", data.lastUnitName)
        }
      } catch (error) {
        console.error("Failed to load resume data:", error)
      } finally {
        setIsLoadingResume(false)
      }
    }
    preload()
  }, [])

  const fetchQuizCount = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/quizzes/count`)
      if (res.ok) {
        const data = await res.json()
        setTotalQuizzes(data.count || 0)
      }
    } catch (e) {
      console.error("Failed to load quiz count", e)
    }
  }

  const fetchAllQuizzes = async () => {
    try {
      setLoading(prev => ({ ...prev, quizzes: true }))
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/quiz?limit=100`) // Fetch all quizzes
      if (res.ok) {
        const data = await res.json()
        setAllQuizzes(data.quizzes || [])
        setQuizzes(data.quizzes || []) // Initially show all quizzes
      }
    } catch (e) {
      console.error("Failed to load all quizzes", e)
    } finally {
      setLoading(prev => ({ ...prev, quizzes: false }))
    }
  }

  // Filter quizzes based on selected criteria
  const filterQuizzes = () => {
    let filtered = [...allQuizzes]

    if (selectedLevel) {
      filtered = filtered.filter(quiz => quiz.level === selectedLevel)
    }
    if (selectedCourse) {
      filtered = filtered.filter(quiz => quiz.subject === selectedCourse)
    }
    if (selectedUnit) {
      // Note: This would need unit data in quiz object, for now filter by description containing unit name
      filtered = filtered.filter(quiz =>
        quiz.description.toLowerCase().includes(selectedUnit.toLowerCase())
      )
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty)
    }

    setQuizzes(filtered)
  }

  // Re-filter quizzes when any filter changes
  useEffect(() => {
    if (allQuizzes.length > 0) {
      filterQuizzes()
    }
  }, [selectedLevel, selectedCourse, selectedUnit, selectedDifficulty, allQuizzes])

  const fetchLevels = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/levels`)
      if (res.ok) {
        const data = await res.json()
        setLevels(data.levels || [])
      }
    } catch (e) {
      console.error("Failed to load levels", e)
    } finally {
      setLoading(prev => ({ ...prev, levels: false }))
    }
  }

  const fetchCourses = async (level: string) => {
    try {
      setLoading(prev => ({ ...prev, courses: true }))
      const baseUrl = getBaseUrl();

      // Find the level document first to get its ID
      const levelsRes = await fetch(`${baseUrl}/api/levels`)
      if (levelsRes.ok) {
        const levelsData = await levelsRes.json()
        const selectedLevelDoc = levelsData.levels.find((l: any) => l.name === level)

        if (selectedLevelDoc) {
          // Use levelId instead of level name
          const res = await fetch(`${baseUrl}/api/courses?levelId=${selectedLevelDoc._id}`)
          if (res.ok) {
            const data = await res.json()
            setCourses(data.courses || [])
          }
        }
      }
    } catch (e) {
      console.error("Failed to load courses", e)
    } finally {
      setLoading(prev => ({ ...prev, courses: false }))
    }
  }

  const fetchUnits = async (level: string, course: string) => {
    try {
      setLoading(prev => ({ ...prev, units: true }))
      const baseUrl = getBaseUrl();

      // Find course document to get its ID
      const coursesRes = await fetch(`${baseUrl}/api/courses`)
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        const selectedCourseDoc = coursesData.courses.find((c: any) => c.name === course)

        if (selectedCourseDoc) {
          const res = await fetch(`${baseUrl}/api/units?courseId=${selectedCourseDoc._id}&level=${level}`)
          if (res.ok) {
            const data = await res.json()
            setUnits(data.units || [])
          }
        }
      }
    } catch (e) {
      console.error("Failed to load units", e)
    } finally {
      setLoading(prev => ({ ...prev, units: false }))
    }
  }

  const fetchQuizzes = async (level: string, course: string, unit: string, difficulty?: string) => {
    try {
      setLoading(prev => ({ ...prev, quizzes: true }))
      const baseUrl = getBaseUrl();

      // Build query with proper IDs
      let url = `${baseUrl}/api/quiz?level=${level}&course=${course}`

      // Find unit document to get its ID
      if (unit) {
        const unitsRes = await fetch(`${baseUrl}/api/units?course=${course}&level=${level}`)
        if (unitsRes.ok) {
          const unitsData = await unitsRes.json()
          const selectedUnitDoc = unitsData.units.find((u: any) => u.name === unit)
          if (selectedUnitDoc) {
            url += `&unitId=${selectedUnitDoc._id}`
          }
        }
      }

      if (difficulty && difficulty !== "any") {
        url += `&difficulty=${difficulty}`
      }

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data.quizzes || [])
      }
    } catch (e) {
      console.error("Failed to load quizzes", e)
    } finally {
      setLoading(prev => ({ ...prev, quizzes: false }))
    }
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setSelectedCourse("")
    setSelectedUnit("")
    setSelectedDifficulty("")
    setCourses([])
    setUnits([])
    if (level) fetchCourses(level)
  }

  const handleCourseChange = (course: string) => {
    setSelectedCourse(course)
    setSelectedUnit("")
    setSelectedDifficulty("")
    setUnits([])
    if (course && selectedLevel) fetchUnits(selectedLevel, course)
  }

  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit)
    setSelectedDifficulty("")
    // Fetch quizzes when unit is selected
    if (unit && selectedLevel && selectedCourse) {
      fetchQuizzes(selectedLevel, selectedCourse, unit)
    }
  }

  const handleDifficultyChange = (difficulty: string) => {
    // Interpret "any" as no filter
    const finalDifficulty = difficulty === "any" ? "" : difficulty
    setSelectedDifficulty(finalDifficulty)
    // Fetch quizzes when difficulty changes
    if (selectedUnit && selectedLevel && selectedCourse) {
      fetchQuizzes(selectedLevel, selectedCourse, selectedUnit, finalDifficulty)
    }
  }


  // Safely render units only when they exist
  const renderUnits = () => {
    if (!units || units.length === 0) {
      return <p className="text-sm text-muted-foreground mt-2">No units available for this course</p>
    }

    return (
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit._id} value={unit.name}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Quiz Selection' }]} />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary glow-text" />
              <h1 className="text-4xl font-bold glow-text">Quiz Selection</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your level, course, and unit to find the perfect quiz for your learning journey
            </p>
          </div>

          <QuickStartCTA />

          {/* Selection Flow */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Level Selection */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Level</span>
                </CardTitle>
                <CardDescription>Select your education level</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLevel} onValueChange={handleLevelChange} disabled={loading.levels || isLoadingResume}>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder={isLoadingResume ? "Loading..." : "Choose level"} />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level._id} value={level.name}>
                        {level.name} - {level.stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(loading.courses || isLoadingResume) && <p className="text-sm text-muted-foreground mt-2">Loading courses...</p>}
              </CardContent>
            </Card>

            {/* Course Selection */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course</span>
                </CardTitle>
                <CardDescription>Select your subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCourse} onValueChange={handleCourseChange} disabled={!selectedLevel || loading.courses || isLoadingResume}>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder={isLoadingResume ? "Loading..." : "Choose course"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course.name}>
                        {course.displayName || course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(loading.units || isLoadingResume) && <p className="text-sm text-muted-foreground mt-2">Loading units...</p>}
              </CardContent>
            </Card>

            {/* Unit Selection */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Unit</span>
                </CardTitle>
                <CardDescription>Select a topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedUnit} onValueChange={handleUnitChange} disabled={!selectedCourse || isLoadingResume}>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder={isLoadingResume ? "Loading..." : "Choose unit"} />
                  </SelectTrigger>
                  {renderUnits()}
                </Select>
                {(loading.units || isLoadingResume) && <p className="text-sm text-muted-foreground mt-2">Loading units...</p>}
                {!loading.units && !isLoadingResume && (!units || units.length === 0) && selectedCourse && (
                  <p className="text-sm text-muted-foreground mt-2">No units found for this course</p>
                )}
              </CardContent>
            </Card>

            {/* Difficulty Filter */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Difficulty</span>
                </CardTitle>
                <CardDescription>Filter by difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDifficulty} onValueChange={handleDifficultyChange} disabled={!selectedUnit || isLoadingResume}>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder={isLoadingResume ? "Loading..." : "Any difficulty"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any difficulty</SelectItem> {/* ✅ FIXED */}
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

          </div>

          {/* Quizzes Grid */}
          <div>
            <h2 className="text-2xl font-bold glow-text mb-6">
              Available Quizzes ({selectedLevel || selectedCourse || selectedUnit || selectedDifficulty ? quizzes.length : totalQuizzes})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz._id} className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg glow-text">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{quiz.subject}</Badge>
                        <Badge variant="outline">{quiz.level}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Brain className="h-4 w-4" />
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            quiz.difficulty === "easy" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                              quiz.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>

                      <Button asChild className="w-full glow-effect">
                        <Link href={`/quiz/${quiz._id}`}>
                          Start Quiz
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {!loading.quizzes && quizzes.length === 0 && (
            <Card className="glass-effect border-border/50">
              <CardContent className="p-12 text-center">
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground">
                  {selectedLevel || selectedCourse || selectedUnit || selectedDifficulty
                    ? "No quizzes match your current filter criteria. Try adjusting your filters."
                    : "No quizzes are available at the moment."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
