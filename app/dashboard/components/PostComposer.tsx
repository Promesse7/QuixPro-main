"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Lightbulb, MessageSquare, Share2, Brain } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export function PostComposer() {
  const user = getCurrentUser()
  const [isExpanded, setIsExpanded] = useState(false)

  const actions = [
    { icon: Brain, label: "Ask a Question", color: "text-blue-400" },
    { icon: Lightbulb, label: "Share Insight", color: "text-yellow-400" },
    { icon: MessageSquare, label: "Start Discussion", color: "text-purple-400" },
    { icon: Share2, label: "Share Result", color: "text-green-400" },
  ]

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Input Area */}
          <div className="flex-1">
            <div
              onClick={() => setIsExpanded(true)}
              className="w-full px-4 py-3 rounded-full bg-muted/50 border border-border/30 hover:border-primary/50 cursor-text transition-all text-muted-foreground hover:text-foreground"
            >
              Share an insight or ask a question...
            </div>

            {/* Expanded View */}
            {isExpanded && (
              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="What's on your mind? Ask a question, share a discovery, or discuss a topic..."
                  className="w-full h-32 p-3 rounded-lg bg-muted/50 border border-border/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground"
                />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/30 text-sm transition-all"
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                      <span className="text-muted-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setIsExpanded(false)}>
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
