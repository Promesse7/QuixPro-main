import { getDatabase } from "./mongodb"
import { verifyFirebaseToken } from "./firebase-auth"
import type { User } from "@/models/User"

/**
 * Migration Manager for transitioning users from MongoDB auth to Firebase Auth
 * Ensures backward compatibility while migrating to Firebase as the auth provider
 */
export class MigrationManager {
  /**
   * Get a user by Firebase UID from MongoDB
   */
  static async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const db = await getDatabase()
      const user = await db.collection("users").findOne({ firebaseUid })
      return user as User | null
    } catch (error) {
      console.error("[v0] Error fetching user by firebaseUid:", error)
      return null
    }
  }

  /**
   * Get a user by email from MongoDB (for legacy lookups)
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await getDatabase()
      const user = await db.collection("users").findOne({ email: email.toLowerCase() })
      return user as User | null
    } catch (error) {
      console.error("[v0] Error fetching user by email:", error)
      return null
    }
  }

  /**
   * Link Firebase UID to existing MongoDB user during migration
   * Called when migrating a legacy MongoDB user to Firebase
   */
  static async linkFirebaseUid(email: string, firebaseUid: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const result = await db.collection("users").updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            firebaseUid,
            authProvider: "firebase",
            updatedAt: new Date(),
          },
        }
      )

      console.log("[v0] Linked firebaseUid to user:", email)
      return result.modifiedCount > 0
    } catch (error) {
      console.error("[v0] Error linking firebaseUid:", error)
      return false
    }
  }

  /**
   * Create new user in MongoDB after Firebase Auth signup
   * Called after successful Firebase user creation
   */
  static async createUserProfile(userData: {
    firebaseUid: string
    email: string
    name: string
    role: "student" | "teacher" | "admin"
    level?: string
    school?: string
  }): Promise<User | null> {
    try {
      const db = await getDatabase()

      const user: User = {
        firebaseUid: userData.firebaseUid,
        email: userData.email.toLowerCase(),
        name: userData.name,
        role: userData.role,
        level: userData.level,
        school: userData.school,
        authProvider: "firebase",
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {
          quizzesTaken: 0,
          quizzesPassed: 0,
          averageScore: 0,
          totalPoints: 0,
        },
        gamification: {
          totalXP: 0,
          currentLevel: 1,
          streak: 0,
          badges: [],
        },
        preferences: {
          dailyGoal: 100,
          theme: "light",
          language: "en",
        },
      }

      const result = await db.collection("users").insertOne(user)
      user._id = result.insertedId

      console.log("[v0] Created new user profile:", userData.email)
      return user
    } catch (error) {
      console.error("[v0] Error creating user profile:", error)
      return null
    }
  }

  /**
   * Get user by Firebase token (server-side verification)
   * Called from protected API endpoints
   */
  static async getUserByToken(idToken: string): Promise<User | null> {
    try {
      const decodedToken = await verifyFirebaseToken(idToken)
      const firebaseUid = decodedToken.uid

      const user = await this.getUserByFirebaseUid(firebaseUid)

      if (!user) {
        console.warn("[v0] Firebase token valid but user not found in MongoDB:", firebaseUid)
        return null
      }

      // Ensure user has firebase auth provider
      if (user.authProvider !== "firebase") {
        console.warn("[v0] User has invalid auth provider:", user.authProvider)
        return null
      }

      return user
    } catch (error) {
      console.error("[v0] Error verifying token and fetching user:", error)
      return null
    }
  }

  /**
   * Migration script: Batch migrate existing MongoDB users to Firebase
   * This is a safe operation that only links existing users without changing passwords
   * Note: This is for reference - actual migration should be done via Firebase Admin SDK
   */
  static async getMigrationStats(): Promise<{
    totalUsers: number
    migratedUsers: number
    legacyUsers: number
  }> {
    try {
      const db = await getDatabase()
      const totalUsers = await db.collection("users").countDocuments()
      const migratedUsers = await db.collection("users").countDocuments({ authProvider: "firebase" })
      const legacyUsers = totalUsers - migratedUsers

      return {
        totalUsers,
        migratedUsers,
        legacyUsers,
      }
    } catch (error) {
      console.error("[v0] Error getting migration stats:", error)
      return { totalUsers: 0, migratedUsers: 0, legacyUsers: 0 }
    }
  }
}

export default MigrationManager
