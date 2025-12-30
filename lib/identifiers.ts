/**
 * Firebase-Native Identifier System
 * Single source of truth for user identification throughout the app
 *
 * Rules:
 * 1. uniqueUserId = email converted to Firebase-safe format
 * 2. All Firebase paths use uniqueUserId
 * 3. Stored in session/localStorage for persistence
 */

export interface FirebaseUser {
  uniqueUserId: string // Firebase-safe identifier
  email: string
  name: string
  role: string
  profile?: any
}

/**
 * Convert email to Firebase-safe unique ID
 * Example: user@example.com -> user_example_com
 */
export function emailToUniqueId(email: string): string {
  return email.replace(/[.@]/g, "_").toLowerCase()
}

/**
 * Validate if string is a Firebase-safe unique ID
 */
export function isUniqueId(str: string): boolean {
  return /^[a-z0-9_]+$/.test(str)
}

/**
 * Create Firebase chat ID from two user IDs (sorted for consistency)
 */
export function createChatId(userId1: string, userId2: string): string {
  const id1 = isUniqueId(userId1) ? userId1 : emailToUniqueId(userId1)
  const id2 = isUniqueId(userId2) ? userId2 : emailToUniqueId(userId2)
  return [id1, id2].sort().join("_")
}

/**
 * Validate Firebase path safety
 */
export function isFirebaseSafe(str: string): boolean {
  return !/[.#$[\]]/.test(str)
}

export function getFirebaseId(identifier: string): string {
  if (isUniqueId(identifier)) {
    return identifier
  }
  if (identifier.includes("@")) {
    return emailToUniqueId(identifier)
  }
  return identifier
}
