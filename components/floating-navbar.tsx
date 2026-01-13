'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Zap, BookMarked, Home, Menu, X, BarChart3, Users, Settings, MessageCircle, Video, Heart } from 'lucide-react'
import { SimpleThemeToggle } from './simple-theme-toggle'
import { getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Courses', href: '/explore', icon: BookOpen, badge: 'Learn' },
  { label: 'Quiz', href: '/quiz', icon: Zap, badge: 'Practice' },
  { label: 'Stories', href: '/stories', icon: BookMarked, badge: 'Inspire' },
  { label: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
  { label: 'Groups', href: '/groups', icon: Users },
  { label: 'Quix Sites', href: '/quix-sites', icon: BookOpen },
  { label: 'Chat', href: '/chat', icon: MessageCircle },
  { label: 'Loved Ones', href: '/loved-ones', icon: Heart, badge: '💕' },
  { label: 'Video', href: '/video', icon: Video },
  { label: 'Peer Tutoring', href: '/peer-tutoring', icon: Users },
  { label: 'Quix Editor', href: '/quix-editor', icon: Settings, badge: 'Create' },
]

const teacherNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/teacher', icon: BarChart3, badge: 'Teach' },
  { label: 'Create Quiz', href: '/teacher/quiz/create', icon: Zap, badge: 'Build' },
  { label: 'My Classes', href: '/teacher/classes', icon: Users },
  { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
  { label: 'Resources', href: '/teacher/resources', icon: BookOpen },
  { label: 'Quix Editor', href: '/quix-editor', icon: Settings, badge: 'Create' },
]

export function FloatingNavbar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    setMounted(true)

    let mountedFlag = true
      // Try to resolve the current user client-side (the auth helper used elsewhere)
      ; (async () => {
        try {
          const u = await getCurrentUser()
          if (mountedFlag) setUser(u)
        } catch (err) {
          // ignore — user remains null if not logged in
        }
      })()

    return () => {
      mountedFlag = false
    }
  }, [])

  if (!mounted) {
    return null
  }

  // Hide navbar entirely on landing and auth pages when no user is present
  const onPublicLandingOrAuth = pathname === '/' || pathname?.startsWith('/auth')
  if (onPublicLandingOrAuth && !user) {
    return null
  }

  // Choose navigation items based on user role
  const currentNavItems = user?.role === 'teacher' && pathname?.startsWith('/teacher')
    ? teacherNavItems
    : navItems

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const containerVariants = {
    collapsed: {
      width: '72px',
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
    expanded: {
      width: '280px',
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
  }

  return (
    <>
      {/* Desktop/Tablet: when collapsed show a single circular toggle button */}
      {!isExpanded && (
        <div className="hidden md:flex fixed bottom-16 left-8 z-40">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-card border border-border/50 shadow-xl backdrop-blur-md flex items-center justify-center p-2 hover:scale-105 transition-transform"
            aria-label="Open navbar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Desktop/Tablet floating rail (expanded view) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.nav
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="hidden md:flex fixed bottom-16 left-8 z-40 bg-card border border-border/50 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex-col"
            aria-hidden={!isExpanded}
          >
            <div className="flex flex-col h-auto max-h-100 p-3 gap-3">
              {/* Header with toggle */}
              <div className="flex items-center justify-between">
                <motion.div
                  key="expanded-header"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1"
                >
                  <h3 className="text-sm font-semibold glow-text">
                    Qouta
                  </h3>
                </motion.div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0"
                  aria-label="Close navbar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-thin">
                <AnimatePresence>
                  {currentNavItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          className={`relative flex items-center justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${active
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                            }`}
                          whileHover={{ x: 6 }}
                        >
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                            />
                          )}
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary whitespace-nowrap ml-2"
                              >
                                {item.badge}
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/30" />

              {/* Bottom actions */}
              <div className="flex items-center gap-2 justify-center py-2 border-t border-border/30">
                <SimpleThemeToggle />

                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay when expanded on mobile (not used now because rail is hidden on mobile) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-30 md:hidden bg-black/30 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Mobile bottom bar - Enhanced "Dock" Style */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="mx-auto max-w-sm bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl px-1">
          <ul className="flex items-center justify-between h-14">
            {currentNavItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-0.5 h-full transition-all duration-300 ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <div className={cn(
                      "p-1.5 rounded-xl transition-all",
                      active ? "bg-primary/10" : ""
                    )}>
                      <Icon className={cn("h-5 w-5", active ? "stroke-[2.5px]" : "stroke-[2px]")} />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
