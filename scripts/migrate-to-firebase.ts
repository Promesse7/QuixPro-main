/**
 * Migration Script: MongoDB Users → Firebase Auth + MongoDB Profiles
 * 
 * This script safely migrates existing MongoDB users to use Firebase Authentication
 * while preserving all their profile data and statistics.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-to-firebase.ts
 * 
 * Options:
 *   --dry-run          Preview what would be migrated without making changes
 *   --limit 10         Only migrate first N users
 *   --email user@...   Migrate specific user by email
 */

import { initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth" 
import { getDatabase } from "../lib/mongodb"
import * as crypto from "crypto"

// Initialize Firebase Admin SDK
const firebaseApp = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})

const auth = getAuth(firebaseApp)

interface MigrationOptions {
  dryRun: boolean
  limit: number
  email?: string
}

interface MigrationResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ email: string; error: string }>
}

async function getMongoDB() {
  return getDatabase()
}

async function migrateUser(
  mongoUser: any,
  dryRun: boolean
): Promise<{ status: "success" | "failed" | "skipped"; error?: string }> {
  try {
    // Skip if already migrated
    if (mongoUser.firebaseUid && mongoUser.authProvider === "firebase") {
      console.log(`  ⏭️  Skipping ${mongoUser.email} (already migrated)`)
      return { status: "skipped" }
    }

    // Generate temporary password for Firebase account creation
    // In production, use email-based recovery instead
    const tempPassword = crypto.randomBytes(16).toString("hex")

    console.log(`  📝 Creating Firebase account for ${mongoUser.email}...`)

    if (!dryRun) {
      try {
        // Create Firebase Auth user
        const firebaseUser = await auth.createUser({
          email: mongoUser.email.toLowerCase(),
          password: tempPassword,
          displayName: mongoUser.name,
          disabled: false,
        })

        console.log(`     ✓ Firebase UID: ${firebaseUser.uid}`)

        // Update MongoDB profile with Firebase UID
        const db = await getMongoDB()
        const usersCol = db.collection("users")

        await usersCol.updateOne(
          { _id: mongoUser._id },
          {
            $set: {
              firebaseUid: firebaseUser.uid,
              authProvider: "firebase",
              updatedAt: new Date(),
            },
          }
        )

        console.log(`     ✓ MongoDB profile updated`)

        return { status: "success" }
      } catch (firebaseError: any) {
        // Handle specific Firebase errors
        if (firebaseError.code === "auth/email-already-exists") {
          console.log(`     ⚠️  Email already exists in Firebase (user may be partially migrated)`)

          // Try to find and link existing Firebase user
          try {
            const existingUser = await auth.getUserByEmail(mongoUser.email.toLowerCase())
            const db = await getMongoDB()
            const usersCol = db.collection("users")

            await usersCol.updateOne(
              { _id: mongoUser._id },
              {
                $set: {
                  firebaseUid: existingUser.uid,
                  authProvider: "firebase",
                  updatedAt: new Date(),
                },
              }
            )

            console.log(`     ✓ Linked to existing Firebase account: ${existingUser.uid}`)
            return { status: "success" }
          } catch (linkError) {
            return { status: "failed", error: "Could not link to existing Firebase account" }
          }
        }

        throw firebaseError
      }
    } else {
      console.log(`     [DRY RUN] Would create Firebase account and update profile`)
      return { status: "success" }
    }
  } catch (error: any) {
    console.error(`  ❌ Migration failed: ${error.message}`)
    return { status: "failed", error: error.message }
  }
}

async function runMigration(options: MigrationOptions) {
  console.log("\n" + "=".repeat(60))
  console.log("Firebase User Migration Script")
  console.log("=".repeat(60) + "\n")

  if (options.dryRun) {
    console.log("🏃 DRY RUN MODE - No changes will be made\n")
  }

  try {
    const db = await getMongoDB()
    const usersCol = db.collection("users")

    // Build query
    let query: any = {}
    if (options.email) {
      query = { email: options.email.toLowerCase() }
    } else {
      // Get unmigrated users
      query = {
        $or: [{ firebaseUid: { $exists: false } }, { authProvider: { $ne: "firebase" } }],
      }
    }

    // Get users to migrate
    const usersToMigrate = await usersCol.find(query).limit(options.limit).toArray()

    console.log(`Found ${usersToMigrate.length} user(s) to migrate\n`)

    if (usersToMigrate.length === 0) {
      console.log("✅ No users to migrate!")
      return
    }

    // Get stats before migration
    const totalUsers = await usersCol.countDocuments({})
    const migratedBefore = await usersCol.countDocuments({ authProvider: "firebase" })

    // Migrate users
    const result: MigrationResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    }

    for (const mongoUser of usersToMigrate) {
      const migrateResult = await migrateUser(mongoUser, options.dryRun)

      switch (migrateResult.status) {
        case "success":
          result.success++
          break
        case "failed":
          result.failed++
          result.errors.push({ email: mongoUser.email, error: migrateResult.error || "Unknown error" })
          break
        case "skipped":
          result.skipped++
          break
      }
    }

    // Get stats after migration
    const migratedAfter = await usersCol.countDocuments({ authProvider: "firebase" })

    // Print results
    console.log("\n" + "=".repeat(60))
    console.log("Migration Results:")
    console.log("=".repeat(60))
    console.log(`  ✓ Successful:  ${result.success}`)
    console.log(`  ⏭️  Skipped:    ${result.skipped}`)
    console.log(`  ❌ Failed:     ${result.failed}`)

    if (!options.dryRun) {
      console.log(
        `\n  Total migrated: ${migratedBefore} → ${migratedAfter} (${((migratedAfter / totalUsers) * 100).toFixed(1)}%)`
      )

      if (result.errors.length > 0) {
        console.log("\n  Errors:")
        result.errors.forEach(({ email, error }) => {
          console.log(`    - ${email}: ${error}`)
        })
      }
    }

    console.log("\n" + "=".repeat(60) + "\n")

    if (!options.dryRun && result.failed === 0) {
      console.log("✅ Migration completed successfully!\n")
    }

    process.exit(result.failed > 0 ? 1 : 0)
  } catch (error: any) {
    console.error("❌ Migration script failed:", error.message)
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options: MigrationOptions = {
  dryRun: args.includes("--dry-run"),
  limit: 1000,
  email: undefined,
}

// Check for limit argument
const limitIndex = args.indexOf("--limit")
if (limitIndex !== -1 && args[limitIndex + 1]) {
  options.limit = parseInt(args[limitIndex + 1])
}

// Check for email argument
const emailIndex = args.indexOf("--email")
if (emailIndex !== -1 && args[emailIndex + 1]) {
  options.email = args[emailIndex + 1]
}

runMigration(options)
