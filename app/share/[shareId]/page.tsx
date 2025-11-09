'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, Copy, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { getBaseUrl } from '@/lib/getBaseUrl'

interface SharedBadgeContent {
  badgeName: string
  badgeIcon: string
  badgeColor: string
  badgeDescription: string
  userName: string
  userAvatar?: string
  customMessage: string
  earnedAt: string
}

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [content, setContent] = useState<SharedBadgeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true)
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/api/share/badge?shareId=${shareId}`)

        if (!res.ok) {
          const errorData = await res.json()
          setError(errorData.error || 'Failed to load shared content')
          return
        }

        const data = await res.json()
        setContent(data.content)
      } catch (err) {
        setError('Failed to load the shared badge')
        console.error('Share page error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      fetchSharedContent()
    }
  }, [shareId])

  const handleCopyLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading achievement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="glass-effect border-border/50 max-w-md w-full">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Oops!</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="glass-effect border-border/50 max-w-md w-full">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Content Not Found</h3>
            <p className="text-muted-foreground mb-6">The shared achievement could not be found.</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect border-border/50 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                {content.badgeIcon}
              </motion.div>
              <CardTitle className="text-3xl glow-text">
                {content.userName} earned the
              </CardTitle>
              <CardTitle className="text-2xl text-primary mt-2">
                {content.badgeName} Badge
              </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="py-8 space-y-6">
              {/* Badge Description */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-muted-foreground text-sm mb-2 font-semibold uppercase tracking-wide">
                  Badge Achievement
                </p>
                <p className="text-foreground text-lg">{content.badgeDescription}</p>
              </div>

              {/* Custom Message */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-foreground italic">
                  "{content.customMessage}"
                </p>
              </div>

              {/* Share Section */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-semibold">Share this achievement:</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-3 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareId}`
                      const text = `Check out ${content.userName}'s achievement: ${content.badgeName} Badge on Qouta! 🎉`
                      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-600 px-4 py-3 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </motion.button>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Ready to earn your own badges? Join Qouta and start learning today!
                </p>
                <Button asChild size="lg" className="glow-effect">
                  <Link href="/">
                    Explore Qouta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Powered by Qouta • Making learning fun and social
          </p>
        </div>
      </div>
    </div>
  )
}
