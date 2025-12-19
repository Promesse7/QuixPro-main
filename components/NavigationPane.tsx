"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function NavigationPane() {
  const router = useRouter()
  const pathname = usePathname()

  const goBack = () => {
    try {
      router.back()
    } catch (e) {
      // fallback
      if (typeof window !== 'undefined') window.history.back()
    }
  }

  const goForward = () => {
    if (typeof window !== 'undefined') window.history.forward()
  }

  // Minimal, non-intrusive UI: small pill in top-left
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur rounded-full border border-border/30 shadow-sm p-1">
        <button
          aria-label={`Go back from ${pathname}`}
          onClick={goBack}
          className="p-2 rounded-full hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          aria-label={`Go forward from ${pathname}`}
          onClick={goForward}
          className="p-2 rounded-full hover:bg-muted/40 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
