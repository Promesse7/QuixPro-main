"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Message } from "@/models/Chat"

interface ReplyPreviewProps {
  replyingTo: Message | null
  onCancel: () => void
}

export function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
  if (!replyingTo) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-l-2 border-primary rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground">Replying to message</p>
        <p className="text-sm text-foreground truncate">{replyingTo.content}</p>
      </div>
      <Button type="button" size="icon" variant="ghost" onClick={onCancel} className="h-6 w-6 shrink-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
