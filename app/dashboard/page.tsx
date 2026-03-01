"use client"

import { Activity } from "lucide-react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { ModernDashboardLayout } from "@/components/dashboard/ModernDashboardLayout"
import { ZeroStateExperience } from "@/components/onboarding/ZeroStateExperience"
import { Button } from "@/components/ui/button"

export default function Ultimate2025Dashboard() {
  const {
    user,
    transformedData,
    loading,
    error,
    isAuthenticated,
    hasData
  } = useDashboardData()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading experience...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <ZeroStateExperience>
      <ModernDashboardLayout
        dashboardData={transformedData}
        user={user || {
          name: "User",
          email: "user@example.com",
          level: "Beginner",
          avatar: "",
          points: 0,
          streak: 0
        }}
      />
    </ZeroStateExperience>
  )
}
