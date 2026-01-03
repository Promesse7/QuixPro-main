"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Reaction {
  emoji: string
  count: number
  users: string[]
  hasReacted: boolean
}

interface MessageReactions {
  [messageId: string]: Reaction[]
}

interface EmojiReactionsProps {
  messageId: string
  reactions: Reaction[]
  currentUserId: string
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  className?: string
}

// Common reaction emojis
const REACTION_EMOJIS = [
  '❤️', '👍', '👎', '😂', '😮', '😢', '🔥', '👏', '🎉', '🙏'
]

export function EmojiReactions({ 
  messageId, 
  reactions, 
  currentUserId, 
  onAddReaction, 
  onRemoveReaction,
  className = ""
}: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [showAllReactions, setShowAllReactions] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const handleReactionClick = (emoji: string) => {
    const existingReaction = reactions.find(r => r.emoji === emoji)
    
    if (existingReaction?.hasReacted) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }
    setShowPicker(false)
  }

  const getReactionDisplay = (reaction: Reaction) => {
    const userCount = reaction.users.length
    const hasMultipleUsers = userCount > 1
    
    return {
      emoji: reaction.emoji,
      count: reaction.count,
      hasReacted: reaction.hasReacted,
      userCount,
      hasMultipleUsers,
      displayText: hasMultipleUsers ? `${userCount}` : ''
    }
  }

  const visibleReactions = showAllReactions ? reactions : reactions.slice(0, 6)
  const hasMoreReactions = reactions.length > 6

  if (reactions.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1 mt-1", className)}>
      {/* Existing Reactions */}
      {visibleReactions.map(reaction => {
        const display = getReactionDisplay(reaction)
        return (
          <Button
            key={reaction.emoji}
            variant={display.hasReacted ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleReactionClick(reaction.emoji)}
            className={cn(
              "h-6 px-2 text-xs hover:bg-gray-100",
              display.hasReacted && "bg-blue-100 text-blue-700 hover:bg-blue-200"
            )}
            title={`${reaction.emoji} • ${reaction.users.join(', ')}`}
          >
            <span className="mr-1">{reaction.emoji}</span>
            {display.displayText}
          </Button>
        )
      })}
      
      {/* Show More Button */}
      {hasMoreReactions && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllReactions(!showAllReactions)}
          className="h-6 px-2 text-xs hover:bg-gray-100"
        >
          +{reactions.length - 6}
        </Button>
      )}
    </div>
  )
}

// Hook for managing message reactions
export function useMessageReactions() {
  const [messageReactions, setMessageReactions] = useState<MessageReactions>({})

  const addReaction = (messageId: string, emoji: string, userId: string, userName: string) => {
    setMessageReactions(prev => {
      const reactions = prev[messageId] || []
      const existingReaction = reactions.find(r => r.emoji === emoji)
      
      if (existingReaction) {
        if (!existingReaction.users.includes(userId)) {
          return {
            ...prev,
            [messageId]: reactions.map(r => 
              r.emoji === emoji 
                ? {
                    ...r,
                    count: r.count + 1,
                    users: [...r.users, userName],
                    hasReacted: true
                  }
                : r
            )
          }
        }
      } else {
        return {
          ...prev,
          [messageId]: [...reactions, {
            emoji,
            count: 1,
            users: [userName],
            hasReacted: true
          }]
        }
      }
      
      return prev
    })
  }

  const removeReaction = (messageId: string, emoji: string, userId: string) => {
    setMessageReactions(prev => {
      const reactions = prev[messageId] || []
      const existingReaction = reactions.find(r => r.emoji === emoji)
      
      if (existingReaction && existingReaction.users.length > 1) {
        return {
          ...prev,
          [messageId]: reactions.map(r => 
            r.emoji === emoji 
              ? {
                  ...r,
                  count: r.count - 1,
                  users: r.users.filter((_, index) => index !== 0),
                  hasReacted: false
                }
              : r
          )
        }
      } else if (existingReaction) {
        return {
          ...prev,
          [messageId]: reactions.filter(r => r.emoji !== emoji)
        }
      }
      
      return prev
    })
  }

  const getReactions = (messageId: string): Reaction[] => {
    return messageReactions[messageId] || []
  }

  return {
    messageReactions,
    addReaction,
    removeReaction,
    getReactions
  }
}
