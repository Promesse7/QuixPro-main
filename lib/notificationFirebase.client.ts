"use client"

import { useState, useEffect } from 'react'
import { notificationFirebase } from './notificationFirebase'

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
