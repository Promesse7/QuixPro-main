"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MicroMissionChecklistProps {
  onComplete: () => void
}

export function MicroMissionChecklist({ onComplete }: MicroMissionChecklistProps) {
  const [checklist, setChecklist] = useState([
    { id: "name", label: "Name the group", completed: false },
    { id: "member", label: "Add at least 1 member", completed: false },
    { id: "message", label: "Send a group message", completed: false },
  ])

  const allCompleted = checklist.every((item) => item.completed)

  const handleCheckItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: true } : item)))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-border/50 rounded-3xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-6">
          <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Create your first group</h2>
          <p className="text-sm text-muted-foreground">60 seconds to go live</p>
        </div>

        <div className="space-y-3 mb-6">
          {checklist.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCheckItem(item.id)}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5"
            >
              <motion.div
                animate={{ scale: item.completed ? 1 : 0.8 }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.completed ? "bg-primary border-primary" : "border-border/50 hover:border-primary"
                }`}
              >
                {item.completed && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
              </motion.div>
              <span
                className={`text-sm font-medium ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30"
          >
            <p className="text-sm text-green-600 text-center font-medium">
              You're live. Quix works better the more you use it.
            </p>
          </motion.div>
        )}

        <Button onClick={onComplete} disabled={!allCompleted} className="w-full" size="lg">
          {allCompleted ? "Enter Quix" : "Complete Mission"}
        </Button>
      </motion.div>
    </motion.div>
  )
}
