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
      width: '60px',
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
    expanded: {
      width: '280px',
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: isExpanded ? i * 0.05 : 0,
        duration: 0.3,
      },
    }),
  }

  return (
    <>
      <motion.nav
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        className="fixed bottom-8 left-8 z-40 bg-card border border-border/50 rounded-2xl shadow-xl backdrop-blur-md h-auto max-h-[calc(100vh-100px)] overflow-hidden"
      >
        <div className="flex flex-col h-full p-3">
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-4">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 ml-2"
                >
                  <h3 className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Qouta
                  </h3>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {isExpanded ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Navigation items */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50">
            <AnimatePresence>
              {navItems.map((item, i) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isExpanded ? 'visible' : 'hidden'}
                  >
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: isExpanded ? 6 : 0 }}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                        }`}
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
                              className="flex items-center justify-between flex-1 min-w-0"
                            >
                              <span className="text-sm font-medium truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary whitespace-nowrap ml-2">
                                  {item.badge}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Divider */}
          {isExpanded && <div className="my-2 h-px bg-border/30" />}

          {/* Bottom actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <SimpleThemeToggle />

            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Overlay when expanded on mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
