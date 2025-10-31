"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import HeroSection from "@/components/landing/HeroSection"
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
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
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
    href="/auth"
    className="text-white/80 hover:text-white transition-colors"
  >
    Login
  </a>
  <a
    href="/auth"
    className="px-6 py-2 bg-gradient-to-r from-black to-gray-500 text-white rounded-lg hover:shadow-lg hover:shadow-black/50 transition-all"
  >
    Get Started
  </a>
</div>




          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection />
        
        <div id="courses">
          <ExploreCourses courses={courses} loading={loading} />
        </div>
        
        <div id="quiz">
          <TryQuizSection quizzes={quizzes} loading={loading} />
        </div>
        
        <div id="stories">
          <DiscoverStories stories={stories} loading={loading} />
        </div>
        
        <div id="join">
          <JoinCTA />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Qouta</h3>
              <p className="text-white/60 text-sm">
                Empowering African students through personalized, gamified learning experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#courses">Courses</a></li>
                <li><a href="#quiz">Quizzes</a></li>
                <li><a href="#stories">Stories</a></li>
                <li><a href="/explore">Explore</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2025 Qouta Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}