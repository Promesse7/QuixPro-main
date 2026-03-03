"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Shortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
  category?: "navigation" | "messaging" | "ui" | "search" | "files" | "collaboration"
  enabled?: boolean
}

interface KeyboardShortcutsConfig {
  enabled: boolean
  showHelp: boolean
  preventDefault: boolean
  global: boolean
}

const defaultConfig: KeyboardShortcutsConfig = {
  enabled: true,
  showHelp: true,
  preventDefault: true,
  global: false
}

export function useKeyboardShortcuts(config: Partial<KeyboardShortcutsConfig> = {}) {
  const shortcutConfig = { ...defaultConfig, ...config }
  const [shortcuts, setShortcuts] = useState<Map<string, Shortcut>>(new Map())
  const [isHelpVisible, setIsHelpVisible] = useState(false)
  const [recentShortcuts, setRecentShortcuts] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalActivations: 0,
    mostUsed: new Map<string, number>(),
    lastUsed: new Map<string, number>()
  })

  const shortcutsRef = useRef(shortcuts)
  const statsRef = useRef(stats)

  // Update refs when state changes
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  // Register default shortcuts
  useEffect(() => {
    const defaultShortcuts: Shortcut[] = [
      // Navigation
      {
        key: "k",
        ctrlKey: true,
        action: () => console.log("Search activated"),
        description: "Search messages",
        category: "search"
      },
      {
        key: "/",
        ctrlKey: true,
        action: () => console.log("AI suggestions"),
        description: "Show AI suggestions",
        category: "collaboration"
      },
      {
        key: "n",
        ctrlKey: true,
        action: () => console.log("New chat"),
        description: "New conversation",
        category: "navigation"
      },
      {
        key: "1",
        ctrlKey: true,
        action: () => console.log("Switch to chat 1"),
        description: "Switch to chat 1",
        category: "navigation"
      },
      {
        key: "2",
        ctrlKey: true,
        action: () => console.log("Switch to chat 2"),
        description: "Switch to chat 2",
        category: "navigation"
      },
      {
        key: "3",
        ctrlKey: true,
        action: () => console.log("Switch to chat 3"),
        description: "Switch to chat 3",
        category: "navigation"
      },

      // Messaging
      {
        key: "Enter",
        ctrlKey: true,
        action: () => console.log("Send message"),
        description: "Send message",
        category: "messaging"
      },
      {
        key: "Enter",
        shiftKey: true,
        action: () => console.log("New line"),
        description: "New line in message",
        category: "messaging"
      },
      {
        key: "r",
        ctrlKey: true,
        action: () => console.log("Reply to message"),
        description: "Reply to selected message",
        category: "messaging"
      },
      {
        key: "t",
        ctrlKey: true,
        action: () => console.log("Start thread"),
        description: "Start thread from message",
        category: "collaboration"
      },
      {
        key: "f",
        ctrlKey: true,
        action: () => console.log("Forward message"),
        description: "Forward selected message",
        category: "messaging"
      },
      {
        key: "e",
        ctrlKey: true,
        action: () => console.log("Edit message"),
        description: "Edit selected message",
        category: "messaging"
      },
      {
        key: "Delete",
        ctrlKey: true,
        action: () => console.log("Delete message"),
        description: "Delete selected message",
        category: "messaging"
      },

      // UI
      {
        key: "b",
        ctrlKey: true,
        action: () => console.log("Toggle sidebar"),
        description: "Toggle sidebar",
        category: "ui"
      },
      {
        key: "m",
        ctrlKey: true,
        action: () => console.log("Toggle dark mode"),
        description: "Toggle dark/light mode",
        category: "ui"
      },
      {
        key: "s",
        ctrlKey: true,
        action: () => console.log("Settings"),
        description: "Open settings",
        category: "ui"
      },
      {
        key: "h",
        ctrlKey: true,
        action: () => setIsHelpVisible(!isHelpVisible),
        description: "Toggle keyboard shortcuts help",
        category: "ui"
      },
      {
        key: "Escape",
        action: () => {
          console.log("Escape pressed")
          setIsHelpVisible(false)
        },
        description: "Close modal/popup",
        category: "ui"
      },

      // Files
      {
        key: "o",
        ctrlKey: true,
        action: () => console.log("Open file"),
        description: "Open file dialog",
        category: "files"
      },
      {
        key: "u",
        ctrlKey: true,
        action: () => console.log("Upload file"),
        description: "Upload file",
        category: "files"
      },

      // Collaboration
      {
        key: "g",
        ctrlKey: true,
        action: () => console.log("Start voice call"),
        description: "Start voice call",
        category: "collaboration"
      },
      {
        key: "v",
        ctrlKey: true,
        action: () => console.log("Start video call"),
        description: "Start video call",
        category: "collaboration"
      },
      {
        key: "i",
        ctrlKey: true,
        action: () => console.log("Invite user"),
        description: "Invite user to chat",
        category: "collaboration"
      },

      // Search
      {
        key: "ArrowUp",
        ctrlKey: true,
        action: () => console.log("Previous message"),
        description: "Go to previous message",
        category: "navigation"
      },
      {
        key: "ArrowDown",
        ctrlKey: true,
        action: () => console.log("Next message"),
        description: "Go to next message",
        category: "navigation"
      },
      {
        key: "Home",
        ctrlKey: true,
        action: () => console.log("First message"),
        description: "Go to first message",
        category: "navigation"
      },
      {
        key: "End",
        ctrlKey: true,
        action: () => console.log("Last message"),
        description: "Go to last message",
        category: "navigation"
      }
    ]

    const shortcutsMap = new Map<string, Shortcut>()
    defaultShortcuts.forEach(shortcut => {
      const key = getShortcutKey(shortcut)
      shortcutsMap.set(key, shortcut)
    })

    setShortcuts(shortcutsMap)
  }, [])

  // Generate unique key for shortcut
  const getShortcutKey = useCallback((shortcut: Shortcut): string => {
    const parts = []
    if (shortcut.ctrlKey) parts.push("ctrl")
    if (shortcut.shiftKey) parts.push("shift")
    if (shortcut.altKey) parts.push("alt")
    if (shortcut.metaKey) parts.push("meta")
    parts.push(shortcut.key.toLowerCase())
    return parts.join("+")
  }, [])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!shortcutConfig.enabled) return

    const pressedKey = event.key.toLowerCase()
    const keyParts = []

    if (event.ctrlKey) keyParts.push("ctrl")
    if (event.shiftKey) keyParts.push("shift")
    if (event.altKey) keyParts.push("alt")
    if (event.metaKey) keyParts.push("meta")
    keyParts.push(pressedKey)

    const key = keyParts.join("+")
    const shortcut = shortcutsRef.current.get(key)

    if (shortcut && shortcut.enabled !== false) {
      if (shortcutConfig.preventDefault) {
        event.preventDefault()
      }

      // Execute action
      try {
        shortcut.action()

        // Update stats
        const currentStats = statsRef.current
        const newTotal = currentStats.totalActivations + 1
        const newMostUsed = new Map(currentStats.mostUsed)
        const newLastUsed = new Map(currentStats.lastUsed)

        newMostUsed.set(key, (newMostUsed.get(key) || 0) + 1)
        newLastUsed.set(key, Date.now())

        setStats({
          totalActivations: newTotal,
          mostUsed: newMostUsed,
          lastUsed: newLastUsed
        })

        // Update recent shortcuts
        setRecentShortcuts(prev => {
          const updated = [key, ...prev.filter(k => k !== key)].slice(0, 5)
          return updated
        })

      } catch (error) {
        console.error("Error executing shortcut action:", error)
      }
    }
  }, [shortcutConfig])

  // Add event listener
  useEffect(() => {
    const target = shortcutConfig.global ? document : window
    target.addEventListener("keydown", handleKeyDown as EventListener)

    return () => {
      target.removeEventListener("keydown", handleKeyDown as EventListener)
    }
  }, [handleKeyDown, shortcutConfig.global])

  // Register new shortcut
  const registerShortcut = useCallback((shortcut: Shortcut) => {
    const key = getShortcutKey(shortcut)
    setShortcuts(prev => new Map(prev.set(key, shortcut)))
  }, [getShortcutKey])

  // Unregister shortcut
  const unregisterShortcut = useCallback((key: string, ctrlKey?: boolean, shiftKey?: boolean, altKey?: boolean, metaKey?: boolean) => {
    const parts = []
    if (ctrlKey) parts.push("ctrl")
    if (shiftKey) parts.push("shift")
    if (altKey) parts.push("alt")
    if (metaKey) parts.push("meta")
    parts.push(key.toLowerCase())

    const shortcutKey = parts.join("+")
    setShortcuts(prev => {
      const newMap = new Map(prev)
      newMap.delete(shortcutKey)
      return newMap
    })
  }, [])

  // Enable/disable shortcut
  const toggleShortcut = useCallback((key: string, enabled: boolean) => {
    setShortcuts(prev => {
      const newMap = new Map(prev)
      const shortcut = newMap.get(key)
      if (shortcut) {
        newMap.set(key, { ...shortcut, enabled })
      }
      return newMap
    })
  }, [])

  // Get shortcuts by category
  const getShortcutsByCategory = useCallback((category: string): Shortcut[] => {
    return Array.from(shortcuts.values()).filter(s => s.category === category)
  }, [shortcuts])

  // Get shortcut statistics
  const getShortcutStats = useCallback(() => {
    const mostUsedArray = Array.from(stats.mostUsed.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([key, count]) => ({
        key,
        count,
        shortcut: shortcuts.get(key)
      }))

    const recentlyUsed = Array.from(stats.lastUsed.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key, timestamp]) => ({
        key,
        timestamp,
        shortcut: shortcuts.get(key)
      }))

    return {
      ...stats,
      mostUsed: mostUsedArray,
      recentlyUsed,
      totalShortcuts: shortcuts.size,
      enabledShortcuts: Array.from(shortcuts.values()).filter(s => s.enabled !== false).length
    }
  }, [stats, shortcuts])

  // Export/import shortcuts
  const exportShortcuts = useCallback(() => {
    const shortcutsArray = Array.from(shortcuts.entries()).map(([shortcutKey, shortcut]) => ({
      key: shortcutKey,
      ctrlKey: shortcut.ctrlKey,
      shiftKey: shortcut.shiftKey,
      altKey: shortcut.altKey,
      metaKey: shortcut.metaKey,
      description: shortcut.description,
      category: shortcut.category,
      enabled: shortcut.enabled,
      action: shortcut.action.toString()
    }))
    return JSON.stringify(shortcutsArray, null, 2)
  }, [shortcuts])

  const importShortcuts = useCallback((shortcutsData: string) => {
    try {
      const importedShortcuts = JSON.parse(shortcutsData)
      const newMap = new Map<string, Shortcut>()

      importedShortcuts.forEach((item: any) => {
        // Note: action functions would need to be reconstructed
        newMap.set(item.key, {
          ...item,
          action: () => console.log("Imported shortcut action")
        })
      })

      setShortcuts(newMap)
      return true
    } catch (error) {
      console.error("Failed to import shortcuts:", error)
      return false
    }
  }, [])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    // This would re-register all default shortcuts
    window.location.reload()
  }, [])

  return {
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    toggleShortcut,
    getShortcutsByCategory,
    getShortcutStats,
    exportShortcuts,
    importShortcuts,
    resetToDefaults,
    isHelpVisible,
    setIsHelpVisible,
    recentShortcuts,
    config: shortcutConfig
  }
}
