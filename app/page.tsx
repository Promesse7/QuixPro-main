"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Award, Users, Mic, ArrowRight, Star, Globe, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-white glow-text" />
            <span className="text-2xl font-bold glow-text tracking-wider">Qouta</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/auth" className="text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Button asChild className="glow-effect border border-white/30">
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-48 bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 container px-4 md:px-6 text-center">
          <div className="space-y-6">
            <Badge variant="outline" className="inline-flex items-center rounded-full border border-white/30 bg-black px-3 py-1 text-sm font-medium text-white shadow-lg animate-fade-in-up">
              <Zap className="mr-2 h-4 w-4 text-white" />
              <span className="text-white">Qouta: Your AI Learning Assistant</span>
            </Badge>
            <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl/none animate-typing">
              Unlock Your Potential with AI-Powered Learning
            </h1>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl animate-fade-in-up">
              QuixPro is an innovative platform that leverages artificial intelligence to provide personalized learning experiences, helping you master new skills and achieve your academic and professional goals.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center animate-fade-in-up">
              <Button
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/30 bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 animate-pulse"
                asChild
              >
                <Link href="#features">Start Learning</Link>
              </Button>
              <Button
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/30 bg-black px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                variant="outline"
                asChild
              >
                <Link href="#contact">Try Voice Command</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 glow-text">Futuristic Learning Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets educational excellence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Quizzes</CardTitle>
                <CardDescription>
                  Intelligent quiz generation with instant feedback and personalized explanations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <Mic className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Voice Commands</CardTitle>
                <CardDescription>Navigate and interact with the platform using natural voice commands</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Digital Certificates</CardTitle>
                <CardDescription>Earn beautiful, verifiable certificates upon course completion</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Interactive Stories</CardTitle>
                <CardDescription>Engaging biographies and folktales in English and Kinyarwanda</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Teacher Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive tools for creating quizzes and tracking student progress
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>CBC Aligned</CardTitle>
                <CardDescription>Perfectly aligned with Rwanda's Competence-Based Curriculum standards</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 glow-text">How Qouta Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to educational excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Choose Level</h3>
              <p className="text-muted-foreground">Create your account and select your CBC level (P6, S3, or S6)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Take Interactive Quizzes</h3>
              <p className="text-muted-foreground">Answer questions with instant feedback and detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Certificates</h3>
              <p className="text-muted-foreground">
                Complete courses and receive digital certificates to showcase your achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 glow-text">What Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aline Uwimana",
                role: "S6 Student",
                content:
                  "Qouta made studying for my national exams so much easier. The instant feedback helped me understand my mistakes immediately.",
                rating: 5,
              },
              {
                name: "Jean Baptiste",
                role: "S3 Student",
                content:
                  "I love the voice commands feature! It makes learning feel like I'm in the future. The stories are also very engaging.",
                rating: 5,
              },
              {
                name: "Marie Claire",
                role: "P6 Student",
                content:
                  "The certificates I earned from Qouta made me feel so proud. My parents were impressed with my progress!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="glass-effect border-border/50">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 glow-text">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students already using Qouta to excel in their studies
          </p>
          <Button size="lg" asChild className="glow-effect">
            <Link href="/auth">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Qouta</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Qouta. All rights reserved. Built for Rwanda's future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
