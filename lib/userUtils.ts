import { type FirebaseUser, emailToUniqueId, isUniqueId, createChatId, getFirebaseId } from "./identifiers"

import { getCurrentUser as getAuthUser, setCurrentUser as setAuthUser } from "./auth"

export function getCurrentUserId(): string | null {
  const user = getAuthUser()
  // Prioritize explicit uniqueUserId, then derive from email, then null
  return user?.uniqueUserId || (user?.email ? emailToUniqueId(user.email) : null)
}

export function getCurrentUser(): any {
  return getAuthUser()
}

export function getCurrentUserWithId(userId: string): FirebaseUser | null {
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.uniqueUserId === userId) {
    return currentUser
  }
  return null
}

export function setCurrentUser(user: any): void {
  setAuthUser(user)
}

export function ensureCurrentUserUniqueId(email: string, name?: string): string {
  if (typeof window !== "undefined") {
    const currentUserId = getCurrentUserId()

    const uniqueUserId = emailToUniqueId(email)

    setCurrentUser({
      uniqueUserId,
      email,
      name: name || email.split("@")[0],
      role: "student",
    })

    return uniqueUserId
  }

  return emailToUniqueId(email)
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("currentUser")
    localStorage.removeItem("currentUser")
  }
}

export function emailToFirebaseId(email: string): string {
  return emailToUniqueId(email)
}

export function getFirebaseIdFromIdentifier(identifier: string): string {
  if (isUniqueId(identifier)) {
    return identifier
  }
  if (identifier.includes("@")) {
    return emailToUniqueId(identifier)
  }
  return identifier
}

export function emailToId(email: string): string {
  return emailToUniqueId(email)
}

export { createChatId, getFirebaseId }
