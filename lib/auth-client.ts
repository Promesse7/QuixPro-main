// Client-side authentication utilities (no database imports)

export interface User {
  _id?: string
  id?: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  level?: string
  stage?: "Primary" | "Lower Secondary" | "Upper Secondary"
  avatar?: string
  passwordHash?: string
  countryId?: string
  schoolId?: string
  levelId?: string
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
