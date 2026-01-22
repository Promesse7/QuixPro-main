import { initializeApp, getApps } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getDatabase, ref, get, set } from "firebase/database"

// Initialize Firebase (using env vars)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

// Initialize Firebase app
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth = getAuth(app)
export const database = getDatabase(app)

// Set persistence to LOCAL so user stays logged in across browser restarts
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("[v0] Firebase persistence error:", error)
})

export interface FirebaseSignupPayload {
  email: string
  password: string
  name: string
  role: "student" | "teacher" | "admin"
  level?: string
}

export interface FirebaseLoginPayload {
  email: string
  password: string
}

/**
 * Create a new Firebase Auth user and store profile in MongoDB
 * Called from signup endpoint
 */
export async function createFirebaseUser(payload: FirebaseSignupPayload) {
  try {
    console.log("[v0] Creating Firebase user for email:", payload.email)

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
    const firebaseUid = userCredential.user.uid
    const idToken = await userCredential.user.getIdToken()

    console.log("[v0] Firebase user created with UID:", firebaseUid)

    return {
      firebaseUid,
      idToken,
      email: payload.email,
    }
  } catch (error: any) {
    console.error("[v0] Firebase signup error:", error.message)
    throw new Error(error.message || "Failed to create Firebase user")
  }
}

/**
 * Authenticate with Firebase and get ID token
 * Called from login endpoint
 */
export async function authenticateFirebaseUser(payload: FirebaseLoginPayload) {
  try {
    console.log("[v0] Authenticating Firebase user:", payload.email)

    const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password)
    const firebaseUid = userCredential.user.uid
    const idToken = await userCredential.user.getIdToken()

    console.log("[v0] Firebase authentication successful for UID:", firebaseUid)

    return {
      firebaseUid,
      idToken,
      email: payload.email,
    }
  } catch (error: any) {
    console.error("[v0] Firebase login error:", error.message)
    throw new Error(error.message || "Invalid credentials")
  }
}

/**
 * Verify Firebase ID token on the backend
 * This should be called from API endpoints to verify tokens
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    // Import admin SDK for server-side verification
    const admin = require("firebase-admin")

    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || "{}")
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      })
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken
  } catch (error: any) {
    console.error("[v0] Token verification failed:", error.message)
    throw new Error("Invalid token")
  }
}

export default auth
