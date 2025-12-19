export interface GuestSession {
    sessionId: string
    quizAttempts: Array<{
      quizId: string
      score: number
      completedAt: Date
      answers: Record<string, string>
    }>
    browsedCourses: string[]
    readStories: string[]
    createdAt: Date
    lastActive: Date
  }
  
  const GUEST_SESSION_KEY = 'qouta_guest_session'
  
  export function getGuestSession(): GuestSession | null {
    if (typeof window === 'undefined') return null
    
    const stored = localStorage.getItem(GUEST_SESSION_KEY)
    if (!stored) return null
    
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  
  export function createGuestSession(): GuestSession {
    const session: GuestSession = {
      sessionId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quizAttempts: [],
      browsedCourses: [],
      readStories: [],
      createdAt: new Date(),
      lastActive: new Date()
    }
    
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session))
    return session
  }
  
  export function updateGuestSession(updates: Partial<GuestSession>): void {
    const session = getGuestSession() || createGuestSession()
    const updated = { ...session, ...updates, lastActive: new Date() }
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated))
  }
  
  export function recordGuestQuizAttempt(quizId: string, score: number, answers: Record<string, string>): void {
    const session = getGuestSession() || createGuestSession()
    
    session.quizAttempts.push({
      quizId,
      score,
      completedAt: new Date(),
      answers
    })
    
    session.lastActive = new Date()
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session))
  }
  
  export function clearGuestSession(): void {
    localStorage.removeItem(GUEST_SESSION_KEY)
  }
  
  export function getGuestQuizAttempts(): number {
    const session = getGuestSession()
    return session?.quizAttempts.length || 0
  }
  
  export function shouldPromptSignup(): boolean {
    const attempts = getGuestQuizAttempts()
    // Prompt after 2 quiz attempts
    return attempts >= 2
  }
