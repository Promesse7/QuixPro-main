import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { verifyUserIsMigrated } from "./firebase-profile"

// Initialize Firebase Admin SDK
function getFirebaseAdmin() {
  const apps = getApps()
  if (apps.length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  }
  return getAuth()
}

/**
 * Extract and verify Firebase ID token from request headers
 * Returns Firebase UID if valid, throws error otherwise
 */
export async function verifyFirebaseToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header")
  }

  const idToken = authHeader.substring(7)

  try {
    const auth = getFirebaseAdmin()
    const decodedToken = await auth.verifyIdToken(idToken)
    console.log("[v0] Firebase token verified for UID:", decodedToken.uid)
    return decodedToken.uid
  } catch (error: any) {
    console.error("[v0] Firebase token verification failed:", error.message)
    throw new Error("Invalid or expired token")
  }
}

/**
 * Middleware function to verify Firebase auth in API routes
 * Usage:
 *   const firebaseUid = await requireFirebaseAuth(request)
 *   const user = await getUserByFirebaseUid(firebaseUid)
 */
export async function requireFirebaseAuth(request: Request) {
  const authHeader = request.headers.get("authorization")

  try {
    const firebaseUid = await verifyFirebaseToken(authHeader)
    // Verify user is migrated to Firebase
    await verifyUserIsMigrated(firebaseUid)
    return firebaseUid
  } catch (error: any) {
    throw new Error(error.message || "Authentication required")
  }
}

/**
 * Optional Firebase auth - returns UID if valid, null otherwise
 */
export async function getFirebaseUidIfValid(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader) return null

  try {
    return await verifyFirebaseToken(authHeader)
  } catch {
    return null
  }
}
