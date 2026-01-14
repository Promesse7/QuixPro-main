'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, logout } from "@/lib/auth"
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { QuickStartCTA } from "@/components/app/QuickStartCTA"
import { Mail, GraduationCap, Award, Settings, ArrowRight, Loader2 } from "lucide-react"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"
import AvatarWithLevel from "@/components/user/AvatarWithLevel"
import { Badge as UiBadge } from "@/components/ui/badge" // Renamed to avoid conflict

// Component to display a single badge icon
const BadgeIcon = ({ badge, size = 'md' }: { badge: any, size?: 'sm' | 'md' }) => {
  const sizeClasses = size === 'md' ? 'w-16 h-16' : 'w-12 h-12'
  return (
    <div className={`relative flex flex-col items-center group cursor-pointer`}>
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center bg-accent/50 border-2 border-dashed border-border/50 group-hover:border-primary transition-all duration-300`}
      >
        <span className="text-2xl">{badge.icon}</span>
      </div>
      <div className="absolute -bottom-8 w-max text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background border p-2 rounded-md shadow-lg text-xs z-10">
        <p className="font-bold">{badge.name}</p>
        <p className="text-muted-foreground">{badge.description}</p>
      </div>
    </div>
  )
}


// The new dynamic badge section for the profile page
const ProfileBadgeSection = ({ userId }: { userId: string }) => {
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/badges?userId=${userId}`)
        const data = await response.json()
        if (data.badges) {
            // Sort by earned date, most recent first, and take the top 3
            const earned = data.badges.filter((b: any) => b.isEarned)
            earned.sort((a: any, b: any) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
            setBadges(earned.slice(0, 3))
        }
      } catch (error) {
        console.error("Failed to fetch recent badges", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBadges()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
        {badges.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
                <div className="flex justify-center gap-4">
                    {badges.map((badge) => (
                        <BadgeIcon key={badge.badgeId} badge={badge} />
                    ))}
                </div>
                <Button asChild variant="secondary" size="sm">
                    <Link href="/profile/badges">
                        View All Badges <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Badges will appear here as you earn them.</p>
                 <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link href="/profile/badges">
                        Explore All Badges
                    </Link>
                </Button>
            </div>
        )}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.push('/auth')
      return
    }
    setUser(u)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={{ name: user.name, email: user.email, level: user.level || '—', avatar: user.avatar || '' }} />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4"><AppBreadcrumb items={[{ label: 'Home', href: '/dashboard' }, { label: 'Profile' }]} /></div>
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              {/* Profile Card (Left Column) */}
              <Card className="glass-effect border-border/50 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="glow-text">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AvatarWithLevel totalXP={user?.gamification?.totalXP || 0} src={user.avatar || undefined} alt={user.name} size={80} />
                        <div>
                            <div className="text-xl font-semibold">{user.name}</div>
                            <div className="flex items-center gap-2 text-muted-foreground justify-center">
                                <Mail className="h-4 w-4" /> {user.email}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border/50 pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground">Role</div>
                            <UiBadge variant="secondary">{user.role}</UiBadge>
                        </div>
                        {user.level && (
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Level</div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span className="font-medium">{user.level}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-border/50 pt-4 flex flex-col gap-2">
                        <Button asChild variant="outline" size="sm"><Link href="/settings"><Settings className="h-4 w-4 mr-2" /> Account Settings</Link></Button>
                        <Button onClick={() => logout()} variant="destructive" size="sm">Logout</Button>
                    </div>
                </CardContent>
              </Card>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-8">
                <QuickStartCTA />

                <Card className="glass-effect border-border/50">
                    <CardHeader>
                        <CardTitle className="glow-text">Recent Badges</CardTitle>
                        <CardDescription>Your latest achievements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Corrected: Pass the user ID to the new component */}
                        <ProfileBadgeSection userId={user._id} />
                    </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                    <CardHeader>
                        <CardTitle className="glow-text">Preferences</CardTitle>
                        <CardDescription>Customize your experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center justify-between">
                            <div className="font-medium">Theme</div>
                            <SimpleThemeToggle />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="font-medium">Manage Account</div>
                            <Button asChild variant="outline"><Link href="/settings">Go to Settings</Link></Button>
                        </div>
                    </CardContent>
                </Card>
              </div>
            </div>
        </div>
      </PageTransition>
    </div>
  )
}
