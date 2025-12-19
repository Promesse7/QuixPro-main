'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false })
const NeuralGrid = dynamic(() => import('./NeuralGrid'), { ssr: false })

/**
 * HeroEnhancer wraps your existing HeroSection (unchanged) and adds:
 * - ParticleBackground (dynamic, client-only)
 * - NeuralGrid SVG (dynamic)
 * - mouse-tracking CSS variables for "magnetic" CTAs
 *
 * Usage:
 * <HeroEnhancer>
 *   <HeroSection />   // your existing component
 * </HeroEnhancer>
 *
 * To magnetize a CTA inside your existing HeroSection:
 * add data-magnetic attribute, e.g.
 * <Link href="/quiz" data-magnetic className="...">Start a Quiz</Link>
 *
 * Then in your CSS (global or component) you can apply:
 * [data-magnetic] { transform: translate(var(--mx,0), var(--my,0)); transition: transform 220ms cubic-bezier(.2,.9,.2,1); }
 */
export default function HeroEnhancer({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (prefersReducedMotion) return
    const el = wrapperRef.current
    if (!el) return

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      // scaled values for a gentle effect
      el.style.setProperty('--mx', `${(x / rect.width) * 18}px`)
      el.style.setProperty('--my', `${(y / rect.height) * 12}px`)
      el.style.setProperty('--cx', `${e.clientX}px`)
      el.style.setProperty('--cy', `${e.clientY}px`)
    }

    function onLeave() {
      el.style.setProperty('--mx', `0px`)
      el.style.setProperty('--my', `0px`)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [prefersReducedMotion])

  return (
    <div ref={wrapperRef} className="relative isolate overflow-visible" style={{ '--mx': '0px' } as React.CSSProperties}>
      {/* backgrounds; dynamic import to reduce SSR impact */}
      {!prefersReducedMotion && <ParticleBackground className="mix-blend-screen opacity-90" />}
      {!prefersReducedMotion && <NeuralGrid className="opacity-90" />}

      {/* content slot (your original hero stays unchanged) */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
