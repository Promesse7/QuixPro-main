"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { PageTransition } from "@/components/ui/page-transition"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { QuickStartCTA } from "@/components/app/QuickStartCTA"
import { Mail, GraduationCap, Award, Settings } from "lucide-react"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"
import AvatarWithLevel from "@/components/user/AvatarWithLevel"
import { logout } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [language, setLanguage] = useState<string>("en")
  const [dailyGoal, setDailyGoal] = useState<number>(500)

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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={{ name: user.name, email: user.email, level: user.level || '—', avatar: user.avatar || '' }} />

      <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4"><AppBreadcrumb items={[{ label: 'Home', href: '/dashboard' }, { label: 'Profile' }]} /></div>
        <QuickStartCTA />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          <Card className="glass-effect border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="glow-text">Your Profile</CardTitle>
              <CardDescription>Basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <AvatarWithLevel totalXP={user?.gamification?.totalXP || 0} src={user.avatar || "/student-avatar.png"} alt={user.name} size={64} />
                <div>
                  <div className="text-xl font-semibold">{user.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Role</div>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              {user.level && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Level</div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-medium">{user.level}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button asChild className="glow-effect" size="sm">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/settings"><Settings className="h-4 w-4 mr-2" /> Settings</Link>
                </Button>
                <Button onClick={() => logout()} variant="destructive" size="sm">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="glow-text">Progress Overview</CardTitle>
                <CardDescription>Your learning summary</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-accent/20">
                  <div className="text-sm text-muted-foreground">Total Quizzes</div>
                  <div className="text-2xl font-bold">—</div>
                </div>
                <div className="p-4 rounded-lg bg-accent/20">
                  <div className="text-sm text-muted-foreground">Average Score</div>
                  <div className="text-2xl font-bold">—</div>
                </div>
                <div className="p-4 rounded-lg bg-accent/20">
                  <div className="text-sm text-muted-foreground">Certificates</div>
                  <div className="text-2xl font-bold">—</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="glow-text">Badges</CardTitle>
                <CardDescription>Your earned achievements</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border border-dashed p-6 text-center">Badges will appear here as you earn them.</div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="glow-text">Preferences</CardTitle>
                <CardDescription>Theme, language, and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Theme</div>
                    <div className="text-xs text-muted-foreground">Switch between light and dark</div>
                  </div>
                  <SimpleThemeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Language</div>
                    <div className="text-xs text-muted-foreground">Choose your preferred language</div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-background border border-border/50 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="en">English</option>
                    <option value="rw">Kinyarwanda</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Daily Goal</div>
                    <div className="text-xs text-muted-foreground">Target XP to earn per day</div>
                  </div>
                  <input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(parseInt(e.target.value || '0'))}
                    className="w-28 bg-background border border-border/50 rounded-md px-3 py-2 text-sm"
                    min={0}
                    step={50}
                  />
                </div>

                <div className="pt-2">
                  <Button size="sm" className="glow-effect">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="glow-text">Account</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/settings">Open Settings</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/certificates"><Award className="h-4 w-4 mr-2" /> View Certificates</Link>
                  </Button>
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
