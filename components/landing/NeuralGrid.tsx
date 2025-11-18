'use client'
import React from 'react'

/**
 * Decorative SVG neural grid overlay.
 * Very low-cost; purely visual.
 */
export default function NeuralGrid({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ng" x1="0" x2="1">
          <stop offset="0" stopColor="#06B6D4" stopOpacity="0.26" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.26" />
        </linearGradient>
        <filter id="blur-small"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      <g stroke="url(#ng)" strokeWidth="1" fill="none" opacity="0.9">
        <path d="M20 160 C160 60, 360 220, 600 140 C840 60, 1080 220, 1260 140" strokeOpacity="0.10" filter="url(#blur-small)" />
        <path d="M0 420 C160 320, 420 520, 680 420 C940 320, 1200 520, 1280 420" strokeOpacity="0.07" />
        <path d="M40 60 C200 0, 420 120, 660 60 C900 0, 1140 120, 1240 60" strokeOpacity="0.08" />
      </g>
    </svg>
  )
}