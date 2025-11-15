'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Zap, BookMarked, Home, Menu, X, BarChart3, Users, Settings } from 'lucide-react'
import { SimpleThemeToggle } from './simple-theme-toggle'

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
  { label: 'Peer Tutoring', href: '/peer-tutoring', icon: Users },
  { label: 'Quix Editor', href: '/quix-editor', icon: Settings, badge: 'Create' },
]

export function FloatingNavbar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
      {/* Desktop/Tablet floating rail */}
      <motion.nav
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        className="hidden md:flex fixed bottom-16 left-8 z-40 bg-card border border-border/50 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex-col"
      >
        <div className="flex flex-col h-auto max-h-100 p-3 gap-3">
          {/* Header with toggle */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1"
                >
                  <h3 className="text-sm font-semibold glow-text">
                    Qouta
                  </h3>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0"
              aria-label="Toggle navbar"
            >
              {isExpanded ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-thin">
            <AnimatePresence>
              {navItems.map((item, i) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`relative flex items-center justify-center ${isExpanded ? 'justify-start' : ''} gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                      }`}
                      whileHover={{ x: isExpanded ? 6 : 0 }}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        />
                      )}
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between flex-1 min-w-0"
                          >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Divider */}
          {isExpanded && <div className="h-px bg-border/30" />}

          {/* Bottom actions */}
          <div className="flex items-center gap-2 justify-center py-2 border-t border-border/30">
            <SimpleThemeToggle />

            {isExpanded && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

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

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-3xl">
          <ul className="grid grid-cols-5">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href} className="flex">
                  <Link
                    href={item.href}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs ${active ? 'text-primary' : 'text-foreground/70'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
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
