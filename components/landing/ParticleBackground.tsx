'use client'
import React from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Lightweight canvas particle background.
 * Respects prefers-reduced-motion and only runs on client.
 * Designed for subtle accenting behind the hero.
 */
export default function ParticleBackground({ className = '' }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const ref = React.useRef<HTMLCanvasElement | null>(null)
  const raf = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.max(1, window.devicePixelRatio || 1)
    function resize() {
      canvas.width = canvas.clientWidth * DPR
      canvas.height = canvas.clientHeight * DPR
    }
    resize()

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const count = Math.max(16, Math.floor((canvas.width * canvas.height) / (90000 * DPR)))

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // subtle backdrop gradient
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      g.addColorStop(0, 'rgba(45,212,247,0.02)')
      g.addColorStop(1, 'rgba(139,92,246,0.02)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // particles
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = 'rgba(45,212,247,0.9)'
        ctx.globalAlpha = 0.6
        ctx.arc(p.x, p.y, p.r * DPR, 0, Math.PI * 2)
        ctx.fill()
      }

      // light connections
      ctx.globalAlpha = 0.06
      ctx.strokeStyle = 'rgba(139,92,246,0.6)'
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80 * DPR) {
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf.current = requestAnimationFrame(draw)
    }

    raf.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
    }
  }, [prefersReducedMotion])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <canvas ref={ref} className="w-full h-full block" />
    </div>
  )
}
