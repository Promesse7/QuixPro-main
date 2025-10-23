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
    <section className="py-24 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-lg rounded-full border border-purple-500/30 mb-6">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm">No login required</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Try a Quiz Right Now
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Experience our adaptive learning system. Take a sample quiz and see your results instantly!
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-lg border-white/10 hover:border-purple-500/50 transition-all group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${getDifficultyColor(quiz.difficulty)} border-0`}>
                        {quiz.difficulty || "Moderate"}
                      </Badge>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-6">
                      {quiz.description || "Test your knowledge with this interactive quiz"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{quiz.questions?.length || 10} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration || 15} min</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTryQuiz(quiz)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
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

      {/* Guest Quiz Modal */}
      <GuestQuizModal
        quiz={selectedQuiz}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}