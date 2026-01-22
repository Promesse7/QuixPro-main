import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

/**
 * Lookup user profile by Firebase UID
 * This is the ONLY way to get a user profile from MongoDB
 * Firebase UID is the source of truth for authentication
 */
export async function getUserByFirebaseUid(firebaseUid: string) {
  if (!firebaseUid) throw new Error("Firebase UID is required")

  const db = await getDatabase()
  const usersCol = db.collection("users")

  const user = await usersCol.findOne({ firebaseUid })

  if (!user) {
    console.log("[v0] No MongoDB profile found for Firebase UID:", firebaseUid)
    return null
  }

  return {
    _id: user._id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    name: user.name,
    role: user.role,
    level: user.level,
    avatar: user.avatar,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
  }
}

/**
 * Verify user exists and is migrated to Firebase
 * Used in middleware to guard protected routes
 */
export async function verifyUserIsMigrated(firebaseUid: string) {
  const user = await getUserByFirebaseUid(firebaseUid)

  if (!user) {
    throw new Error("User profile not found")
  }

  if (user.authProvider !== "firebase") {
    throw new Error("User account not migrated to Firebase. Please contact support.")
  }

  return user
}

/**
 * Link legacy MongoDB user to Firebase UID (used during migration)
 */
export async function linkFirebaseUidToLegacyUser(email: string, firebaseUid: string) {
  const db = await getDatabase()
  const usersCol = db.collection("users")

  const result = await usersCol.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        firebaseUid,
        authProvider: "firebase",
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    throw new Error("User not found")
  }

  console.log("[v0] Linked Firebase UID", firebaseUid, "to email:", email)
  return result
}

/**
 * Get all unmigrated users (legacy MongoDB-only)
 */
export async function getUnmigratedUsers(limit = 100) {
  const db = await getDatabase()
  const usersCol = db.collection("users")

  const users = await usersCol
    .find({
      $or: [{ firebaseUid: { $exists: false } }, { authProvider: { $ne: "firebase" } }],
    })
    .limit(limit)
    .toArray()

  return users
}

/**
 * Get migration statistics
 */
export async function getMigrationStats() {
  const db = await getDatabase()
  const usersCol = db.collection("users")

  const totalUsers = await usersCol.countDocuments({})
  const migratedUsers = await usersCol.countDocuments({ authProvider: "firebase" })
  const unmigratedUsers = totalUsers - migratedUsers

  return {
    totalUsers,
    migratedUsers,
    unmigratedUsers,
    migrationPercentage: ((migratedUsers / totalUsers) * 100).toFixed(2),
  }
}
