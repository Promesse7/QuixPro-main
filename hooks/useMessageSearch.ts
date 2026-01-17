"use client"

import { useState, useCallback } from "react"
import type { Message } from "@/models/Chat"

export function useMessageSearch() {
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const search = useCallback(async (conversationId: string, query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setSearchQuery(query)

    try {
      const response = await fetch("/api/messages/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, query, limit: 50 }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.messages || [])
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchQuery("")
  }, [])

  return { searchResults, isSearching, searchQuery, search, clearSearch }
}
