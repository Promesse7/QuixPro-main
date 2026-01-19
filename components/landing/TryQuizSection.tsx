'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Play, Clock, BarChart2, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import GuestQuizModal from "@/components/guest/GuestQuizModal"

// Define the shape of a single quiz
interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: number;
  time: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Define the props for the component
interface TryQuizSectionProps {
  suggestedQuizzes: Quiz[];
}

const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'Beginner': return 'bg-green-500/10 text-green-500';
    case 'Intermediate': return 'bg-yellow-500/10 text-yellow-500';
    case 'Advanced': return 'bg-red-500/10 text-red-500';
    default: return 'bg-primary/10 text-primary';
  }
}

export default function TryQuizSection({ suggestedQuizzes }: TryQuizSectionProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleTryQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  return (
    <section id="try-quiz" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6"
          >
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">Instant Access, No Login</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4"
          >
            Try a Quiz Right Now
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Experience our adaptive learning system with these sample quizzes. No signup required.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: 'spring',
                stiffness: 100
              }}
              className="h-full"
              onHoverStart={() => setHoveredCard(quiz.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="h-full flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/30 hover:border-primary/30">
                <CardContent className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </div>
                    <div className="text-4xl">
                      {quiz.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2 h-16">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 h-12">
                    {quiz.description}
                  </p>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      <span>{quiz.time} min • {quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BarChart2 className="w-3.5 h-3.5 mr-2" />
                      <span>Adaptive difficulty</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    onClick={() => handleTryQuiz(quiz)}
                    className="w-full group relative overflow-hidden"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                      Start Quiz
                    </span>
                    <motion.span 
                      className="absolute inset-0 bg-primary/90 z-0"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </Button>
                </CardFooter>
                
                <AnimatePresence>
                  {hoveredCard === quiz.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm">
            Want access to 1000+ quizzes and personalized learning?{' '}
            <a href="/auth/signup" className="text-primary hover:underline font-medium">
              Create a free account
            </a>
          </p>
        </motion.div>
      </div>

      <GuestQuizModal
        quiz={selectedQuiz}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
