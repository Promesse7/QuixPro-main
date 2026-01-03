"use client"

import React, { useState, useEffect, useRef } from 'react'
import { convertEmojiShortcuts } from '@/lib/emojiUtils'

interface EmojiShortcutsProps {
  value: string
  onChange: (value: string) => void
  onEmojiSelect?: (emoji: string) => void
  placeholder?: string
  className?: string
}

export function EmojiShortcuts({ 
  value, 
  onChange, 
  onEmojiSelect, 
  placeholder = "Type a message...",
  className = ""
}: EmojiShortcutsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Common emoji shortcuts for suggestions
  const emojiShortcuts = [
    ':)', ':D', ':P', ';)', ':o', ':O', 'xD', ':|', ':/', ':*', '<3', '</3>',
    ':fire:', ':star:', ':check:', ':x:', ':100:', ':ok:', ':thumbsup:', ':thumbsdown:',
    ':pray:', ':clap:', ':party:', ':sparkles:', ':heart:', ':broken_heart:', ':eyes:',
    ':thinking:', ':wave:', ':point_up:', ':point_down:', '+1', '-1', ':heavy_check_mark:',
    ':warning:', ':information_source:', ':question:', ':exclamation:', ':gear:', ':lock:'
  ]

  useEffect(() => {
    // Convert shortcuts to emojis as user types
    const converted = convertEmojiShortcuts(value)
    if (converted !== value) {
      onChange(converted)
    }
  }, [value, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const newCursorPosition = e.target.selectionStart || 0
    onChange(newValue)
    setCursorPosition(newCursorPosition)

    // Check for emoji shortcuts near cursor
    const textBeforeCursor = newValue.substring(0, newCursorPosition)
    const shortcutMatch = textBeforeCursor.match(/:([a-zA-Z0-9_+-]+)$/)
    
    if (shortcutMatch) {
      const partialShortcut = shortcutMatch[0]
      const matchingShortcuts = emojiShortcuts.filter(shortcut => 
        shortcut.startsWith(partialShortcut) && shortcut !== partialShortcut
      )
      
      if (matchingShortcuts.length > 0) {
        setSuggestions(matchingShortcuts.slice(0, 5))
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        // Navigate suggestions (would need state for selected index)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        // Navigate suggestions
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        if (suggestions.length > 0) {
          selectSuggestion(suggestions[0])
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
  }

  const selectSuggestion = (shortcut: string) => {
    const textBeforeCursor = value.substring(0, cursorPosition)
    const textAfterCursor = value.substring(cursorPosition)
    const shortcutMatch = textBeforeCursor.match(/:([a-zA-Z0-9_+-]+)$/)
    
    if (shortcutMatch) {
      const beforeShortcut = textBeforeCursor.substring(0, shortcutMatch.index)
      const newShortcut = shortcut
      const newValue = beforeShortcut + newShortcut + textAfterCursor
      onChange(newValue)
      
      // Update cursor position
      const newCursorPosition = beforeShortcut.length + newShortcut.length
      setCursorPosition(newCursorPosition)
      
      // Focus input and set cursor position
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
        }
      }, 0)
    }
    
    setShowSuggestions(false)
    onEmojiSelect?.(convertEmojiShortcuts(shortcut))
  }

  const insertEmoji = (emoji: string) => {
    const textBeforeCursor = value.substring(0, cursorPosition)
    const textAfterCursor = value.substring(cursorPosition)
    const newValue = textBeforeCursor + emoji + textAfterCursor
    onChange(newValue)
    
    // Update cursor position
    const newCursorPosition = cursorPosition + emoji.length
    setCursorPosition(newCursorPosition)
    
    // Focus input and set cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
    
    onEmojiSelect?.(emoji)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        onClick={() => setCursorPosition(inputRef.current?.selectionStart || 0)}
        onSelect={() => setCursorPosition(inputRef.current?.selectionStart || 0)}
      />
      
      {/* Emoji Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-1">Emoji shortcuts:</div>
            {suggestions.map((shortcut, index) => (
              <button
                key={shortcut}
                onClick={() => selectSuggestion(shortcut)}
                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center justify-between"
              >
                <span className="font-mono text-xs">{shortcut}</span>
                <span className="text-lg">{convertEmojiShortcuts(shortcut)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick Emoji Bar */}
      <div className="flex items-center gap-1 mt-2 p-2 bg-gray-50 rounded-md">
        <span className="text-xs text-gray-500 mr-2">Quick:</span>
        {['😀', '😂', '❤️', '👍', '👎', '🔥', '✨', '🎉', '🙏', '💯'].map(emoji => (
          <button
            key={emoji}
            onClick={() => insertEmoji(emoji)}
            className="text-lg hover:bg-gray-200 rounded px-1 py-0.5 transition-colors"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

// Hook for emoji shortcuts
export function useEmojiShortcuts() {
  const [isEnabled, setIsEnabled] = useState(true)

  const toggleShortcuts = () => {
    setIsEnabled(prev => !prev)
  }

  return {
    isEnabled,
    toggleShortcuts
  }
}
