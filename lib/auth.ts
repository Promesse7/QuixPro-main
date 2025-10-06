export interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  level?: string
  stage?: "Primary" | "Lower Secondary" | "Upper Secondary"
  avatar?: string
}

export interface Level {
  name: string
  stage: "Primary" | "Lower Secondary" | "Upper Secondary"
  courses: string[]
}

// Rwanda Education System Structure
export const RWANDA_LEVELS: Record<string, Level> = {
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

// Hardcoded test users for development
export const TEST_USERS: User[] = [
  {
    id: "1",
    email: "student@qouta.rw",
    name: "Amahoro Uwimana",
    role: "student",
    level: "S2",
    stage: "Lower Secondary",
    avatar: "/student-avatar.png",
  },
  {
    id: "2",
    email: "teacher@qouta.rw",
    name: "Jean Baptiste Nzeyimana",
    role: "teacher",
    avatar: "/teacher-avatar.png",
  },
  {
    id: "3",
    email: "admin@qouta.rw",
    name: "Marie Claire Mukamana",
    role: "admin",
  },
  {
    id: "4",
    email: "student2@qouta.rw",
    name: "Peace Ingabire",
    role: "student",
    level: "P5",
    stage: "Primary",
    avatar: "/student-avatar.png",
  },
]

// Mock authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simple hardcoded authentication for testing
  const user = TEST_USERS.find((u) => u.email === email)
  if (user && password === "password123") {
    return user
  }
  return null
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

export const getUserCourses = (user: User): string[] => {
  if (user.role !== "student" || !user.level) return []
  return RWANDA_LEVELS[user.level]?.courses || []
}
