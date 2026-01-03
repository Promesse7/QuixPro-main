'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-db'
import { UserBadges } from '@/components/badges/UserBadges'
import { Loader2, ArrowLeft, Trophy, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
    if (user?.id) {
      const fetchBadges = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/badges/${user.id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch your badge collection.')
          }
          const data = await response.json()
          setBadges(data.badges || [])
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

  const earnedCount = badges.length

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

    return (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {badges.reduce((sum, badge) => sum + badge.points, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2">🏆</div>
                <div className="text-2xl font-bold">
                  {badges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length}
                </div>
                <div className="text-sm text-muted-foreground">Rare+ Badges</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Badges */}
        <UserBadges showAll={true} />
      </div>
    )
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
            You've earned <span className="font-bold text-primary">{badges.length}</span> badges. Keep up the great work!
            </p>
        )}
      </div>
      {renderContent()}
    </motion.div>
  )
}
