"use client"

import { motion } from "framer-motion"
import { Users, GraduationCap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PersonalizationPromptProps {
  onComplete: (useCase: "friends" | "school" | "work") => void
}

export function PersonalizationPrompt({ onComplete }: PersonalizationPromptProps) {
  const options = [
    { id: "friends", label: "Friends", icon: Users },
    { id: "school", label: "School / Classmates", icon: GraduationCap },
    { id: "work", label: "Teams / Work", icon: Briefcase },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-3xl p-6 max-w-md w-full shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-2">What will you mostly use Quix for?</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">This helps us personalize your experience</p>

        <div className="space-y-3">
          {options.map(({ id, label, icon: Icon }, idx) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Button
                onClick={() => onComplete(id)}
                variant="outline"
                className="w-full h-12 justify-start gap-3 bg-muted/30 hover:bg-primary/10 hover:border-primary/50"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
