import React from "react"
import { useReducedMotion } from "framer-motion"

/**
 * Lightweight particle background:
 * - Uses canvas to draw subtle particles and connecting lines.
 * - React + requestAnimationFrame; falls back to CSS gradient if canvas unsupported.
 * - Respects prefers-reduced-motion.
 */
export default function ParticleBackground({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.clientWidth * devicePixelRatio)
    let height = (canvas.height = canvas.clientHeight * devicePixelRatio)

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const PARTICLE_COUNT = Math.max(20, Math.floor((canvas.clientWidth * canvas.clientHeight) / 70000))

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.8 + 0.6,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      // faint gradient
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, "rgba(45,212,247,0.02)")
      g.addColorStop(1, "rgba(139,92,246,0.02)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      // particles
      for (let p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = "rgba(45,212,247,0.9)"
        ctx.globalAlpha = 0.65
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }

      // connect close particles lightly
      ctx.globalAlpha = 0.08
      ctx.strokeStyle = "rgba(139,92,246,0.6)"
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = (canvas.width = canvas.clientWidth * devicePixelRatio)
      height = (canvas.height = canvas.clientHeight * devicePixelRatio)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [prefersReducedMotion])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Accessibility fallback */}
      <div className="sr-only">Animated background</div>
    </div>
  )
}
