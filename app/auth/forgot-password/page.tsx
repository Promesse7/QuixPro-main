"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { getBaseUrl } from '@/lib/getBaseUrl'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const baseUrl = getBaseUrl()
            const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("If an account exists with this email, you will receive a password reset link shortly.")
                setEmail("")
            } else {
                setError(data.error || "Failed to process request")
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Side - Hero Section (Simplified) */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 to-primary/5 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-left max-w-md">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Brain className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-3xl font-bold">Quix</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Forgot Password?
                    </h1>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Don't worry! It happens. Please enter the email associated with your account and we'll send you a link to reset your password.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Brain className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold">Quix</span>
                        </div>
                    </div>

                    <Card className="border-border/50 shadow-xl">
                        <CardHeader className="space-y-2 pb-6">
                            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email address to verify your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10 h-11"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                                </Button>
                            </form>

                            <div className="text-center pt-4 border-t border-border/50">
                                <Link
                                    href="/auth"
                                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
