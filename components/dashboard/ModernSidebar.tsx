"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Home,
  Target,
  BookOpen,
  MessageSquare,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Award,
  Clock,
  FileText,
  HelpCircle,
  Bell,
  Flame
} from "lucide-react"

interface ModernSidebarProps {
  user?: {
    name: string
    email: string
    level: string
    avatar: string
    points?: number
    streak?: number
  }
  isCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  description?: string
  isPro?: boolean
}

export function ModernSidebar({
  user = { name: "User", email: "user@example.com", level: "Beginner", avatar: "", points: 0, streak: 0 },
  isCollapsed = false,
  onCollapse = () => { }
}: ModernSidebarProps) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("main")

  const mainNavigation: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard",
      description: "Overview and stats"
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: <Target className="w-5 h-5" />,
      href: "/quiz-selection",
      description: "Take quizzes",
      badge: "New"
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/explore",
      description: "Browse courses"
    },
    {
      id: "insights",
      label: "Insights",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/leaderboard",
      description: "Progress & analytics"
    },
    {
      id: "groups",
      label: "Groups",
      icon: <Users className="w-5 h-5" />,
      href: "/groups",
      description: "Study groups",
      badge: "3"
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/chat",
      description: "AI Assistant",
      badge: "•"
    },
  ]

  const secondaryNavigation: NavItem[] = [
    {
      id: "quix-sites",
      label: "Quix Sites",
      icon: <Globe className="w-5 h-5" />,
      href: "/quix-sites",
      description: "Create sites",
      isPro: true
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard",
      description: "Schedule"
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: <Award className="w-5 h-5" />,
      href: "/certificates",
      description: "Your achievements"
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/profile",
      description: "Preferences"
    },
  ]

  const isActive = (href: string) => pathname === href

  const NavItemComponent = ({ item, isSecondary = false }: { item: NavItem, isSecondary?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium",
        isActive(item.href)
          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        isCollapsed && "justify-center px-2"
      )}
      onMouseEnter={() => !isCollapsed && setActiveSection(isSecondary ? "secondary" : "main")}
    >
      {/* Active indicator */}
      {isActive(item.href) && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 transition-colors",
        isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {item.icon}
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.isPro && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Sparkles className="w-3 h-3 mr-0.5" />
                    Pro
                  </Badge>
                )}
                {item.badge && (
                  <Badge
                    variant={item.badge === "•" ? "default" : "secondary"}
                    className="text-xs px-1.5 py-0.5 h-5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover effect */}
      {!isCollapsed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        />
      )}
    </Link>
  )

  return (
    <motion.div
      className={cn(
        "flex flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/50 relative z-40",
        isCollapsed ? "w-20" : "w-72"
      )}
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-xl blur-sm opacity-60" />
                  <div className="relative bg-gradient-to-br from-primary to-purple-600 rounded-xl p-2">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Quix
                  </h1>
                  <p className="text-xs text-muted-foreground">Learning Platform</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapse(!isCollapsed)}
            className="h-8 w-8 rounded-lg hover:bg-muted/50"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mb-3"
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Main
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <nav className="space-y-1">
              {mainNavigation.map((item) => (
                <NavItemComponent key={item.id} item={item} />
              ))}
            </nav>
          </div>

          <Separator className="my-4" />

          {/* Secondary Navigation */}
          <div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mb-3"
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    More
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => (
                <NavItemComponent key={item.id} item={item} isSecondary />
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-border/30">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600">
                    <Flame className="w-3 h-3" />
                    <span className="text-xs font-bold">{user.streak || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-600">
                    <Star className="w-3 h-3" />
                    <span className="text-xs font-bold">{user.points?.toLocaleString() || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-card to-muted border border-border/50">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {user.level}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 text-primary font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 text-center">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-bold text-orange-600">{user.streak || 0}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
