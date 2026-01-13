"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Award } from "lucide-react"

interface FeedCardProps {
  type: "certificate" | "insight" | "discussion" | "result"
  title: string
  description?: string
  author?: string
  timestamp?: string
  icon?: string
  stats?: { likes: number; comments: number; shares: number }
}

export function FeedCard({
  type,
  title,
  description,
  author = "User",
  timestamp = "Just now",
  stats = { likes: 0, comments: 0, shares: 0 },
}: FeedCardProps) {
  const typeColors = {
    certificate: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: Award,
    },
    insight: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-700" },
    discussion: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-700" },
    result: { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-700" },
  }

  const config = typeColors[type]

  return (
    <Card className={`border ${config.border} ${config.bg} shadow-lg backdrop-blur-sm hover:shadow-xl transition-all`}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{author}</p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>💚 {stats.likes}</span>
            <span>💬 {stats.comments}</span>
            <span>↗️ {stats.shares}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
