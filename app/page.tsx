"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import HeroSection from "@/components/landing/HeroSection"
import HeroEnhancer from '@/components/landing/HeroEnhancer'
import ExploreCourses from "@/components/landing/ExploreCourses"
import TryQuizSection from "@/components/landing/TryQuizSection"
import DiscoverStories from "@/components/landing/DiscoverStories"
import JoinCTA from "@/components/landing/JoinCTA"
import { getBaseUrl } from "@/lib/getBaseUrl"

export default function LandingPage() {
  const [courses, setCourses] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicData()
  }, [])

  const fetchPublicData = async () => {
    try {
      const baseUrl = getBaseUrl()
      
      // Fetch sample courses
      const coursesRes = await fetch(`${baseUrl}/api/explore/courses`)
      const coursesData = await coursesRes.json()
      setCourses(coursesData.courses.slice(0, 3))

      // Fetch sample quizzes
      const quizzesRes = await fetch(`${baseUrl}/api/explore/quizzes`)
      const quizzesData = await quizzesRes.json()
      setQuizzes(quizzesData.quizzes.slice(0, 3))

      // Fetch sample stories
      const storiesRes = await fetch(`${baseUrl}/api/explore/stories`)
      const storiesData = await storiesRes.json()
      setStories(storiesData.stories.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch public data:", error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    })
  }, [])

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-3xl border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-white text-2xl font-bold">Quix</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#courses" className="text-white/80 hover:text-white transition-colors">
                Courses
              </a>
              <a href="#quiz" className="text-white/80 hover:text-white transition-colors">
                Try Quiz
              </a>
              <a href="#stories" className="text-white/80 hover:text-white transition-colors">
                Stories
              </a>
              <a href="#join" className="text-white/80 hover:text-white transition-colors">
                Join
              </a>
            </div>



            <div className="flex items-center gap-4">
              <a
                href="/quiz"
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Try Quiz
              </a>
              <a
                href="/auth"
                className="px-4 py-2 rounded-md bg-gradient-to-br from-primary to-accent text-white text-sm font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-8 pb-16">
        <div className="container mx-auto px-6">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <HeroEnhancer>
                <HeroSection />
              </HeroEnhancer>
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                <p className="text-xs text-muted-foreground mb-3">Jump into learning</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="/quiz" className="px-3 py-2 rounded-md bg-white/10 text-sm text-center">Take Quiz</a>
                  <a href="/explore" className="px-3 py-2 rounded-md bg-white/10 text-sm text-center">Explore Courses</a>
                  <a href="/stories" className="px-3 py-2 rounded-md bg-white/10 text-sm text-center">Read Stories</a>
                  <a href="/certificates" className="px-3 py-2 rounded-md bg-white/10 text-sm text-center">Achievements</a>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="text-sm font-medium mb-2">Featured Courses</h3>
                <p className="text-xs text-muted-foreground mb-3">Handpicked for you</p>
                <ExploreCourses courses={courses} loading={loading} compact />
              </div>
            </aside>
          </section>

          <section id="quiz" className="mt-10">
            <div className="rounded-2xl bg-white/5 p-4">
              <h3 className="text-sm font-medium mb-2">Try a sample quiz</h3>
              <p className="text-xs text-muted-foreground mb-3">Practice under timed conditions</p>
              <TryQuizSection quizzes={quizzes} loading={loading} />
            </div>
          </section>

          <section id="stories" className="mt-8">
            <div className="rounded-2xl bg-white/5 p-4">
              <h3 className="text-sm font-medium mb-2">Stories</h3>
              <p className="text-xs text-muted-foreground mb-3">Learn from others' journeys</p>
              <DiscoverStories stories={stories} loading={loading} />
            </div>
          </section>

          <section id="join" className="mt-8">
            <JoinCTA />
          </section>
        </div>
      </main>

      <footer className="bg-black/5 border-t border-white/6 py-12">
        <div className="container mx-auto px-6 text-sm text-muted-foreground">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-base font-semibold mb-2">Quix</h3>
              <p className="text-xs text-muted-foreground">Personalized, gamified learning for African students.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#courses">Courses</a></li>
                <li><a href="#quiz">Quizzes</a></li>
                <li><a href="#stories">Stories</a></li>
                <li><a href="/explore">Explore</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/6 pt-6 text-center text-xs text-muted-foreground">
            <p>&copy; 2025 Quix Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
