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
    <section className="py-24 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 mb-8 shadow-sm"
          >
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-primary font-bold text-sm tracking-wide uppercase">Free Practice</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 leading-none">
            Try a Quiz <span className="text-primary">Right Now</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Experience our adaptive learning system. No sign-up required to test your knowledge in these popular topics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {suggestedQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-card border-border/50 h-full flex flex-col justify-between group-hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-3xl">
                <CardContent className="p-8 text-center flex-1">
                  <div className="mb-8 text-6xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {quiz.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium line-clamp-3">
                    {quiz.description}
                  </p>
                </CardContent>
                <div className="p-8 pt-0">
                  <Button
                    onClick={() => handleTryQuiz(quiz)}
                    className="w-full h-14 bg-primary text-primary-foreground font-bold text-lg rounded-2xl transition-all duration-300 transform group-hover:translate-y-[-4px] shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
                  >
                    <Play className="mr-3 w-5 h-5 fill-current" />
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
