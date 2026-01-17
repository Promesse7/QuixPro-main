"use client"

import { useState, useCallback, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

export function useMentions(groupId: string) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [mentionedUsers, setMentionedUsers] = useState<User[]>([])
  const [mentionSearchTerm, setMentionSearchTerm] = useState("")

  useEffect(() => {
    // Fetch group members for mentions
    const fetchGroupMembers = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/members`)
        if (response.ok) {
          const data = await response.json()
          setAvailableUsers(data.members || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching group members:", error)
      }
    }

    if (groupId) {
      fetchGroupMembers()
    }
  }, [groupId])

  const getMentionSuggestions = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) return []
      return availableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    },
    [availableUsers],
  )

  const addMention = useCallback((user: User) => {
    setMentionedUsers((prev) => {
      if (prev.find((u) => u.id === user.id)) return prev
      return [...prev, user]
    })
  }, [])

  const removeMention = useCallback((userId: string) => {
    setMentionedUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  return {
    availableUsers,
    mentionedUsers,
    mentionSearchTerm,
    setMentionSearchTerm,
    getMentionSuggestions,
    addMention,
    removeMention,
  }
}
