"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, BookOpen, MessageCircle, Users, HelpCircle, Megaphone } from "lucide-react"

interface ActivityCardProps {
  activity: {
    type: string
    description: string
    time: string
    link?: string
  }
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconMap: { [key: string]: React.ReactNode } = {
    quiz_completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    certificate_earned: <BookOpen className="w-5 h-5 text-yellow-500" />,
    new_message: <MessageCircle className="w-5 h-5 text-blue-500" />,
    group_joined: <Users className="w-5 h-5 text-purple-500" />,
    answer_received: <HelpCircle className="w-5 h-5 text-orange-500" />,
    post_updated: <Megaphone className="w-5 h-5 text-indigo-500" />,
  }

  const timeSince = (date: string | Date): string => {
    const aDate = new Date(date)
    const seconds = Math.floor((new Date().getTime() - aDate.getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  return (
    <Card className="border border-border/30 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="mt-1">{iconMap[activity.type] || iconMap.post_updated}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{activity.description}</p>
          <p className="text-xs text-muted-foreground mt-1">{timeSince(activity.time)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
