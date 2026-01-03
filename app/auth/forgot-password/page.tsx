"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Mail, Shield, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getBaseUrl } from '@/lib/getBaseUrl'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!email.trim()) {
            setError("Please enter your email address")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        setIsLoading(true)

        try {
            const baseUrl = getBaseUrl()
            const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send reset link")
            }

            setSuccess(data.message || "Reset link sent successfully")
            setIsSubmitted(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setError("")
        setSuccess("")
        setIsLoading(true)

        try {
            const baseUrl = getBaseUrl()
            const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to resend reset link")
            }

            setSuccess(data.message || "Reset link resent successfully")
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Login Link */}
                <Link 
                    href="/auth/login" 
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Link>

                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Forgot Password?
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            No worries! We'll send you a reset link
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {!isSubmitted ? (
                            <>
                                {/* Instructions */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-1">Security Notice:</p>
                                            <ul className="space-y-1 text-xs">
                                                <li>• Reset links expire after 1 hour</li>
                                                <li>• Check your spam folder if needed</li>
                                                <li>• Never share reset links with others</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="h-11"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            autoComplete="email"
                                        />
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Sending reset link...</span>
                                            </div>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            /* Success State */
                            <div className="text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Check Your Email
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        We've sent a password reset link to:<br />
                                        <span className="font-medium text-gray-900">{email}</span>
                                    </p>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium mb-1">Important:</p>
                                            <p>The reset link will expire in 1 hour for security reasons.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Didn't receive the email?
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                                <span>Resending...</span>
                                            </div>
                                        ) : (
                                            "Resend Reset Link"
                                        )}
                                    </Button>
                                </div>

                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-800">{success}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Help Section */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Need help?{" "}
                                <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        Protected by advanced security measures
                    </p>
                </div>
            </div>
        </div>
    )
}
