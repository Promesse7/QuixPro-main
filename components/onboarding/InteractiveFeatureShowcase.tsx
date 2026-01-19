"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, SkipForward, MessageSquare, Users, BarChart3, Trophy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeatureSlide {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  cta: string
  demo: React.ReactNode
}

interface InteractiveFeatureShowcaseProps {
  onComplete: () => void
  onSkip?: () => void
}

export function InteractiveFeatureShowcase({ onComplete, onSkip }: InteractiveFeatureShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set())

  const slides: FeatureSlide[] = [
    {
      id: "chat",
      title: "Quix Chat",
      description: "Real-time messaging with rich media support. Connect with classmates instantly.",
      icon: <MessageSquare className="w-8 h-8" />,
      cta: "Try Chat",
      demo: (
        <div className="space-y-3">
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="bg-primary/10 rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">Hey, how are you doing?</p>
            </div>
          </div>
          <div className="flex gap-2 items-end justify-end">
            <div className="bg-primary rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm text-primary-foreground">Great! Just studying for the exam.</p>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="bg-primary/10 rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">Want to study together?</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "groups",
      title: "Quix Groups",
      description: "Create study groups with classmates. Collaborate and learn together.",
      icon: <Users className="w-8 h-8" />,
      cta: "Create Group",
      demo: (
        <div className="space-y-3">
          <div className="bg-card/60 border border-border/50 rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-2">📚 Math Study Group</h3>
            <div className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/30" />
              <div className="w-6 h-6 rounded-full bg-purple-500/30" />
              <div className="w-6 h-6 rounded-full bg-pink-500/30" />
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-bold">+2</div>
            </div>
            <p className="text-xs text-muted-foreground">5 members • Active now</p>
          </div>
          <div className="bg-card/60 border border-border/50 rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-2">🧪 Science Project</h3>
            <div className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500/30" />
              <div className="w-6 h-6 rounded-full bg-orange-500/30" />
            </div>
            <p className="text-xs text-muted-foreground">2 members • 3 new messages</p>
          </div>
        </div>
      ),
    },
    {
      id: "insights",
      title: "Quix Insights",
      description: "Track your progress with detailed analytics. See what you're learning.",
      icon: <BarChart3 className="w-8 h-8" />,
      cta: "View Analytics",
      demo: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Mathematics</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-blue-500 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Science</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">History</span>
              <span className="font-semibold">92%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "leaderboard",
      title: "Leaderboard",
      description: "Compete with peers on the global leaderboard. Climb the ranks.",
      icon: <Trophy className="w-8 h-8" />,
      cta: "Join Leaderboard",
      demo: (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold w-6 text-center">1</span>
              <div className="w-6 h-6 rounded-full bg-yellow-400/30" />
              <span className="text-sm font-semibold">Alex</span>
            </div>
            <span className="text-sm font-bold text-primary">2,450 pts</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold w-6 text-center text-muted-foreground">2</span>
              <div className="w-6 h-6 rounded-full bg-gray-400/30" />
              <span className="text-sm">Jordan</span>
            </div>
            <span className="text-sm text-muted-foreground">2,380 pts</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold w-6 text-center text-muted-foreground">3</span>
              <div className="w-6 h-6 rounded-full bg-orange-400/30" />
              <span className="text-sm">Casey</span>
            </div>
            <span className="text-sm text-muted-foreground">2,290 pts</span>
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [autoPlay, slides.length])

  const handleNext = () => {
    setAutoPlay(false)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    setAutoPlay(false)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleSlideComplete = () => {
    const newCompleted = new Set(completedSlides)
    newCompleted.add(currentSlide)
    setCompletedSlides(newCompleted)

    if (newCompleted.size === slides.length) {
      setTimeout(() => onComplete(), 500)
    } else {
      handleNext()
    }
  }

  const progress = (completedSlides.size / slides.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card border border-border/50 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-purple-500"
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
              >
                {slides[currentSlide].icon}
              </motion.div>

              {/* Title & Description */}
              <div>
                <h2 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h2>
                <p className="text-muted-foreground text-lg">{slides[currentSlide].description}</p>
              </div>

              {/* Demo */}
              <div className="bg-muted/30 border border-border/30 rounded-2xl p-6">
                {slides[currentSlide].demo}
              </div>

              {/* Slide Indicators */}
              <div className="flex gap-2 justify-center">
                {slides.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setAutoPlay(false)
                      setCurrentSlide(idx)
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? "bg-primary w-8" : "bg-border w-2"
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="px-8 md:px-10 pb-8 flex items-center justify-between border-t border-border/50 pt-6">
          <Button
            variant="ghost"
            onClick={onSkip || onComplete}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Tour
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="rounded-lg bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="rounded-lg bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSlideComplete}
            className="gap-2 rounded-lg"
          >
            {completedSlides.has(currentSlide) ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Next Feature
              </>
            ) : (
              `Explore ${slides[currentSlide].title}`
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
