"use client"

import Link from "next/link"
import { ChevronRight, Home, Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Crumb = { 
  label: string; 
  href?: string; 
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function AppBreadcrumb({ items, className }: { items: Crumb[], className?: string }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Add scroll effect for better mobile experience
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      className={cn(
        "sticky top-0 z-20 bg-background/80 backdrop-blur-sm transition-all duration-300",
        isScrolled ? "py-2 border-b" : "py-3",
        className
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
    >
      <div className="container flex items-center overflow-x-auto hide-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1 text-sm"
          >
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium whitespace-nowrap",
                      item.isLoading && "pointer-events-none opacity-70"
                    )}
                  >
                    {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                    <span className="truncate max-w-[180px] sm:max-w-none">{item.label}</span>
                    {item.isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-1" />}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-foreground font-semibold whitespace-nowrap">
                    {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                    <span className="truncate max-w-[180px] sm:max-w-none">
                      {item.label}
                    </span>
                    {item.isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-1" />}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.nav>
  )
}
