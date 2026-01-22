"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Mail, Lock, User, GraduationCap, ArrowLeft, Sparkles, CheckCircle } from "lucide-react"
import Link from "next/link"
import { setCurrentUser } from "@/lib/auth"
import { getBaseUrl } from '@/lib/getBaseUrl'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", role: "", level: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [levelsState, setLevels] = useState<Array<{ name: string; stage?: string }>>([])

  // Load levels from DB
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/api/levels`)
        if (!res.ok) throw new Error("Failed to load levels")
        const data = await res.json()
        setLevels(data.levels || [])
      } catch (e) {
        console.error("Failed to load levels", e)
        setLevels([])
      }
    }
    fetchLevels()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.user && data.token) {
        setCurrentUser(data.user)
        // Store token in localStorage for API authentication
        localStorage.setItem('token', data.token)
        // Also keep cookies for backward compatibility
        document.cookie = `qouta_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        document.cookie = `qouta_role=${data.user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin"
          } else if (data.user.role === "teacher") {
            window.location.href = "/teacher"
          } else {
            window.location.href = "/dashboard"
          }
        }, 1000)
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupForm),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setCurrentUser(data.user)
        document.cookie = `qouta_token=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`
        document.cookie = `qouta_role=${data.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`
        
        setSuccess("Account created successfully! Redirecting...")
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin"
          } else if (data.user.role === "teacher") {
            window.location.href = "/teacher"
          } else {
            window.location.href = "/dashboard"
          }
        }, 1000)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary/10 to-primary/5 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center lg:text-left max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">Quix</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Continue your learning journey with personalized quizzes, instant feedback, and adaptive learning paths designed for your success.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15K+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.3M+</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Success</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Secure and encrypted authentication</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="lg:flex-1 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">Quix</span>
            </div>
            <p className="text-muted-foreground">Your learning journey continues</p>
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Test Credentials */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Test Credentials</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Student: aline.uwimana@student.rw / password123</div>
                  <div>Teacher: teacher@qouta.rw / password123</div>
                  <div>Admin: admin@qouta.rw / password123</div>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-11"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 h-11"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 h-11"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-11"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                      <Select
                        value={signupForm.role}
                        onValueChange={(value) => setSignupForm({ ...signupForm, role: value })}
                        required
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {signupForm.role === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="level" className="text-sm font-medium">Grade Level</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Select
                            value={signupForm.level}
                            onValueChange={(value) => setSignupForm({ ...signupForm, level: value })}
                            required
                          >
                            <SelectTrigger className="pl-10 h-11">
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                            <SelectContent>
                              {levelsState.map((lvl) => (
                                <SelectItem key={lvl.name} value={lvl.name}>
                                  {lvl.name} {lvl.stage ? `- ${lvl.stage}` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10 h-11"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center pt-4 border-t border-border/50">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
