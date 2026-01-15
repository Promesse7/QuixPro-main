"use client"
import { LeftSidebar } from "./LeftSidebar"
import { MainFeed } from "./MainFeed"
import { RightPanel } from "./RightPanel"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { Home, MessageSquare } from "lucide-react"

interface SocialDashboardLayoutProps {
  dashboardData: any
  user: any
}

export function SocialDashboardLayout({ dashboardData, user }: SocialDashboardLayoutProps) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "Feed", icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex h-full lg:ml-72">
          <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4">
            <AppBreadcrumb items={breadcrumbItems} />
          </main>
        </div>
      </div>

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
