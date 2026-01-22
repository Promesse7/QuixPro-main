import { type NextRequest, NextResponse } from "next/server"
import MigrationManager from "./migration-manager"
import type { User } from "@/models/User"

/**
 * Middleware to verify Firebase ID tokens and attach user to request
 * Usage in route handlers:
 *   const user = await verifyFirebaseToken(request)
 */
export async function verifyFirebaseToken(request: NextRequest): Promise<User | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("[v0] Missing or invalid Authorization header")
      return null
    }

    const idToken = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify token and get user from MongoDB
    const user = await MigrationManager.getUserByToken(idToken)

    if (!user) {
      console.warn("[v0] Token valid but user not found in MongoDB")
      return null
    }

    console.log("[v0] Token verified for user:", user.email)
    return user
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    return null
  }
}

/**
 * Protect a route with Firebase authentication
 * Usage:
 *   const user = await requireFirebaseAuth(request)
 *   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 */
export async function requireFirebaseAuth(request: NextRequest): Promise<User | null> {
  const user = await verifyFirebaseToken(request)
  return user
}

/**
 * Get current user from request headers
 * Useful for API routes that need user context
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  return verifyFirebaseToken(request)
}

export default verifyFirebaseToken
