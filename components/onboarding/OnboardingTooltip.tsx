"use client"

import { motion } from "framer-motion"

interface OnboardingTooltipProps {
  text: string
  position?: "top" | "bottom" | "center"
}

export function OnboardingTooltip({ text, position = "center" }: OnboardingTooltipProps) {
  const positions = {
    top: "top-20 left-1/2 -translate-x-1/2",
    bottom: "bottom-20 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed ${positions[position]} z-50 pointer-events-none`}
    >
      <div className="bg-card border border-border/50 rounded-2xl px-6 py-3 shadow-xl backdrop-blur-sm max-w-xs">
        <p className="text-sm font-medium text-foreground text-center">{text}</p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className="w-3 h-3 bg-card border border-border/50 transform rotate-45" />
        </div>
      </div>
    </motion.div>
  )
}
