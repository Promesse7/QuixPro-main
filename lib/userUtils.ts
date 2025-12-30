import { type FirebaseUser, emailToUniqueId, isUniqueId, createChatId, getFirebaseId } from "./identifiers"

export function getCurrentUserId(): string | null {
  if (typeof window !== "undefined") {
    const sessionData = sessionStorage.getItem("currentUser")
    if (sessionData) {
      const user = JSON.parse(sessionData) as FirebaseUser
      return user.uniqueUserId || null
    }

    const localData = localStorage.getItem("currentUser")
    if (localData) {
      const user = JSON.parse(localData) as FirebaseUser
      return user.uniqueUserId || null
    }
  }
  return null
}

export function getCurrentUser(): FirebaseUser | null {
  if (typeof window !== "undefined") {
    const sessionData = sessionStorage.getItem("currentUser")
    if (sessionData) {
      return JSON.parse(sessionData) as FirebaseUser
    }

    const localData = localStorage.getItem("currentUser")
    if (localData) {
      return JSON.parse(localData) as FirebaseUser
    }
  }
  return null
}

export function getCurrentUserWithId(userId: string): FirebaseUser | null {
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.uniqueUserId === userId) {
    return currentUser
  }
  return null
}

export function setCurrentUser(user: Partial<FirebaseUser> & { email: string }): void {
  if (typeof window !== "undefined") {
    const firebaseUser: FirebaseUser = {
      uniqueUserId: user.uniqueUserId || emailToUniqueId(user.email),
      email: user.email,
      name: user.name || user.email.split("@")[0],
      role: user.role || "student",
      profile: user.profile,
    }

    const userData = JSON.stringify(firebaseUser)
    sessionStorage.setItem("currentUser", userData)
    localStorage.setItem("currentUser", userData)
  }
}

export function ensureCurrentUserUniqueId(email: string, name?: string): string {
  if (typeof window !== "undefined") {
    const currentUserId = getCurrentUserId()

    if (currentUserId) {
      return currentUserId
    }

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
