"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Award, Users, Zap, Target, TrendingUp, Sparkles } from "lucide-react"
import { getBaseUrl } from "@/lib/getBaseUrl"
import { PageTransition, StaggerContainer, fadeInUp } from "@/components/ui/page-transition"

export default function LandingPage() {
  const [stats, setStats] = useState({ students: 0, quizzes: 0, passRate: 0 })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const baseUrl = getBaseUrl()
      const [coursesRes, statsRes] = await Promise.all([
        fetch(`${baseUrl}/api/explore/courses`),
        fetch(`${baseUrl}/api/stats`),
      ])
      const coursesData = await coursesRes.json()
      const statsData = await statsRes.json()

      setCourses(coursesData.courses?.slice(0, 6) || [])
      setStats({
        students: statsData.totalStudents || 1250,
        quizzes: statsData.totalQuizzes || 350,
        passRate: statsData.passRate || 87,
      })
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setStats({ students: 1250, quizzes: 350, passRate: 87 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-smooth"
              >
                <span className="text-primary-foreground font-bold text-lg">Q</span>
              </motion.div>
              <span className="text-xl font-semibold">Quix</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "Courses", "How it Works"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                >
                  <Link
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button variant="ghost" size="sm" className="transition-smooth hover:scale-105" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button size="lg" className="transition-smooth hover:scale-105 hover:shadow-lg" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <section className="pt-32 pb-20 px-6 lg:px-8">
        <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto">
          <StaggerContainer className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-6 cursor-default"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Personalized Learning Platform</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
            >
              Master Your Studies with{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                AI-Powered
              </span>{" "}
              Learning
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Interactive quizzes, personalized feedback, and gamified learning designed for Rwandan students. Ace your
              exams with confidence.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="transition-smooth hover:scale-105 hover:shadow-xl group" asChild>
                <Link href="/auth">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-smooth hover:scale-105 hover:shadow-lg bg-transparent"
                asChild
              >
                <Link href="/quiz">Try Sample Quiz</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              {[
                { icon: <Users className="h-4 w-4" />, label: `${stats.students.toLocaleString()}+ students` },
                { icon: <BookOpen className="h-4 w-4" />, label: `${stats.quizzes}+ quizzes` },
                { icon: <TrendingUp className="h-4 w-4" />, label: `${stats.passRate}% pass rate` },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  {stat.icon}
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </StaggerContainer>
        </motion.div>
      </section>

      <section id="features" className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Comprehensive tools designed specifically for the Rwandan education system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                title: "Adaptive Quizzes",
                description: "AI-powered questions that adapt to your learning level and pace",
                color: "from-blue-500/10 to-blue-500/5",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Instant Feedback",
                description: "Get detailed explanations and improve with every question",
                color: "from-green-500/10 to-green-500/5",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Peer Learning",
                description: "Connect with tutors and collaborate with classmates",
                color: "from-purple-500/10 to-purple-500/5",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Gamification",
                description: "Earn badges, certificates, and climb the leaderboards",
                color: "from-yellow-500/10 to-yellow-500/5",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Exam Simulation",
                description: "Practice with full-length mock exams in real conditions",
                color: "from-red-500/10 to-red-500/5",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Progress Tracking",
                description: "Monitor your improvement with detailed analytics",
                color: "from-indigo-500/10 to-indigo-500/5",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-default hover:shadow-xl"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Courses</h2>
              <p className="text-muted-foreground">Start learning today</p>
            </div>
            <Button variant="outline" className="hover:scale-105 transition-smooth bg-transparent" asChild>
              <Link href="/explore">View All</Link>
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-muted animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any, i) => (
                <motion.div
                  key={course._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <Link href={`/courses/${course._id}`}>
                    <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all h-full hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                        >
                          <BookOpen className="h-5 w-5" />
                        </motion.div>
                        <div className="text-xs text-muted-foreground">{course.level || "All Levels"}</div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.quizCount || 0} quizzes</span>
                        <span>{course.enrolledCount || 0} students</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Quix Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up and tell us about your educational level and goals",
              },
              {
                step: "02",
                title: "Take Adaptive Quizzes",
                description: "Practice with AI-powered questions tailored to your needs",
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Watch your scores improve and earn achievements along the way",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 text-balance">
                Ready to ace your exams?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-balance">
                Join thousands of students already improving their grades with Quix
              </p>
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button size="lg" variant="secondary" className="hover:scale-105 transition-smooth group" asChild>
                  <Link href="/auth">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent hover:scale-105 transition-smooth"
                  asChild
                >
                  <Link href="/quiz">Try Demo Quiz</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">Q</span>
                </div>
                <span className="text-lg font-semibold">Quix</span>
              </Link>
              <p className="text-sm text-muted-foreground">Empowering Rwandan students with personalized learning</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/explore" className="hover:text-foreground">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-foreground">
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="hover:text-foreground">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-foreground">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Quix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}
