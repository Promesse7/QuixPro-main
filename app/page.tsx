'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Zap, Users, Target, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MotionLink = motion(Link)

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center bg-background/80 backdrop-blur-lg"
      >
        <div className="container mx-auto max-w-7xl px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <p className="text-primary-foreground font-bold text-lg">Q</p>
            </div>
            <span className="text-xl font-semibold">Quix</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-40 pb-24 text-center relative"
        >
          <div className="container mx-auto max-w-4xl px-6">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary mb-6"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>AI-Powered Learning, Reimagined</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text mb-8"
            >
              Master Your Exams with Confidence
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-12"
            >
              Quix is the intelligent learning platform for Rwandan students, offering adaptive quizzes, instant feedback,
              and gamified challenges to help you excel.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-4"
            >
              <Button size="lg" asChild className="group">
                <Link href="/auth">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/quiz">
                  <Zap className="w-4 h-4 mr-2" />
                  Try a Quiz
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-screen-lg h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        </motion.section>

        {/* Visual Showcase (App Screenshot) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-6xl px-6 -mt-12"
        >
          <div className="relative rounded-2xl border border-border/20 bg-background/50 shadow-2xl shadow-primary/10 aspect-video p-2">
             <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">[App Screenshot Here]</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Sections */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            
            {/* Feature 1 */}
            <div className="md:pr-12">
              <motion.div initial={{opacity:0, x: -50}} whileInView={{opacity:1, x:0}} transition={{duration: 0.5}} className="p-3 inline-block bg-primary/10 rounded-xl mb-6">
                  <Zap className="w-7 h-7 text-primary"/>
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Adaptive Quizzes</h2>
              <p className="text-muted-foreground text-lg">Our AI-powered engine creates personalized quizzes that adjust to your skill level, ensuring you're always challenged but never overwhelmed.</p>
            </div>
            <motion.div initial={{opacity:0, scale: 0.95}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.7}} className="h-80 rounded-2xl bg-muted border border-border/20 flex items-center justify-center">
              <p className="text-muted-foreground">[Illustration/Component for Adaptive Quizzes]</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div initial={{opacity:0, scale: 0.95}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.7}} className="h-80 rounded-2xl bg-muted border border-border/20 flex items-center justify-center md:order-last order-first">
              <p className="text-muted-foreground">[Illustration/Component for Gamification]</p>
            </motion.div>
            <div className="md:pl-12">
              <motion.div initial={{opacity:0, x: 50}} whileInView={{opacity:1, x:0}} transition={{duration: 0.5}} className="p-3 inline-block bg-primary/10 rounded-xl mb-6">
                  <Star className="w-7 h-7 text-primary"/>
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Gamified Learning</h2>
              <p className="text-muted-foreground text-lg">Earn points, badges, and climb the leaderboard. Turn studying into a fun and rewarding adventure.</p>
            </div>

          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-24 sm:py-32 bg-muted/50">
          <div className="container mx-auto max-w-5xl px-6 text-center">
             <h2 className="text-4xl font-bold mb-6">Get Started in 3 Easy Steps</h2>
             <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">Your journey to academic excellence is just a few clicks away.</p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                <div className="relative"> 
                  <h3 className="text-2xl font-semibold mb-3">1. Create Account</h3>
                  <p className="text-muted-foreground">Sign up for free and set up your learning profile in seconds.</p>
                </div>
                <div className="relative"> 
                  <h3 className="text-2xl font-semibold mb-3">2. Take a Quiz</h3>
                  <p className="text-muted-foreground">Dive into our adaptive quizzes and see where you stand.</p>
                </div>
                <div className="relative"> 
                  <h3 className="text-2xl font-semibold mb-3">3. Track Your Progress</h3>
                  <p className="text-muted-foreground">Watch your knowledge grow with our detailed analytics.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32">
            <div className="container mx-auto max-w-4xl px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Grades?</h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of Rwandan students who are already learning smarter, not harder.</p>
                <Button size="lg" asChild className="group">
                    <Link href="/auth">
                        Sign Up for Free
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
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

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
