'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GuestQuizModal from "@/components/guest/GuestQuizModal"

// Define the shape of a single quiz
interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Define the props for the component
interface TryQuizSectionProps {
  suggestedQuizzes: Quiz[];
}

export default function TryQuizSection({ suggestedQuizzes }: TryQuizSectionProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTryQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6"
          >
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">No login required</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Try a Quiz Right Now
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our adaptive learning system. Take a sample quiz and see how you do.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {suggestedQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <Card className="relative overflow-hidden bg-background/50 border-border/20 h-full flex flex-col justify-between group-hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-6 text-5xl flex justify-center">
                    {quiz.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {quiz.description}
                  </p>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button
                        onClick={() => handleTryQuiz(quiz)}
                        className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-semibold transition-all duration-300 transform group-hover:scale-105"
                    >
                        <Play className="mr-2 w-4 h-4" />
                        Start Quiz
                    </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <GuestQuizModal
        quiz={selectedQuiz}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
