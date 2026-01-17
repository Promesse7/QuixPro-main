"use client"

import { useState } from "react"
import { useMentions } from "@/hooks/useMentions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface MentionsPopoverProps {
  groupId: string
  onMentionSelect: (userId: string, username: string) => void
}

export function MentionsPopover({ groupId, onMentionSelect }: MentionsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    availableUsers,
    mentionedUsers,
    mentionSearchTerm,
    setMentionSearchTerm,
    getMentionSuggestions,
    addMention,
    removeMention,
  } = useMentions(groupId)

  const suggestions = getMentionSuggestions(mentionSearchTerm)

  return (
    <div className="relative">
      <Input
        placeholder="Search to mention..."
        value={mentionSearchTerm}
        onChange={(e) => {
          setMentionSearchTerm(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className="text-sm"
      />

      {isOpen && mentionSearchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
          {suggestions.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start h-auto py-2 px-3 rounded-none hover:bg-muted"
              onClick={() => {
                addMention(user)
                onMentionSelect(user.id, user.name)
                setMentionSearchTerm("")
                setIsOpen(false)
              }}
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground ml-1">{user.email}</span>
            </Button>
          ))}
        </div>
      )}

      {mentionedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {mentionedUsers.map((user) => (
            <div
              key={user.id}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
            >
              @{user.name}
              <Button size="icon" variant="ghost" className="h-3 w-3 p-0" onClick={() => removeMention(user.id)}>
                <X className="h-2.5 w-2.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
