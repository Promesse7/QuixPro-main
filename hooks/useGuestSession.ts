"use client"
import { useState, useEffect } from 'react'
import { 
  getGuestSession, 
  createGuestSession, 
  updateGuestSession,
  GuestSession 
} from '@/lib/guest-session'

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(null)
  const [isGuest, setIsGuest] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('qouta_user')
    setIsGuest(!user)

    if (!user) {
      // Get or create guest session
      const guestSession = getGuestSession() || createGuestSession()
      setSession(guestSession)
    }
  }, [])

  const updateSession = (updates: Partial<GuestSession>) => {
    if (isGuest) {
      updateGuestSession(updates)
      setSession({ ...session, ...updates } as GuestSession)
    }
  }

  return {
    session,
    isGuest,
    updateSession
  }
}