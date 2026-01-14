"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Award, Clock } from "lucide-react"

interface Activity {
  id: string
  type: "quiz_completed" | "certificate_earned"
  title: string
  score?: number
  date: string
  subject: string
}

interface RecentActivityProps {
  activities: Activity[]
  maxItems?: number
  viewAllHref?: string
}

export function RecentActivity({ activities, maxItems = 5, viewAllHref }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_completed":
        return Brain
      case "certificate_earned":
        return Award
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "quiz_completed":
        return "text-blue-400"
      case "certificate_earned":
        return "text-yellow-400"
      default:
        return "text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 glow-text">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription className="text-sm">Your latest learning events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul role="list" className="space-y-2">
          {(activities || []).slice(0, maxItems).map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const color = getActivityColor(activity.type)
          return (
            <li key={activity.id} className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-accent/20 rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{activity.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.subject}
                  </Badge>
                  {activity.score && <span className="text-xs text-muted-foreground">Score: {activity.score}%</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.date)}</p>
              </div>
            </li>
          )
        })}
        </ul>
        {viewAllHref && activities.length > maxItems && (
          <div className="pt-2">
            <a href={viewAllHref} className="text-xs text-primary hover:underline">View all</a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
