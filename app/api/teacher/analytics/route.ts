import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// GET /api/teacher/analytics?teacherId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCol = db.collection("users")
    const quizzesCol = db.collection("quizzes")
    const attemptsCol = db.collection("quizattempts")

    // Get teacher's quizzes
    const teacherQuizzes = await quizzesCol
      .find({ createdBy: new ObjectId(teacherId) })
      .toArray()

    // Get all students
    const students = await usersCol
      .find({ role: "student" })
      .toArray()

    // Get all quiz attempts
    const attempts = await attemptsCol.find({}).toArray()

    // Calculate statistics
    const totalQuizzes = teacherQuizzes.length
    const totalStudents = students.length
    
    // Get unique levels (classes)
    const activeClassesSet = new Set(students.map((s: any) => s.level).filter(Boolean))
    const activeClasses = activeClassesSet.size

    // Calculate average scores across all attempts
    const averageScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0) / attempts.length)
      : 0

    // Total attempts
    const totalAttempts = attempts.length

    // This week's attempts (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const thisWeekAttempts = attempts.filter((attempt: any) => 
      new Date(attempt.createdAt) >= oneWeekAgo
    ).length

    // Quiz performance by difficulty
    const quizDifficultyStats = teacherQuizzes.reduce((acc: any, quiz: any) => {
      const difficulty = quiz.difficulty || 'medium'
      if (!acc[difficulty]) {
        acc[difficulty] = { count: 0, avgScore: 0, attempts: 0 }
      }
      acc[difficulty].count++
      
      // Get attempts for this quiz
      const quizAttempts = attempts.filter((attempt: any) => 
        attempt.quizId === quiz._id.toString()
      )
      acc[difficulty].attempts += quizAttempts.length
      
      if (quizAttempts.length > 0) {
        const quizAvgScore = quizAttempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / quizAttempts.length
        acc[difficulty].avgScore = Math.round(quizAvgScore)
      }
      
      return acc
    }, {})

    // Student performance by level
    const studentLevelStats = students.reduce((acc: any, student: any) => {
      const level = student.level || 'Unknown'
      if (!acc[level]) {
        acc[level] = { count: 0, avgScore: 0 }
      }
      acc[level].count++
      
      // Get student's attempts
      const studentAttempts = attempts.filter((attempt: any) => 
        attempt.userId === student.id
      )
      
      if (studentAttempts.length > 0) {
        const studentAvgScore = studentAttempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / studentAttempts.length
        acc[level].avgScore += studentAvgScore
      }
      
      return acc
    }, {})

    // Calculate average scores per level
    Object.keys(studentLevelStats).forEach(level => {
      if (studentLevelStats[level].count > 0) {
        studentLevelStats[level].avgScore = Math.round(studentLevelStats[level].avgScore / studentLevelStats[level].count)
      }
    })

    return NextResponse.json({
      stats: {
        totalQuizzes,
        totalStudents,
        activeClasses,
        averageScore,
        totalAttempts,
        thisWeekAttempts
      },
      quizDifficultyStats,
      studentLevelStats
    })

  } catch (error) {
    console.error("Error fetching teacher analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
