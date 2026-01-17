"use client"
import { ReactionPicker } from "./ReactionPicker"
import type { Message } from "@/models/Chat"
import { cn } from "@/lib/utils"

interface MessageItemProps {
  message: Message & { sender?: { _id: string; name: string; image?: string } }
  isCurrentUser?: boolean
  onReply?: (message: Message) => void
  onReaction?: (emoji: string) => void
  onPin?: () => void
  reactions?: Record<string, string[]>
}

export default function MessageItem({
  message,
  isCurrentUser = false,
  onReply,
  onReaction,
  onPin,
  reactions = {},
}: MessageItemProps) {
  if (!message) return null

  const messageReactions = reactions || {}
  const reactionEntries = Object.entries(messageReactions)

  return (
    <div className={cn("flex group", isCurrentUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs px-4 py-2 rounded-lg",
          isCurrentUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm",
        )}
      >
        {/* Reply preview if this message is a reply */}
        {message.replyTo && (
          <div className="text-xs opacity-70 mb-2 pl-2 border-l-2 border-current">Replying to message...</div>
        )}

        {/* Message content */}
        {message.type === "math" ? (
          <div className="italic text-indigo-700">{message.content}</div>
        ) : message.type === "image" ? (
          <div>
            <img src={message.content || "/placeholder.svg"} alt="shared" className="max-w-xs rounded" />
          </div>
        ) : (
          <div>{message.content}</div>
        )}

        {/* Reactions display */}
        {reactionEntries.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {reactionEntries.map(([emoji]) => (
              <span key={emoji} className="text-sm">
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Pinned indicator */}
        {message.isPinned && <p className="text-xs opacity-70 mt-1">📌 Pinned</p>}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReply && (
            <button onClick={() => onReply(message)} className="text-xs hover:underline">
              Reply
            </button>
          )}
          {onReaction && <ReactionPicker onSelect={onReaction} />}
          {onPin && (
            <button onClick={onPin} className="text-xs hover:underline">
              {message.isPinned ? "Unpin" : "Pin"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
