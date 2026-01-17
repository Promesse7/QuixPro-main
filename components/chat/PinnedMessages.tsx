"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pin, ChevronDown } from "lucide-react"
import type { Message } from "@/models/Chat"

interface PinnedMessagesProps {
  pinnedMessages: Message[]
  onUnpin?: (messageId: string) => void
}

export function PinnedMessages({ pinnedMessages, onUnpin }: PinnedMessagesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (pinnedMessages.length === 0) return null

  return (
    <div className="border-b border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between px-4 py-2 rounded-none"
      >
        <div className="flex items-center gap-2">
          <Pin className="h-4 w-4" />
          <span className="text-sm font-medium">{pinnedMessages.length} Pinned Messages</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </Button>

      {isExpanded && (
        <div className="p-2 space-y-2 bg-muted/30">
          {pinnedMessages.map((msg) => (
            <div key={msg._id?.toString()} className="p-2 bg-background rounded border border-border/50 group">
              <p className="text-xs text-muted-foreground mb-1">Pinned by {msg.pinnedBy}</p>
              <p className="text-sm truncate">{msg.content}</p>
              {onUnpin && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onUnpin(msg._id?.toString() || "")}
                  className="mt-1 h-6 text-xs opacity-0 group-hover:opacity-100"
                >
                  Unpin
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
