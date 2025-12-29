"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  BookOpen, 
  Zap, 
  BookMarked, 
  BarChart3, 
  Users, 
  MessageCircle, 
  Video, 
  Settings,
  Plus,
  Brain,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

interface QuickNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description: string
  color: string
}

const quickNavItems: QuickNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Your personal overview",
    color: "from-blue-500/20 to-transparent"
  },
  {
    label: "Explore Courses",
    href: "/explore",
    icon: BookOpen,
    badge: "Learn",
    description: "Discover new topics",
    color: "from-green-500/20 to-transparent"
  },
  {
    label: "Practice Quiz",
    href: "/quiz",
    icon: Zap,
    badge: "Practice",
    description: "Test your knowledge",
    color: "from-yellow-500/20 to-transparent"
  },
  {
    label: "Stories",
    href: "/stories",
    icon: BookMarked,
    badge: "Inspire",
    description: "Read success stories",
    color: "from-purple-500/20 to-transparent"
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart3,
    description: "View rankings",
    color: "from-orange-500/20 to-transparent"
  },
  {
    label: "Study Groups",
    href: "/groups",
    icon: Users,
    description: "Join communities",
    color: "from-pink-500/20 to-transparent"
  }
]

const teacherQuickNavItems: QuickNavItem[] = [
  {
    label: "Teacher Dashboard",
    href: "/teacher",
    icon: BarChart3,
    badge: "Teach",
    description: "Manage your classes",
    color: "from-blue-500/20 to-transparent"
  },
  {
    label: "Create Quiz",
    href: "/teacher/quiz/create",
    icon: Plus,
    badge: "Build",
    description: "Create assessments",
    color: "from-green-500/20 to-transparent"
  },
  {
    label: "My Classes",
    href: "/teacher/classes",
    icon: Users,
    description: "View student progress",
    color: "from-purple-500/20 to-transparent"
  },
  {
    label: "Analytics",
    href: "/teacher/analytics",
    icon: TrendingUp,
    description: "Track performance",
    color: "from-orange-500/20 to-transparent"
  },
  {
    label: "Resources",
    href: "/teacher/resources",
    icon: BookOpen,
    description: "Teaching materials",
    color: "from-pink-500/20 to-transparent"
  },
  {
    label: "Quix Editor",
    href: "/quix-editor",
    icon: Settings,
    badge: "Create",
    description: "Advanced quiz builder",
    color: "from-yellow-500/20 to-transparent"
  }
]

interface QuickNavigationProps {
  className?: string
  showCreateButton?: boolean
}

export function QuickNavigation({ className = "", showCreateButton = true }: QuickNavigationProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isTeacher, setIsTeacher] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsTeacher(currentUser?.role === 'teacher')
  }, [])

  const currentNavItems = isTeacher && pathname?.startsWith('/teacher') 
    ? teacherQuickNavItems 
    : quickNavItems

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/teacher') return pathname === '/teacher'
    return pathname?.startsWith(href)
  }

  if (!user) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold glow-text">Quick Navigation</h3>
        {showCreateButton && (
          <Button asChild size="sm" className="glow-effect">
            <Link href={isTeacher ? "/teacher/quiz/create" : "/quix-editor"}>
              <Plus className="h-4 w-4 mr-2" />
              {isTeacher ? "Create Quiz" : "Quix Editor"}
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Card className={`glass-effect border-border/50 hover:glow-effect transition-all duration-300 cursor-pointer ${
                active ? 'ring-2 ring-primary/50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{item.label}</h4>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      {active && (
                        <div className="flex items-center mt-2 text-primary">
                          <span className="text-xs font-medium">Current page</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="glass-effect border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Recent Activity</h4>
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-muted-foreground">
                {isTeacher ? 'Student completed quiz' : 'Quiz completed'}
              </p>
              <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-xs text-muted-foreground">
                New achievement unlocked
              </p>
              <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-xs text-muted-foreground">
                Study group activity
              </p>
              <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
