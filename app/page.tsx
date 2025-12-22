'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme-switcher'
import ParticleBackground from '@/components/landing/ParticleBackground'
import TryQuizSection from '@/components/landing/TryQuizSection'
import { ArrowRight, BookOpen, Zap, Users, Target, CheckCircle, Star, BrainCircuit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const suggestedQuizzes = [
  { id: '1', title: 'Advanced Mathematics', description: 'Challenge yourself with complex calculus and algebra problems.', icon: '🧠' },
  { id: '2', title: 'World History', description: 'Explore the rise and fall of ancient civilizations.', icon: '🏛️' },
  { id: '3', title: 'Modern Physics', description: 'Dive into the weird and wonderful world of quantum mechanics.', icon: '⚛️' },
  { id: '4', title: 'Creative Writing', description: 'Test your knowledge of literary devices and narrative structures.', icon: '✍️' },
];

const features = [
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Adaptive Quizzes",
        description: "Our AI-powered engine creates personalized quizzes that adjust to your skill level, ensuring you're always challenged but never overwhelmed.",
    },
    {
        icon: <Star className="w-8 h-8 text-primary" />,
        title: "Gamified Learning",
        description: "Earn points, badges, and climb the leaderboard. Turn studying into a fun and rewarding adventure.",
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "Instant Feedback",
        description: "Receive detailed explanations for every question, helping you understand your mistakes and learn faster.",
    },
];

const testimonials = [
    {
        quote: "Quix has completely transformed the way I study. The adaptive quizzes are a game-changer!",
        name: "Marie Claire",
        title: "S6 Student, G.S. Kimisagara",
        avatar: "/placeholder-user.jpg",
    },
    {
        quote: "I love the gamification elements. Competing on the leaderboard keeps me motivated to learn more every day.",
        name: "Jean Bosco",
        title: "S5 Student, Lycée de Kigali",
        avatar: "/placeholder-user.jpg",
    },
];

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-x-hidden bg-background font-sans text-foreground">
      <ParticleBackground className="absolute inset-0 -z-10" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-background/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <p className="text-lg font-bold text-primary-foreground">Q</p>
          </div>
          <span className="text-xl font-semibold">Quix</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-24 text-center">
            <div className="container mx-auto max-w-4xl px-6">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text mb-8"
                >
                    Master Your Exams with Confidence
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeInOut' }}
                    className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-12"
                >
                    The intelligent learning platform for Rwandan students, offering adaptive quizzes, instant feedback, and gamified challenges to help you excel.
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                className="w-full max-w-4xl px-6"
            >
                <TryQuizSection suggestedQuizzes={suggestedQuizzes} />
            </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto max-w-7xl px-6">
                <h2 className="text-4xl font-bold text-center mb-16">Why Quix is Different</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full text-center bg-muted/50 border-border/20">
                                <CardContent className="p-8">
                                    <div className="inline-block bg-primary/10 p-4 rounded-xl mb-6">{feature.icon}</div>
                                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
            <div className="container mx-auto max-w-5xl px-6">
                <h2 className="text-4xl font-bold text-center mb-16">Loved by Students Across Rwanda</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full bg-muted/50 border-border/20">
                                <CardContent className="p-8 flex flex-col justify-between h-full">
                                    <blockquote className="text-lg italic mb-6">“{testimonial.quote}”</blockquote>
                                    <div className="flex items-center">
                                        <Avatar className="h-12 w-12 mr-4">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 text-center">
            <div className="container mx-auto max-w-4xl px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Grades?</h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of Rwandan students who are already learning smarter, not harder.</p>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button size="lg" asChild className="group text-lg py-8 px-12">
                        <Link href="/auth">
                            Sign Up for Free
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Quix. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}
