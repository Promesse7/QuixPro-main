import { getCurrentUser } from "@/lib/auth"

// Get current user email (primary identifier for Firebase)
export function getCurrentUserId(): string | null {
  const user = getCurrentUser()
  return user?.email || null
}

// Enhanced getCurrentUser that ensures email is available
export function getCurrentUserWithEmail() {
  const user = getCurrentUser()
  if (!user) return null

  return {
    ...user,
    email: user.email, // Use email directly
  }
}

export const getCurrentUserWithId = getCurrentUserWithEmail

// Email-to-ID mapping for Firebase compatibility (keep for existing data)
const EMAIL_TO_ID_MAP: Record<string, string> = {
  "aline.uwimana@student.rw": "user_aline_001",
  "promesserukundo@gmail.com": "user_promesse_002",
  "test@example.com": "user_test_003",
  // Add more mappings as needed
}

// Convert email to Firebase-safe ID (for path safety)
export function emailToFirebaseId(email: string): string {
  return email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
}

// Get Firebase-safe ID for conversation paths
export function getFirebaseId(email: string): string {
  if (!email) return "unknown_user"
  return emailToFirebaseId(email)
}

// Extract email from Firebase-safe ID (reverse operation)
export function firebaseIdToEmail(firebaseId: string): string {
  // Fallback: user likely used email directly
  return firebaseId
}
