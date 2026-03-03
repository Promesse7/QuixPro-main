"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Heart, ThumbsUp, Laugh, Frown, Angry, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Reaction {
  emoji: string
  users: Array<{
    id: string
    name: string
    avatar?: string
  }>
  count: number
  isFromCurrentUser: boolean
}

interface MessageReactionsProps {
  messageId: string
  reactions: Reaction[]
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  className?: string
  compact?: boolean
}

const COMMON_REACTIONS = [
  { emoji: "❤️", icon: Heart, label: "Love" },
  { emoji: "👍", icon: ThumbsUp, label: "Like" },
  { emoji: "😊", icon: Laugh, label: "Happy" },
  { emoji: "😮", icon: null, label: "Surprised" },
  { emoji: "😢", icon: Frown, label: "Sad" },
  { emoji: "😡", icon: Angry, label: "Angry" },
]

const ALL_REACTIONS = [
  ...COMMON_REACTIONS,
  { emoji: "🎉", icon: null, label: "Party" },
  { emoji: "🔥", icon: null, label: "Fire" },
  { emoji: "💯", icon: null, label: "100" },
  { emoji: "🤔", icon: null, label: "Thinking" },
  { emoji: "👏", icon: null, label: "Clap" },
  { emoji: "🙏", icon: null, label: "Pray" },
  { emoji: "💪", icon: null, label: "Strong" },
  { emoji: "🌟", icon: null, label: "Star" },
  { emoji: "🚀", icon: null, label: "Rocket" },
  { emoji: "💎", icon: null, label: "Diamond" },
]

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  className = "",
  compact = false
}) => {
  const [showAllReactions, setShowAllReactions] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const handleReactionClick = useCallback((emoji: string) => {
    const existingReaction = reactions.find(r => r.emoji === emoji)

    if (existingReaction?.isFromCurrentUser) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }

    setShowReactionPicker(false)
  }, [reactions, messageId, onAddReaction, onRemoveReaction])

  const getReactionUsers = useCallback((reaction: Reaction) => {
    if (compact && reaction.count > 3) {
      return `${reaction.users.slice(0, 2).map(u => u.name).join(", ")} +${reaction.count - 2}`
    }
    return reaction.users.map(u => u.name).join(", ")
  }, [compact])

  if (reactions.length === 0) {
    return (
      <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-3 h-3" />
            Add reaction
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-6 gap-1">
            {COMMON_REACTIONS.map(({ emoji, icon: Icon, label }) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={() => handleReactionClick(emoji)}
                title={label}
              >
                {Icon ? <Icon className="w-4 h-4" /> : <span className="text-sm">{emoji}</span>}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {/* Existing reactions */}
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={reaction.isFromCurrentUser ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-6 px-2 text-xs gap-1 transition-all",
                    reaction.isFromCurrentUser && "ring-1 ring-primary/20",
                    "hover:bg-muted/50"
                  )}
                  onClick={() => handleReactionClick(reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-xs">{reaction.count}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <div className="text-sm">
                  <p className="font-medium mb-1">Reactions</p>
                  <p className="text-muted-foreground">
                    {getReactionUsers(reaction)}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add reaction button */}
      <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="space-y-2">
            {/* Common reactions */}
            <div className="grid grid-cols-6 gap-1">
              {COMMON_REACTIONS.map(({ emoji, icon: Icon, label }) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={() => handleReactionClick(emoji)}
                  title={label}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : <span className="text-sm">{emoji}</span>}
                </Button>
              ))}
            </div>

            {/* All reactions toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => setShowAllReactions(!showAllReactions)}
            >
              {showAllReactions ? "Show less" : "Show more reactions"}
            </Button>

            {/* Extended reactions */}
            {showAllReactions && (
              <div className="grid grid-cols-6 gap-1">
                {ALL_REACTIONS.filter(r => !COMMON_REACTIONS.some(cr => cr.emoji === r.emoji)).map(({ emoji, label }) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                    onClick={() => handleReactionClick(emoji)}
                    title={label}
                  >
                    <span className="text-sm">{emoji}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
