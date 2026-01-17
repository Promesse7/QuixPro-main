'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles, BarChart3, Trophy, Users, Book, ChevronRight, Menu, X } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import ParticleBackground from '@/components/landing/ParticleBackground'
import TryQuizSection from '@/components/landing/TryQuizSection'

export default function KwixLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const suggestedQuizzes = [
    {
      id: '1',
      title: 'Advanced Mathematics',
      description: 'Calculus, integrals, limits, and differential equations.',
      icon: 'calculator'
    },
    {
      id: '2',
      title: 'Physics Deep Dive',
      description: 'Thermodynamics, nuclear physics, waves, and energy systems.',
      icon: 'atom'
    },
    {
      id: '3',
      title: 'Computer Science Basics',
      description: 'Algorithms, data structures, and computational thinking.',
      icon: 'code'
    },
    {
      id: '4',
      title: 'Logical Reasoning',
      description: 'Puzzles, patterns, and critical thinking challenges.',
      icon: 'brain'
    },
    {
      id: '5',
      title: 'General Science',
      description: 'Mixed questions from biology, chemistry, and earth science.',
      icon: 'flask'
    },
    {
      id: '6',
      title: 'History & World Knowledge',
      description: 'Major events, inventions, and global awareness questions.',
      icon: 'globe'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Kwix</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <ThemeSwitcher />
              <a href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</a>
              <a href="/auth" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors">
                Get started
              </a>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-t border-border overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">Features</a>
              <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">How it works</a>
              <a href="#testimonials" className="block text-sm text-muted-foreground hover:text-foreground">Testimonials</a>
              <a href="/auth" className="block w-full text-left text-sm text-muted-foreground hover:text-foreground">Sign in</a>
              <a href="/auth" className="block w-full px-4 py-2 bg-foreground text-background text-sm rounded-lg">
                Get started
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <ParticleBackground />

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Math Icon - Top Left */}
          <motion.div
            className="absolute top-[15%] left-[10%] w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl flex items-center justify-center text-4xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📐
          </motion.div>

          {/* Chemistry Icon - Top Right */}
          <motion.div
            className="absolute top-[20%] right-[8%] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            🧪
          </motion.div>

          {/* Trophy Icon - Middle Left */}
          <motion.div
            className="absolute top-[45%] left-[5%] w-18 h-18 md:w-22 md:h-22 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, -25, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            🏆
          </motion.div>

          {/* Book Icon - Middle Right */}
          <motion.div
            className="absolute top-[50%] right-[12%] w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl flex items-center justify-center text-4xl"
            animate={{
              y: [0, 21, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          >
            📚
          </motion.div>

          {/* Brain Icon - Bottom Left */}
          <motion.div
            className="absolute bottom-[20%] left-[15%] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, -15, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            🧠
          </motion.div>

          {/* Star Icon - Bottom Right */}
          <motion.div
            className="absolute bottom-[25%] right-[6%] w-18 h-18 md:w-22 md:h-22 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, 18, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
          >
            ⭐
          </motion.div>

          {/* Physics Icon - Top Center */}
          <motion.div
            className="absolute top-[12%] left-[45%] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, -18, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            ⚛️
          </motion.div>

          {/* Globe Icon - Bottom Center-ish */}
          <motion.div
            className="absolute bottom-[15%] left-[40%] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center text-3xl"
            animate={{
              y: [0, 22, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
          >
            🌍
          </motion.div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            style={{ opacity, scale }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border"
            >
              <Sparkles size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AI-powered adaptive learning</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            >
              Master your exams
              <br />
              <span className="text-muted-foreground/60">with confidence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The intelligent learning platform built for Rwandan students. Adaptive quizzes, instant feedback, and gamified challenges designed to help you excel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <a href="/auth" className="group px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                Start learning for free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                See how it works
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-20"
        >
          <div className="relative rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-card p-8 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Question 3 of 10</span>
                    <span className="text-sm font-medium">Advanced Mathematics</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Solve for x: 2x² + 5x - 3 = 0</h3>
                    <div className="space-y-2">
                      {['x = 0.5 or x = -3', 'x = 1 or x = -3', 'x = -0.5 or x = 3', 'x = 2 or x = -1.5'].map((option, i) => (
                        <div key={i} className="p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Try Quiz Section */}
      <TryQuizSection suggestedQuizzes={suggestedQuizzes} />

      {/* Stats Bar */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Students', value: '15,000+' },
              { label: 'Questions Answered', value: '2.3M+' },
              { label: 'Success Rate', value: '94%' },
              { label: 'Schools', value: '200+' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make learning effective, engaging, and personalized to your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Adaptive Learning',
                description: 'AI-powered quizzes that adapt to your skill level in real-time, ensuring optimal challenge and growth.'
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Gamified Progress',
                description: 'Earn points, unlock achievements, and compete on leaderboards to stay motivated.'
              },
              {
                icon: <Book className="w-6 h-6" />,
                title: 'Instant Feedback',
                description: 'Get detailed explanations for every question, helping you learn from mistakes immediately.'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Peer Learning',
                description: 'Join study groups, share progress, and learn together with students across Rwanda.'
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Progress Tracking',
                description: 'Comprehensive analytics showing your strengths, weaknesses, and improvement over time.'
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Curriculum Aligned',
                description: 'Content perfectly aligned with the Rwandan national curriculum and exam patterns.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 border border-border rounded-2xl hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Kwix works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, effective learning journey designed to maximize your potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose your subject',
                description: 'Select from mathematics, sciences, languages, and more. Start with topics aligned to your curriculum.'
              },
              {
                step: '02',
                title: 'Take adaptive quizzes',
                description: 'Answer questions that automatically adjust difficulty based on your performance, keeping you in the optimal learning zone.'
              },
              {
                step: '03',
                title: 'Track & improve',
                description: 'Review detailed analytics, understand your mistakes, and watch your scores improve over time.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by students across Rwanda</h2>
            <p className="text-lg text-muted-foreground">Real results from real students</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Kwix completely transformed how I prepare for exams. The adaptive quizzes identified my weak areas and helped me improve dramatically. I increased my math score by 25%!",
                name: "Marie Claire Uwase",
                role: "S6 Student, G.S. Kimisagara",
                score: "78% → 95%"
              },
              {
                quote: "The gamification aspect keeps me motivated every day. Competing with friends on the leaderboard turned studying from a chore into something I actually look forward to.",
                name: "Jean Bosco Niyonzima",
                role: "S5 Student, Lycée de Kigali",
                score: "Top 5% nationally"
              },
              {
                quote: "As a teacher, I've seen remarkable improvement in my students who use Kwix. The instant feedback helps them learn from mistakes immediately, which is crucial for retention.",
                name: "Claudine Mukamana",
                role: "Mathematics Teacher, FAWE Girls School",
                score: "Class avg +18%"
              },
              {
                quote: "Preparing for national exams was stressful until I found Kwix. The curriculum-aligned content and detailed explanations gave me the confidence I needed to excel.",
                name: "Eric Habimana",
                role: "S6 Student, Lycée de Nyanza",
                score: "National top 50"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 border border-border rounded-2xl hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                    {testimonial.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Showcase */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Master every subject</h2>
            <p className="text-lg text-muted-foreground">Comprehensive coverage across all major exam topics</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { subject: 'Mathematics', icon: '📐', quizzes: 450 },
              { subject: 'Physics', icon: '⚡', quizzes: 320 },
              { subject: 'Chemistry', icon: '🧪', quizzes: 280 },
              { subject: 'Biology', icon: '🧬', quizzes: 340 },
              { subject: 'English', icon: '📚', quizzes: 290 },
              { subject: 'Kinyarwanda', icon: '🗣️', quizzes: 180 },
              { subject: 'History', icon: '🏛️', quizzes: 210 },
              { subject: 'Geography', icon: '🌍', quizzes: 190 }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-6 bg-card border border-border rounded-xl hover:border-primary transition-all cursor-pointer group"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-semibold mb-1">{item.subject}</div>
                <div className="text-sm text-muted-foreground">{item.quizzes} quizzes</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to transform your grades?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join 15,000+ Rwandan students who are already learning smarter with Kwix. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 text-lg">
                Start free trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-muted-foreground hover:text-foreground transition-colors text-lg">
                Schedule a demo
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-semibold">Kwix</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering Rwandan students to achieve academic excellence through intelligent, adaptive learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">For Schools</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Kwix. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Twitter</a>
              <a href="#" className="hover:text-foreground">LinkedIn</a>
              <a href="#" className="hover:text-foreground">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
