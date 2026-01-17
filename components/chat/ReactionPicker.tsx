"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "✨", "🎉"]

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
}

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button type="button" size="icon" variant="ghost" onClick={() => setIsOpen(!isOpen)} className="h-6 w-6">
        <Smile className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg flex gap-1 flex-wrap w-48">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji)
                setIsOpen(false)
              }}
              className="text-xl hover:bg-muted p-2 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
