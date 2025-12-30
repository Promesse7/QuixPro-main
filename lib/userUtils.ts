import { UserAccountManager } from './userAccount'

// Get the current user's unique ID from session/localStorage
export function getCurrentUserId(): string | null {
  if (typeof window !== 'undefined') {
    // Try to get from session first
    const sessionData = sessionStorage.getItem('currentUser')
    if (sessionData) {
      const user = JSON.parse(sessionData)
      return user.uniqueUserId || null
    }

    // Fallback to localStorage
    const localData = localStorage.getItem('currentUser')
    if (localData) {
      const user = JSON.parse(localData)
      return user.uniqueUserId || null
    }
  }
  return null
}

// Get current user with full details
export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const sessionData = sessionStorage.getItem('currentUser')
    if (sessionData) {
      return JSON.parse(sessionData)
    }

    const localData = localStorage.getItem('currentUser')
    if (localData) {
      return JSON.parse(localData)
    }
  }
  return null
}

// Get user by ID (for other users, not current user)
export function getCurrentUserWithId(userId: string): any {
  // This would typically fetch from API/database
  // For now, return a basic structure
  return {
    uniqueUserId: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    role: 'student'
  }
}

// Set current user in session/localStorage
export function setCurrentUser(user: { uniqueUserId: string; email: string; name: string; role: string }): void {
  if (typeof window !== 'undefined') {
    const userData = JSON.stringify(user)
    sessionStorage.setItem('currentUser', userData)
    localStorage.setItem('currentUser', userData)
  }
}

// Ensure current user has unique ID (for legacy users)
export function ensureCurrentUserUniqueId(email: string, name?: string): string {
  if (typeof window !== 'undefined') {
    const currentUserId = getCurrentUserId()
    
    if (currentUserId) {
      return currentUserId
    }
    
    // Create a unique ID for legacy user
    const uniqueUserId = `legacy_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
    
    // Set the user with unique ID
    setCurrentUser({
      uniqueUserId,
      email,
      name: name || email.split('@')[0],
      role: 'student'
    })
    
    return uniqueUserId
  }
  
  return email // Fallback
}

// Clear current user session
export function clearCurrentUser(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('currentUser')
    localStorage.removeItem('currentUser')
  }
}

// Convert email to Firebase-safe ID (for backward compatibility)
export function emailToFirebaseId(email: string): string {
  return email.replace(/[.@]/g, '_')
}

// Get Firebase-safe ID from user ID or email
export function getFirebaseId(identifier: string): string {
  // If it's already a Firebase-safe ID, return as-is
  if (identifier.includes('_') && !identifier.includes('@')) {
    return identifier
  }
  
  // If it's an email, convert to Firebase-safe ID
  if (identifier.includes('@')) {
    return emailToFirebaseId(identifier)
  }
  
  // If it's a unique user ID, use it directly
  return identifier
}

// Legacy function for backward compatibility
export function emailToId(email: string): string {
  return emailToFirebaseId(email)
}
