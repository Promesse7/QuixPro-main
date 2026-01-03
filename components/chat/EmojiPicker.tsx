"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Smile, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFrequentEmojis } from '@/lib/emojiUtils'

// Emoji categories with frequently used emojis
const EMOJI_CATEGORIES = {
  frequent: [], // Will be populated dynamically
  smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮'
  ],
  gestures: [
    '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
    '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
    '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
    '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
    '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄'
  ],
  hearts: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
    '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳'
  ],
  activities: [
    '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎉', '🎊', '🎈', '🎁',
    '🎀', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉',
    '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎱',
    '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
    '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸'
  ],
  food: [
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
    '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
    '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
    '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈',
    '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟'
  ],
  objects: [
    '⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹',
    '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
    '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚',
    '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋',
    '🔌', '💡', '🔦', '🕯', '💡', '🪔', '🧯', '🛢', '💸', '💵'
  ],
  symbols: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
    '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳'
  ],
  flags: [
    '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱',
    '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼',
    '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿',
    '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇳', '🇧🇬', '🇧🇮',
    '🇨🇦', '🇨🇻', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴'
  ]
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export function EmojiPicker({ onEmojiSelect, isOpen, onClose, buttonRef }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('frequent')
  const [searchTerm, setSearchTerm] = useState('')
  const [frequentEmojis, setFrequentEmojis] = useState<string[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFrequentEmojis(getFrequentEmojis())
  }, [])

  const filteredEmojis = searchTerm 
    ? Object.values(EMOJI_CATEGORIES).flat().filter(emoji => 
        emoji.includes(searchTerm) || 
        emoji.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activeCategory === 'frequent' 
      ? frequentEmojis 
      : EMOJI_CATEGORIES[activeCategory]

  const categoryIcons = {
    frequent: '⭐',
    smileys: '😀',
    gestures: '👋',
    hearts: '❤️',
    activities: '⚽',
    food: '🍎',
    objects: '💻',
    symbols: '✨',
    flags: '🏳️'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, buttonRef])

  if (!isOpen) return null

  return (
    <div 
      ref={pickerRef}
      className="fixed bottom-16 right-4 z-[9999] bg-background border border-border rounded-lg shadow-lg w-80 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Emoji Picker</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
        />
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="flex border-b border-border overflow-x-auto">
          {Object.entries(EMOJI_CATEGORIES).map(([category]) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
              className={cn(
                "flex items-center justify-center px-3 py-2 text-xs hover:bg-muted transition-colors",
                activeCategory === category && "bg-primary/10 text-primary border-b-2 border-primary"
              )}
            >
              <span className="text-lg mr-1">{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="h-64 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onEmojiSelect(emoji)
                onClose()
              }}
              className="flex items-center justify-center p-2 text-lg hover:bg-muted rounded transition-colors"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {filteredEmojis.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No emojis found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border text-xs text-muted-foreground">
        {searchTerm ? (
          <span>{filteredEmojis.length} emojis found</span>
        ) : (
          <span>{activeCategory === 'frequent' ? frequentEmojis.length : EMOJI_CATEGORIES[activeCategory].length} emojis</span>
        )}
      </div>
    </div>
  )
}

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

export function EmojiButton({ onEmojiSelect, className }: EmojiButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("rounded-full w-10 h-10 shrink-0", className)}
        title="Add emoji"
      >
        <Smile className="w-4 h-4" />
      </Button>
      
      <EmojiPicker
        onEmojiSelect={onEmojiSelect}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonRef={buttonRef}
      />
    </div>
  )
}
