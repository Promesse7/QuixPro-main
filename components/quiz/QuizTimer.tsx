'use client'

import { useEffect, useState } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface QuizTimerProps {
  totalSeconds: number
  onTimeUp?: () => void
  paused?: boolean
}

export function QuizTimer({ totalSeconds, onTimeUp, paused = false }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    if (paused || secondsLeft <= 0) return

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft, paused, onTimeUp])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isLowTime = secondsLeft < 60

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
      isLowTime ? 'bg-red-500/20 border border-red-500/50' : 'bg-primary/20 border border-primary/50'
    }`}>
      <Clock className={`h-5 w-5 ${isLowTime ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${isLowTime ? 'text-red-500' : 'text-foreground'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        {isLowTime && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Time running out!
          </span>
        )}
      </div>
    </div>
  )
}
