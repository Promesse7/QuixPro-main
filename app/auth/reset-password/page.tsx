"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Lock, Eye, EyeOff, AlertCircle, Shield, Check } from "lucide-react"
import Link from "next/link"
import { getBaseUrl } from '@/lib/getBaseUrl'

function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        }
        
        return requirements
    }

    const passwordRequirements = validatePassword(password)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!token) {
            setError("Invalid reset link")
            return
        }

        if (!password) {
            setError("Please enter a new password")
            return
        }

        if (!Object.values(passwordRequirements).every(req => req)) {
            setError("Please meet all password requirements")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            const baseUrl = getBaseUrl()
            const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password")
            }

            setSuccess(data.message || "Password reset successful")
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="text-center p-8">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
                        <p className="text-gray-600 mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link href="/auth/forgot-password">
                            <Button className="w-full">
                                Request New Reset Link
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
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
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Create your new secure password
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Security Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Password Requirements:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li className="flex items-center space-x-2">
                                            <Check className={`w-3 h-3 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span>At least 8 characters</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className={`w-3 h-3 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span>One uppercase letter</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className={`w-3 h-3 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span>One lowercase letter</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className={`w-3 h-3 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span>One number</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className={`w-3 h-3 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span>One special character (@$!%*?&)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="h-11 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="h-11 pr-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <p className="text-sm text-green-800">{success}</p>
                                    </div>
                                    <p className="text-xs text-green-700 mt-2">Redirecting to login page...</p>
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                                disabled={isLoading || success !== ""}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Resetting password...</span>
                                    </div>
                                ) : success ? (
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Password Reset Successfully!</span>
                                    </div>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>

                        {/* Help Section */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Remember your password?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
