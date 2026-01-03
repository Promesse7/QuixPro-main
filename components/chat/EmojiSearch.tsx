"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isEmoji, getFrequentEmojis, updateFrequentEmojis } from '@/lib/emojiUtils'

interface EmojiSearchProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Comprehensive emoji database
const EMOJI_DATABASE = [
  // Smileys & Emotion
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍',
  '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
  '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
  
  // Gestures & Body Parts
  '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
  '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴',
  '👀', '👁', '👅', '👄', '🫦', '🦴', '🦷', '👃', '👂', '🦻',
  
  // Hearts & Love
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓',
  '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
  
  // Activities & Sports
  '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑',
  '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸',
  '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊',
  '🤽', '🚣', '🧗', '🚴', '🚵', '🪖', '🤹', '🪆', '🎪', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧',
  '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🪈', '🎲', '♟️', '🎯', '🎳',
  '🎮', '🕹️', '🎰', '🧩',
  
  // Food & Drink
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍',
  '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
  '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗',
  '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘',
  '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠',
  '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿',
  '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🫕', '🍵', '🍶', '🍾', '🍷', '🍸',
  '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪',
  '🫙',
  
  // Objects & Symbols
  '⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀',
  '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚',
  '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔',
  '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️',
  '🛠', '⛏️', '🪓', '🔩', '⚙️', '🗜️', '🪚', '🔫', '🪃', '🏹', '🛡️', '🪬', '🔮', '🪿', '🦽',
  '🦼', '🪁', '🪂', '🪄', '🧿', '🪈', '🪇', '🪅', '🪆', '🪋', '🪀', '🪁', '🪂', '🪃', '🪄',
  '🪅', '🪆', '🪇', '🪈', '🪉', '🪊', '🪋', '🪌', '🪍', '🪎', '🪏', '🪐', '🪑', '🪒', '🪓',
  '🪔', '🪕', '🪖', '🪗', '🪘', '🪙', '🪚', '🪛', '🪜', '🪝', '🪞', '🪟', '🪠', '🪡', '🪢',
  '🪣', '🪤', '🪥', '🪦', '🪧', '🪨', '🪩', '🪪', '🪫', '🪬', '🪭', '🪮', '🪯', '🪰', '🪱',
  '🪲', '🪳', '🪴', '🪵', '🪶', '🪷', '🪸', '🪹', '🪺',
  
  // Nature & Animals
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸',
  '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
  '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🪲', '🪳', '🕷',
  '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🪸', '🐡', '🐠',
  '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏',
  '🐪', '🐫', '🦒', '🦘', '🐃', '🦙', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦌', '🦥', '🦦',
  '🦨', '🦡', '🐁', '🐀', '🦔', '🐇', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔',
  '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔', '🦔',
  '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵',
  '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔',
  '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '⭐', '🌟', '🌠',
  '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌊', '💧', '💦',
  '☔', '💧', '💦', '☔', '❄️', '⛄', '☃️', '⛷️', '🏂', '🏔️', '🗻', '🏕️', '🏖️', '🏝️', '🏜️',
  '🌋', '⛰️', '🏞️', '🏛️', '🏗️', '🧭', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠',
  '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏞️', '🏛️', '🏗️', '🧭', '🗿', '🗽', '🗼', '🏰',
  '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏞️', '🏛️', '🏗️',
  
  // Flags
  '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴',
  '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾',
  '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇳', '🇧🇬', '🇧🇮', '🇨🇦', '🇨🇻',
  '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇮', '🇨🇰', '🇨🇷',
  '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷',
  '🇪🇪', '🇸🇿', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪',
  '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳',
  '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇹', '🇯🇲', '🇯🇵', '🇯🇪', '🇯🇴',
  '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹',
  '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹',
  '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇱',
  '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇲🇵', '🇰🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦',
  '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇧🇱',
  '🇸🇭', '🇰🇳', '🇱🇨', '🇵🇲', '🇻🇨', '🇸🇲', '🇸🇹', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽',
  '🇸🇰', '🇸🇮', '🇸🇧', '🇸🇴', '🇿🇦', '🇬🇸', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇸🇩', '🇸🇷', '🇸🇯', '🇸🇪',
  '🇨🇭', '🇸🇾', '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲',
  '🇹🇨', '🇻🇮', '🇹🇻', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦', '🇻🇳', '🇼🇫',
  '🇪🇭', '🇾🇪', '🇿🇲', '🇿🇼'
]

export function EmojiSearch({ onEmojiSelect, isOpen, onClose, className = "" }: EmojiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [frequentEmojis, setFrequentEmojis] = useState<string[]>([])
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setFrequentEmojis(getFrequentEmojis())
      searchInputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = EMOJI_DATABASE.filter(emoji => 
        emoji.includes(searchTerm) || 
        getEmojiKeywords(emoji).some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ).slice(0, 50)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const getEmojiKeywords = (emoji: string): string[] => {
    // Simple keyword mapping for common emojis
    const keywords: Record<string, string[]> = {
      '😀': ['smile', 'happy', 'grinning'],
      '😂': ['laugh', 'tears', 'joy', 'funny'],
      '❤️': ['heart', 'love', 'red'],
      '👍': ['thumbs', 'up', 'good', 'yes'],
      '👎': ['thumbs', 'down', 'bad', 'no'],
      '🔥': ['fire', 'hot', 'flame', 'burning'],
      '✨': ['sparkles', 'magic', 'shiny'],
      '🎉': ['party', 'celebration', 'confetti'],
      '🙏': ['pray', 'thanks', 'please'],
      '💯': ['hundred', '100', 'perfect'],
      '😎': ['cool', 'sunglasses', 'swag'],
      '🤔': ['thinking', 'hmm', 'ponder'],
      '😭': ['cry', 'tears', 'sad'],
      '😴': ['sleep', 'tired', 'night'],
      '🍕': ['pizza', 'food', 'italian'],
      '🌮': ['taco', 'mexican', 'food'],
      '⚽': ['soccer', 'football', 'sports'],
      '🎮': ['game', 'gaming', 'controller'],
      '💻': ['computer', 'laptop', 'tech'],
      '📱': ['phone', 'mobile', 'smartphone']
    }
    return keywords[emoji] || []
  }

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji)
    updateFrequentEmojis(emoji)
    
    // Add to recent emojis
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)
    setRecentEmojis(newRecent)
    
    setSearchTerm("")
    onClose()
  }

  const displayEmojis = searchTerm ? searchResults : frequentEmojis

  if (!isOpen) return null

  return (
    <div className={cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", className)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Emoji Search</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Emoji Grid */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {displayEmojis.length > 0 ? (
            <div className="grid grid-cols-8 gap-2">
              {displayEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="flex items-center justify-center p-3 text-2xl hover:bg-gray-100 rounded-lg transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No emojis found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Type to search for emojis</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{displayEmojis.length} emojis</span>
            <span>Press ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing emoji search
export function useEmojiSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const openSearch = () => setIsSearchOpen(true)
  const closeSearch = () => setIsSearchOpen(false)

  return {
    isSearchOpen,
    openSearch,
    closeSearch
  }
}
