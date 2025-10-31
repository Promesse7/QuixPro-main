"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Mail, Lock, User, GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { setCurrentUser } from "@/lib/auth"
import { getBaseUrl } from '@/lib/getBaseUrl';



  export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", role: "", level: "", password: "" })
  const [error, setError] = useState("")
  const [levelsState, setLevels] = useState<Array<{ name: string; stage?: string }>>([])

  // Load levels from DB
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const baseUrl = getBaseUrl();
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
  
// Update the handleLogin and handleSignup functions in app/auth/page.tsx

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    const baseUrl = getBaseUrl();
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

    if (response.ok && data.user) {
      // Store in localStorage (existing)
      setCurrentUser(data.user)
      
      // ALSO set cookies for middleware (new)
      document.cookie = `qouta_token=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      document.cookie = `qouta_role=${data.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`
      
      // Redirect based on role
      if (data.user.role === "admin") {
        window.location.href = "/admin"
      } else if (data.user.role === "teacher") {
        window.location.href = "/teacher"
      } else {
        window.location.href = "/dashboard"
      }
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

  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupForm),
    })

    const data = await response.json()

    if (response.ok && data.user) {
      // Store in localStorage (existing)
      setCurrentUser(data.user)
      
      // ALSO set cookies for middleware (new)
      document.cookie = `qouta_token=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `qouta_role=${data.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`
      
      // Redirect based on role
      if (data.user.role === "admin") {
        window.location.href = "/admin"
      } else if (data.user.role === "teacher") {
        window.location.href = "/teacher"
      } else {
        window.location.href = "/dashboard"
      }
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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary glow-text" />
            <span className="text-2xl font-bold glow-text">Qouta</span>
          </div>
          <p className="text-muted-foreground">Welcome to the future of learning</p>
        </div>

        <Card className="glass-effect border-border/50 glow-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Qouta</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400 font-semibold mb-2">Test Credentials:</p>
              <div className="text-xs text-blue-300 space-y-1">
                <div>Student: aline.uwimana@student.rw / password123</div>
                <div>Teacher: teacher@qouta.rw / password123</div>
                <div>Admin: admin@qouta.rw / password123</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 glass-effect border-border/50 focus:glow-effect"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 glass-effect border-border/50 focus:glow-effect"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full glow-effect" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 glass-effect border-border/50 focus:glow-effect"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 glass-effect border-border/50 focus:glow-effect"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={signupForm.role}
                      onValueChange={(value) => setSignupForm({ ...signupForm, role: value })}
                      required
                    >
                      <SelectTrigger className="glass-effect border-border/50 focus:glow-effect">
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
                      <Label htmlFor="level">Grade Level</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select
                          value={signupForm.level}
                          onValueChange={(value) => setSignupForm({ ...signupForm, level: value })}
                          required
                        >
                          <SelectTrigger className="pl-10 glass-effect border-border/50 focus:glow-effect">
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
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 glass-effect border-border/50 focus:glow-effect"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full glow-effect" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
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
  )
}
