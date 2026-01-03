import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import { badgeService } from "@/services/badgeService"

export interface User {
  _id?: ObjectId
  id?: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  level?: string
  stage?: "Primary" | "Lower Secondary" | "Upper Secondary"
  avatar?: string
  passwordHash?: string
  countryId?: ObjectId
  schoolId?: ObjectId
  levelId?: ObjectId
  stats?: {
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    totalPoints: number
    certificates: number
  }
  createdAt?: Date
  updatedAt?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

export interface Level {
  _id?: ObjectId
  name: string
  type: "PRIMARY" | "OLEVEL" | "ALEVEL" | "HIGHER"
  schoolId?: ObjectId
  courses: ObjectId[]
}

export interface Course {
  _id?: ObjectId
  name: string
  description: string
  levelId: ObjectId
  resources: any[]
}

// Rwanda Education System Structure (kept for compatibility)
export const RWANDA_LEVELS: Record<
  string,
  { name: string; stage: "Primary" | "Lower Secondary" | "Upper Secondary"; courses: string[] }
> = {
  P1: { name: "P1", stage: "Primary", courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies"] },
  P2: { name: "P2", stage: "Primary", courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies"] },
  P3: {
    name: "P3",
    stage: "Primary",
    courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies", "French"],
  },
  P4: {
    name: "P4",
    stage: "Primary",
    courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies", "French"],
  },
  P5: {
    name: "P5",
    stage: "Primary",
    courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies", "French"],
  },
  P6: {
    name: "P6",
    stage: "Primary",
    courses: ["Mathematics", "English", "Kinyarwanda", "Science", "Social Studies", "French"],
  },
  S1: {
    name: "S1",
    stage: "Lower Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Biology",
      "Chemistry",
      "English",
      "Kinyarwanda",
      "History",
      "Geography",
      "Entrepreneurship",
      "French",
    ],
  },
  S2: {
    name: "S2",
    stage: "Lower Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Biology",
      "Chemistry",
      "English",
      "Kinyarwanda",
      "History",
      "Geography",
      "Entrepreneurship",
      "French",
    ],
  },
  S3: {
    name: "S3",
    stage: "Lower Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Biology",
      "Chemistry",
      "English",
      "Kinyarwanda",
      "History",
      "Geography",
      "Entrepreneurship",
      "French",
    ],
  },
  S4: {
    name: "S4",
    stage: "Upper Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Geography",
      "History",
      "Literature",
      "Entrepreneurship",
      "Computer Science",
    ],
  },
  S5: {
    name: "S5",
    stage: "Upper Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Geography",
      "History",
      "Literature",
      "Entrepreneurship",
      "Computer Science",
    ],
  },
  S6: {
    name: "S6",
    stage: "Upper Secondary",
    courses: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Geography",
      "History",
      "Literature",
      "Entrepreneurship",
      "Computer Science",
    ],
  },
}

// Database authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const db = await getDatabase()
    const usersCol = db.collection("users")

    const user = await usersCol.findOne({ email: email.toLowerCase() })
    if (!user) return null

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) return null

    // Convert ObjectId to string for frontend compatibility
    const userForFrontend: User = {
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      stage: user.stage,
      avatar: user.avatar,
      id: user._id.toString(),
    }

    return userForFrontend
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export const registerUser = async (userData: {
  email: string
  password: string
  name: string
  role: "student" | "teacher" | "admin"
  level?: string
  schoolId?: string
  countryId?: string
}): Promise<User | null> => {
  try {
    const db = await getDatabase()
    const usersCol = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCol.findOne({ email: userData.email.toLowerCase() })
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12)

    // Get level info if student
    let levelId = null
    let stage = null
    if (userData.role === "student" && userData.level) {
      const levelsCol = db.collection("levels")
      const level = await levelsCol.findOne({ name: userData.level })
      if (level) {
        levelId = level._id
        stage = level.type === "PRIMARY" ? "Primary" : level.type === "OLEVEL" ? "Lower Secondary" : "Upper Secondary"
      }
    }

    const newUser = {
      email: userData.email.toLowerCase(),
      name: userData.name,
      role: userData.role,
      level: userData.level,
      stage,
      passwordHash,
      countryId: userData.countryId ? new ObjectId(userData.countryId) : null,
      schoolId: userData.schoolId ? new ObjectId(userData.schoolId) : null,
      levelId,
      stats:
        userData.role === "student"
          ? {
            totalQuizzes: 0,
            completedQuizzes: 0,
            averageScore: 0,
            totalPoints: 0,
            certificates: 0,
          }
          : undefined,
      gamification: {
        totalXP: 0,
        currentLevel: 1,
        badges: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCol.insertOne(newUser)

    // Award account creation badge
    try {
      await badgeService.awardBadgeToUser(result.insertedId.toString(), 'account_creator')
    } catch (badgeError) {
      console.error('Failed to award account creation badge:', badgeError)
      // Don't fail registration if badge awarding fails
    }

    // Return user without sensitive data
    const userForFrontend: User = {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      level: newUser.level,
      stage: newUser.stage as "Primary" | "Lower Secondary" | "Upper Secondary" | undefined,
      id: result.insertedId.toString(),
    }

    return userForFrontend
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("qouta_user")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("qouta_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("qouta_user")
    }
  }
}

export const logout = () => {
  setCurrentUser(null)
}

export const getUserCourses = async (user: User): Promise<string[]> => {
  if (user.role !== "student" || !user.levelId) return []

  try {
    const db = await getDatabase()
    const coursesCol = db.collection("courses")
    const courses = await coursesCol.find({ levelId: new ObjectId(user.levelId) }).toArray()
    return courses.map((course) => course.name)
  } catch (error) {
    console.error("Error fetching user courses:", error)
    // Fallback to hardcoded data
    return user.level ? RWANDA_LEVELS[user.level]?.courses || [] : []
  }
}

// Get leaderboard data
export const getLeaderboardData = async (filters?: {
  level?: string
  exam?: string
  limit?: number
}) => {
  try {
    const db = await getDatabase()
    const usersCol = db.collection("users")

    const query: any = { role: "student" }
    if (filters?.level) {
      query.level = filters.level
    }

    const students = await usersCol
      .find(query)
      .sort({ "stats.totalPoints": -1 })
      .limit(filters?.limit || 50)
      .toArray()

    return students.map((student, index) => ({
      id: student._id.toString(),
      name: student.name,
      level: student.level,
      totalPoints: student.stats?.totalPoints || 0,
      averageScore: student.stats?.averageScore || 0,
      completedQuizzes: student.stats?.completedQuizzes || 0,
      certificates: student.stats?.certificates || 0,
      streak: student.stats?.streak || 0,
      rank: index + 1,
      avatar: student.avatar,
    }))
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }
}

export const getPublicGroups = async (filters?: {
  subject?: string
  level?: string
  limit?: number
}) => {
  try {
    const db = await getDatabase()
    const groupsCol = db.collection("groups")

    const query: any = { isPublic: true }

    if (filters?.subject && filters.subject !== 'all') {
      query.subject = filters.subject
    }

    if (filters?.level && filters.level !== 'all') {
      query.level = filters.level
    }

    const groups = await groupsCol
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 20)
      .toArray()

    return groups.map(group => ({
      ...group,
      id: group._id.toString(),
      _id: undefined
    }))
  } catch (error) {
    console.error("Error fetching public groups:", error)
    return []
  }
}
