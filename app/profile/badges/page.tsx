'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { BadgeShowcase } from '@/components/gamification/BadgeShowcase' // Corrected: Named import
import { Loader2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BadgesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Corrected: Fetch user using the established pattern
  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.push('/auth') // Redirect if not logged in
    } else {
      setUser(u)
    }
  }, [router])

  useEffect(() => {
    if (user?._id) {
      const fetchBadges = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/badges?userId=${user._id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch your badge collection.')
          }
          const data = await response.json()
          setBadges(data.badges)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchBadges()
    } else if (user === null && !getCurrentUser()) {
        // Only stop loading if we are sure there is no user
        setLoading(false)
    }
  }, [user])

  const earnedCount = badges.filter(b => b.isEarned).length

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your badge collection...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-destructive/10 border border-destructive/50 rounded-lg">
          <p className="text-destructive font-semibold">Something went wrong</p>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      )
    }
    
    // This check is now more robust
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <p className="text-muted-foreground mb-4">Please log in to see your achievements.</p>
                <Button asChild>
                    <Link href="/auth">Sign In</Link>
                </Button>
            </div>
        )
    }

    return <BadgeShowcase badges={badges} earnedCount={earnedCount} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-10">
        <Button variant="outline" asChild>
            <Link href="/profile" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
            </Link>
        </Button>
      </div>
      <div className="relative text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Badge Collection</h1>
        {!loading && !error && user && (
            <p className="mt-4 text-lg text-muted-foreground">
            You've earned <span className="font-bold text-primary">{earnedCount}</span> out of {badges.length} possible badges. Keep up the great work!
            </p>
        )}
      </div>
      {renderContent()}
    </motion.div>
  )
}
