"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Play, Clock, Target, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GuestQuizModal from "@/components/guest/GuestQuizModal"

interface TryQuizSectionProps {
  quizzes: any[]
  loading: boolean
}

export default function TryQuizSection({ quizzes, loading }: TryQuizSectionProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTryQuiz = (quiz: any) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-500/20 text-green-300",
      moderate: "bg-yellow-500/20 text-yellow-300",
      hard: "bg-red-500/20 text-red-300",
    }
    return colors[difficulty?.toLowerCase() as keyof typeof colors] || colors.moderate
  }

  return (
    <section className="py-28 bg-gradient-to-b from-black/10 via-black/30 to-black/60 relative overflow-hidden">

      {/* Background Glow Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-600/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500/20 backdrop-blur-xl rounded-full border border-purple-400/40 shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)] mb-6"
          >
            <Brain className="w-4 h-4 text-purple-300" />
            <span className="text-white/90 text-sm font-medium">No login required</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            Try a Quiz Right Now
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Experience our adaptive learning system. Take a sample quiz and see your results instantly.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-14 h-14 text-purple-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="
                  relative overflow-hidden bg-gradient-to-br
                  from-purple-600/15 to-blue-500/15
                  backdrop-blur-xl border border-white/10 
                  rounded-xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.6)]
                  group-hover:shadow-[0_10px_60px_-10px_rgba(147,51,234,0.5)]
                  transition-all duration-300 h-full
                ">
                  {/* Subtle Glow on Hover */}
                  <div className="
                    absolute inset-0 opacity-0 group-hover:opacity-20 
                    bg-gradient-to-r from-purple-600 to-pink-600 
                    blur-3xl transition-all
                  " />

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <Badge className={`${getDifficultyColor(quiz.difficulty)} border-0 font-semibold`}>
                        {quiz.difficulty || "Moderate"}
                      </Badge>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                      {quiz.title}
                    </h3>

                    <p className="text-white/60 text-sm mb-7 leading-relaxed">
                      {quiz.description || "Test your knowledge with this interactive quiz."}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-white/50 mb-7">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{quiz.questions?.length || 10} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration || 15} min</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTryQuiz(quiz)}
                      className="
                        w-full bg-gradient-to-r from-purple-600 to-pink-600 
                        hover:from-purple-700 hover:to-pink-700 
                        text-white font-semibold py-2.5 border-0
                        transition-all
                      "
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <GuestQuizModal
        quiz={selectedQuiz}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
