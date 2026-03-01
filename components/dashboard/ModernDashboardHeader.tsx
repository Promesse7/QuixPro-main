"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  Sparkles,
  TrendingUp,
  BookOpen,
  Users,
  Target,
  BarChart3,
  Calendar,
  Globe,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernDashboardHeaderProps {
  user?: {
    name: string
    email: string
    level: string
    avatar: string
  }
  onMobileMenuToggle?: () => void
}

export function ModernDashboardHeader({ 
  user = { name: "User", email: "user@example.com", level: "Beginner", avatar: "" },
  onMobileMenuToggle 
}: ModernDashboardHeaderProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const navigation = [
    { href: "/dashboard", label: "Overview", icon: <Brain className="w-4 h-4" /> },
    { href: "/quiz-selection", label: "Quizzes", icon: <Target className="w-4 h-4" /> },
    { href: "/explore", label: "Courses", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/leaderboard", label: "Insights", icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/groups", label: "Groups", icon: <Users className="w-4 h-4" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-r from-primary to-purple-600 rounded-xl p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Quix
              </h1>
              <p className="text-xs text-muted-foreground">Learn. Grow. Excel.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <div className="ml-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes, courses, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right Section - Notifications and User */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Actions</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/quiz-selection" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Start a Quiz</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/explore" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Browse Courses</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/groups" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Join Groups</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/leaderboard" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>View Progress</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-ping" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-border/50">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 text-primary font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="w-fit">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {user.level}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/certificates" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Certificates</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
