"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, Award, TrendingUp, Play, Mic } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  // Routes already point to app pages; ensure these exist.
  const actions = [
    {
      title: "Take Quiz",
      description: "Start a new quiz",
      icon: Brain,
      href: "/quiz",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Continue Learning",
      description: "Resume where you left off",
      icon: Play,
      href: "/quiz-selection", // route to selection; could be replaced by resume endpoint
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Read Stories",
      description: "Explore stories & biographies",
      icon: BookOpen,
      href: "/stories",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "View Certificates",
      description: "See your achievements",
      icon: Award,
      href: "/certificates",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Progress Report",
      description: "Track your performance",
      icon: TrendingUp,
      href: "/progress",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Voice Learning",
      description: "Use voice commands",
      icon: Mic,
      href: "/voice",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="glass-effect border-border/50 hover:glow-effect transition-all duration-300"
        >
          <CardHeader className="px-4 pt-4">
            <div className="flex items-center justify-between w-full">
              <div className={`w-12 h-12 rounded-full ${action.bgColor} flex items-center justify-center`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Button asChild variant="ghost" className="h-auto p-0 w-full text-left">
              <Link href={action.href} className="flex flex-col items-start space-y-2">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
