/**
 * Migration Script: MongoDB Users → Firebase Auth + MongoDB Profiles
 *
 * Usage:
 *   npx ts-node --esm scripts/migrate-to-firebase.ts --dry-run
 *
 * Options:
 *   --dry-run          Preview migration without making changes
 *   --limit 10         Migrate first N users
 *   --email user@...   Migrate a specific user by email
 */

import { config } from "dotenv";
config(); // load .env variables

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { MongoClient, type Db } from "mongodb";
import * as crypto from "crypto";

// --------- Firebase Admin Initialization ---------
const firebaseApp = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(firebaseApp);

// --------- MongoDB Helper (inline) ---------
const mongoUri = process.env.MONGODB_URI!;
const mongoOptions = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(mongoUri, mongoOptions);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(mongoUri, mongoOptions);
  clientPromise = client.connect();
}

async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    client = new MongoClient(mongoUri, mongoOptions);
    clientPromise = client.connect();
  }
  const resolvedClient = await clientPromise;
  return resolvedClient.db("QuixDB");
}

// --------- Migration Logic ---------
interface MigrationOptions {
  dryRun: boolean;
  limit: number;
  email?: string;
}

interface MigrationResult {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{ email: string; error: string }>;
}

async function migrateUser(mongoUser: any, dryRun: boolean) {
  try {
    if (mongoUser.firebaseUid && mongoUser.authProvider === "firebase") {
      console.log(`  ⏭️ Skipping ${mongoUser.email} (already migrated)`);
      return { status: "skipped" };
    }

    const tempPassword = crypto.randomBytes(16).toString("hex");
    console.log(`  📝 Creating Firebase account for ${mongoUser.email}...`);

    if (!dryRun) {
      try {
        const firebaseUser = await auth.createUser({
          email: mongoUser.email.toLowerCase(),
          password: tempPassword,
          displayName: mongoUser.name,
          disabled: false,
        });

        console.log(`     ✓ Firebase UID: ${firebaseUser.uid}`);

        const db = await getDatabase();
        const usersCol = db.collection("users");
        await usersCol.updateOne(
          { _id: mongoUser._id },
          { $set: { firebaseUid: firebaseUser.uid, authProvider: "firebase", updatedAt: new Date() } }
        );

        console.log(`     ✓ MongoDB profile updated`);
        return { status: "success" };
      } catch (firebaseError: any) {
        if (firebaseError.code === "auth/email-already-exists") {
          console.log(`     ⚠️ Email already exists in Firebase, linking...`);
          try {
            const existingUser = await auth.getUserByEmail(mongoUser.email.toLowerCase());
            const db = await getDatabase();
            const usersCol = db.collection("users");
            await usersCol.updateOne(
              { _id: mongoUser._id },
              { $set: { firebaseUid: existingUser.uid, authProvider: "firebase", updatedAt: new Date() } }
            );
            console.log(`     ✓ Linked to existing Firebase UID: ${existingUser.uid}`);
            return { status: "success" };
          } catch {
            return { status: "failed", error: "Could not link existing Firebase user" };
          }
        }
        throw firebaseError;
      }
    } else {
      console.log(`     [DRY RUN] Would create Firebase account and update profile`);
      return { status: "success" };
    }
  } catch (error: any) {
    console.error(`  ❌ Migration failed: ${error.message}`);
    return { status: "failed", error: error.message };
  }
}

async function runMigration(options: MigrationOptions) {
  console.log("\n=== Firebase User Migration ===\n");
  if (options.dryRun) console.log("🏃 DRY RUN MODE - No changes will be made\n");

  try {
    const db = await getDatabase();
    const usersCol = db.collection("users");

    let query: any = {};
    if (options.email) query = { email: options.email.toLowerCase() };
    else query = { $or: [{ firebaseUid: { $exists: false } }, { authProvider: { $ne: "firebase" } }] };

    const usersToMigrate = await usersCol.find(query).limit(options.limit).toArray();
    console.log(`Found ${usersToMigrate.length} user(s) to migrate\n`);

    const result: MigrationResult = { success: 0, failed: 0, skipped: 0, errors: [] };

    for (const user of usersToMigrate) {
      const res = await migrateUser(user, options.dryRun);
      switch (res.status) {
        case "success": result.success++; break;
        case "skipped": result.skipped++; break;
        case "failed": result.failed++; result.errors.push({ email: user.email, error: res.error || "Unknown error" }); break;
      }
    }

    console.log("\n=== Migration Results ===");
    console.log(`  ✓ Successful: ${result.success}`);
    console.log(`  ⏭️ Skipped: ${result.skipped}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    if (!options.dryRun && result.errors.length > 0) {
      console.log("\nErrors:");
      result.errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    }
    console.log("\n=== Done ===\n");

    process.exit(result.failed > 0 ? 1 : 0);
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// --------- Command Line Parsing ---------
const args = process.argv.slice(2);
const migrationOptions: MigrationOptions = {
  dryRun: args.includes("--dry-run"),
  limit: 1000,
  email: undefined,
};

const limitIndex = args.indexOf("--limit");
if (limitIndex !== -1 && args[limitIndex + 1]) migrationOptions.limit = parseInt(args[limitIndex + 1]);

const emailIndex = args.indexOf("--email");
if (emailIndex !== -1 && args[emailIndex + 1]) migrationOptions.email = args[emailIndex + 1];

runMigration(migrationOptions);
