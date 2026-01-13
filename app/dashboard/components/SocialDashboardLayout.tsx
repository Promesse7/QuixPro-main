"use client"
import { LeftSidebar } from "./LeftSidebar"
import { MainFeed } from "./MainFeed"
import { RightPanel } from "./RightPanel"

interface SocialDashboardLayoutProps {
  dashboardData: any
  user: any
}

export function SocialDashboardLayout({ dashboardData, user }: SocialDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Three Column Layout */}
      <div className="flex h-full">
        {/* Left Sidebar - Navigation & Profile */}
        <LeftSidebar user={user} />

        {/* Main Feed - Center Content */}
        <MainFeed dashboardData={dashboardData} />

        {/* Right Panel - Stats & Quick Actions */}
        <RightPanel dashboardData={dashboardData} user={user} />
      </div>
    </div>
  )
}
