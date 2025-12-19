"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Zap, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getGuestQuizAttempts } from "@/lib/guest-session"

interface SignupPromptModalProps {
  isOpen: boolean
  onClose: () => void
  quizScore?: number
}

export default function SignupPromptModal({ isOpen, onClose, quizScore }: SignupPromptModalProps) {
  const quizAttempts = getGuestQuizAttempts()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/20 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Amazing Progress!
                </h2>
                <p className="text-white/80">
                  You've completed {quizAttempts} {quizAttempts === 1 ? 'quiz' : 'quizzes'}
                  {quizScore && ` with ${quizScore}% on your last attempt`}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Unlock Your Full Potential
                </h3>
                <ul className="space-y-3 text-white/90 text-sm">
                  <li className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Save your progress</strong> and continue where you left off</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Earn certificates</strong> and badges for your achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Compete on leaderboards</strong> with students across Africa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Track your learning</strong> with detailed analytics</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg py-6 shadow-xl"
                >
                  <Link href="/auth">
                    Create Free Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-lg"
                >
                  Maybe Later
                </Button>
              </div>

              <p className="text-center text-white/60 text-xs mt-4">
                100% free • No credit card required • Join 10,000+ students
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
