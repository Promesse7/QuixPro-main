"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Brain,
  Trophy,
  Award,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LeftSidebarProps {
  user: any
}

export function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "start-quiz", label: "Start a Quiz", icon: Target, href: "/quiz-selection" },
    { id: "courses", label: "My Courses", icon: BookOpen, href: "/explore" },
    { id: "groups", label: "Groups", icon: Users, href: "/groups" },
    { id: "peers", label: "Peers", icon: Users, href: "/peers" },
    { id: "insights", label: "Insights", icon: BarChart3, href: "/leaderboard" },
    { id: "stories", label: "Stories", icon: FileText, href: "/stories" },
    { id: "certificates", label: "Certificates", icon: Award, href: "/certificates" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
    { id: "settings", label: "Settings", icon: Settings, href: "/profile" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl border-r border-border/50 fixed left-0 top-0 h-screen overflow-y-auto">
      {/* Header Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-[22px] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Quix
            </h1>
            <p className="text-xs text-muted-foreground font-medium">Social Learning</p>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">Level {user?.level || 1}</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="truncate">{user?.school || "School"}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group",
              isActive(item.href)
                ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <item.icon className={cn("w-5 h-5 transition-colors", isActive(item.href) ? "text-primary" : "")} />
            <span>{item.label}</span>
            {isActive(item.href) && <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </Link>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-border/50 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
 