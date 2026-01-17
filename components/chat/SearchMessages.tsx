"use client"

import { useMessageSearch } from "@/hooks/useMessageSearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import type { Message } from "@/models/Chat"

interface SearchMessagesProps {
  conversationId: string
  onMessageSelect: (message: Message) => void
}

export function SearchMessages({ conversationId, onMessageSelect }: SearchMessagesProps) {
  const { searchResults, isSearching, searchQuery, search, clearSearch } = useMessageSearch()

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => search(conversationId, e.target.value)}
          className="pl-10 text-sm"
        />
        {searchQuery && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isSearching && <div className="mt-2 text-center text-sm text-muted-foreground">Searching...</div>}

      {searchResults.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto border border-border rounded-lg">
          {searchResults.map((message) => (
            <Button
              key={message._id?.toString()}
              variant="ghost"
              className="w-full justify-start h-auto py-2 px-3 rounded-none hover:bg-muted font-normal"
              onClick={() => {
                onMessageSelect(message)
                clearSearch()
              }}
            >
              <div className="flex flex-col items-start w-full">
                <span className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</span>
                <span className="text-sm truncate">{message.content}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
