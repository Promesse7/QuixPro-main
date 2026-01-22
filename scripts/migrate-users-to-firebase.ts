/**
 * Migration Script: MongoDB Users → Firebase Auth
 * 
 * This script migrates existing MongoDB users to Firebase Auth.
 * It creates Firebase accounts for each user using their email.
 * 
 * USAGE:
 * 1. Set up Firebase Admin SDK credentials in environment
 * 2. Run: npx ts-node scripts/migrate-users-to-firebase.ts
 * 
 * IMPORTANT: 
 * - This is safe to run multiple times (idempotent)
 * - Already-migrated users will be skipped
 * - Users will need to reset their passwords on first login
 */

import * as admin from "firebase-admin"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/models/User"

// Initialize Firebase Admin SDK
function initializeFirebase() {
  if (admin.apps.length > 0) {
    return
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })

  console.log("[v0] Firebase Admin SDK initialized")
}

interface MigrationStats {
  total: number
  migrated: number
  skipped: number
  failed: number
  errors: Array<{ email: string; error: string }>
}

/**
 * Migrate a single user to Firebase
 */
async function migrateUserToFirebase(user: User, stats: MigrationStats): Promise<void> {
  try {
    // Skip if already migrated
    if (user.authProvider === "firebase" && user.firebaseUid) {
      console.log(`✓ SKIPPED (already migrated): ${user.email}`)
      stats.skipped++
      return
    }

    // Check if Firebase user already exists
    let firebaseUser
    try {
      firebaseUser = await admin.auth().getUserByEmail(user.email)
      console.log(`✓ SKIPPED (Firebase user exists): ${user.email}`)
      stats.skipped++

      // Update MongoDB to link the existing Firebase UID
      const db = await getDatabase()
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            firebaseUid: firebaseUser.uid,
            authProvider: "firebase",
            updatedAt: new Date(),
          },
        }
      )

      return
    } catch (error: any) {
      // User doesn't exist in Firebase, continue with creation
      if (error.code !== "auth/user-not-found") {
        throw error
      }
    }

    // Create Firebase user with temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + "Temp123!"

    firebaseUser = await admin.auth().createUser({
      email: user.email,
      password: tempPassword,
      displayName: user.name,
      disabled: false,
    })

    console.log(`✓ MIGRATED: ${user.email} → Firebase UID: ${firebaseUser.uid}`)

    // Update MongoDB to link the Firebase UID
    const db = await getDatabase()
    const result = await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          firebaseUid: firebaseUser.uid,
          authProvider: "firebase",
          updatedAt: new Date(),
        },
        $unset: {
          passwordHash: "", // Remove old password hash
        },
      }
    )

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update MongoDB record")
    }

    stats.migrated++
  } catch (error: any) {
    console.error(`✗ FAILED: ${user.email} - ${error.message}`)
    stats.failed++
    stats.errors.push({
      email: user.email,
      error: error.message,
    })
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log("\n🔄 Starting Firebase User Migration...\n")

  initializeFirebase()

  const stats: MigrationStats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  }

  try {
    // Get all users from MongoDB
    const db = await getDatabase()
    const users = (await db.collection("users").find({}).toArray()) as User[]

    stats.total = users.length
    console.log(`Found ${stats.total} users in MongoDB\n`)

    if (stats.total === 0) {
      console.log("No users to migrate.")
      return
    }

    // Migrate each user
    for (const user of users) {
      await migrateUserToFirebase(user, stats)
    }

    // Print summary
    console.log("\n📊 Migration Summary:")
    console.log(`   Total Users:    ${stats.total}`)
    console.log(`   Migrated:       ${stats.migrated}`)
    console.log(`   Skipped:        ${stats.skipped}`)
    console.log(`   Failed:         ${stats.failed}`)

    if (stats.errors.length > 0) {
      console.log("\n⚠️  Errors:")
      stats.errors.forEach(({ email, error }) => {
        console.log(`   - ${email}: ${error}`)
      })
    }

    console.log("\n✅ Migration complete!\n")

    // Cleanup
    await admin.app().delete()
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

// Run migration
runMigration().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})

export { runMigration }
