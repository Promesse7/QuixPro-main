import { getDatabase, ref, set, onValue, increment, remove } from 'firebase/database'
import { app } from '@/lib/firebaseClient'
import { useState, useEffect } from 'react'

// Firebase Realtime Database service for notification badge counts
export class NotificationFirebaseService {
  private db = getDatabase(app)

  // Update badge count for a user
  async updateBadgeCount(userId: string, counts: {
    total?: number
    chat?: number
    academic?: number
    social?: number
    system?: number
  }): Promise<void> {
    const userRef = ref(this.db, `notificationCounts/${userId}`)
    
    // Use increment for atomic updates
    const updates: Record<string, any> = {}
    
    if (counts.total !== undefined) {
      updates.total = increment(counts.total)
    }
    if (counts.chat !== undefined) {
      updates.chat = increment(counts.chat)
    }
    if (counts.academic !== undefined) {
      updates.academic = increment(counts.academic)
    }
    if (counts.social !== undefined) {
      updates.social = increment(counts.social)
    }
    if (counts.system !== undefined) {
      updates.system = increment(counts.system)
    }

    await set(userRef, updates)
  }

  // Set exact badge count (for initial load or full sync)
  async setBadgeCount(userId: string, counts: {
    total: number
    chat: number
    academic: number
    social: number
    system: number
  }): Promise<void> {
    const userRef = ref(this.db, `notificationCounts/${userId}`)
    await set(userRef, counts)
  }

  // Listen to badge count changes for a user
  onBadgeCountChange(userId: string, callback: (counts: {
    total: number
    chat: number
    academic: number
    social: number
    system: number
  }) => void): () => void {
    const userRef = ref(this.db, `notificationCounts/${userId}`)
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() || {
        total: 0,
        chat: 0,
        academic: 0,
        social: 0,
        system: 0
      }
      callback(data)
    })

    return unsubscribe
  }

  // Clear all badge counts for a user
  async clearBadgeCounts(userId: string): Promise<void> {
    const userRef = ref(this.db, `notificationCounts/${userId}`)
    await remove(userRef)
  }

  // Increment specific category count
  async incrementCategoryCount(userId: string, category: keyof Omit<{
    total: number
    chat: number
    academic: number
    social: number
    system: number
  }, 'total'>): Promise<void> {
    const userRef = ref(this.db, `notificationCounts/${userId}/${category}`)
    await set(userRef, increment(1))
    
    // Also increment total
    const totalRef = ref(this.db, `notificationCounts/${userId}/total`)
    await set(totalRef, increment(1))
  }

  // Decrement specific category count
  async decrementCategoryCount(userId: string, category: keyof Omit<{
    total: number
    chat: number
    academic: number
    social: number
    system: number
  }, 'total'>): Promise<void> {
    const userRef = ref(this.db, `notificationCounts/${userId}/${category}`)
    await set(userRef, increment(-1))
    
    // Also decrement total
    const totalRef = ref(this.db, `notificationCounts/${userId}/total`)
    await set(totalRef, increment(-1))
  }

  // Get current badge count (one-time fetch)
  async getBadgeCount(userId: string): Promise<{
    total: number
    chat: number
    academic: number
    social: number
    system: number
  }> {
    return new Promise((resolve) => {
      const userRef = ref(this.db, `notificationCounts/${userId}`)
      
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val() || {
          total: 0,
          chat: 0,
          academic: 0,
          social: 0,
          system: 0
        }
        unsubscribe()
        resolve(data)
      })
    })
  }
}

// Singleton instance
export const notificationFirebase = new NotificationFirebaseService()

// Helper function to categorize notification types
export function categorizeNotification(type: string): 'chat' | 'academic' | 'social' | 'system' {
  switch (type) {
    case 'chat':
      return 'chat'
    case 'quiz':
      return 'academic'
    case 'site':
      return 'academic'
    case 'group':
      return 'social'
    case 'system':
      return 'system'
    default:
      return 'system'
  }
}

// Hook for React components to listen to badge counts
export function useNotificationBadgeCount(userId: string) {
  const [counts, setCounts] = useState({
    total: 0,
    chat: 0,
    academic: 0,
    social: 0,
    system: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    const unsubscribe = notificationFirebase.onBadgeCountChange(userId, (newCounts) => {
      setCounts(newCounts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  return { counts, loading }
}
