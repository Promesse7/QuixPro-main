"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, MessageCircle, Users, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useConversations } from "@/hooks/useConversationsNative"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentUserId } from "@/lib/userUtils"
import { cn } from "@/lib/utils"

interface ConversationListPanelProps {
  className?: string
  activeId?: string
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function ConversationListPanel({
  className = "",
  activeId,
  isMobile = false,
  onCloseMobile,
}: ConversationListPanelProps) {
  const pathname = usePathname()
  const currentUser = getCurrentUser()
  const currentUserId = getCurrentUserId()
  const { conversations, loading } = useConversations()

  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "online" | "unread">("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("[v0] ConversationListPanel initialized:", {
      currentUser: {
        name: currentUser?.name,
        email: currentUser?.email,
      },
      currentUserId,
      timestamp: new Date().toISOString(),
    })
  }, [currentUser, currentUserId])

  useEffect(() => {
    console.log("[v0] Conversations updated:", {
      count: conversations.length,
      loading,
      currentUserId,
      conversations: conversations.map((c) => ({
        _id: c._id,
        otherUserId: c.otherUserId,
        otherUserEmail: c.otherUserEmail,
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCount,
      })),
      timestamp: new Date().toISOString(),
    })
  }, [conversations, loading, currentUserId])

  const getActiveSection = () => {
    if (!pathname) return "chats"
    if (pathname === "/chat") return "chats"
    if (pathname === "/chat/discover") return "discover"
    if (pathname.startsWith("/chat/groups")) return "groups"
    if (pathname.startsWith("/chat/direct")) return "direct"
    return "chats"
  }

  const activeSection = getActiveSection()

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.otherUser?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterType === "online") return matchesSearch && conv.otherUser?.isOnline
    if (filterType === "unread") return matchesSearch && conv.unreadCount > 0
    return matchesSearch
  })

  return (
    <div className={cn("flex flex-col h-full bg-background border-r border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <span className="font-semibold text-lg">Quix Chat</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Search and Tabs */}
        {(activeSection === "chats" || activeSection === "direct") && (
          <>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 bottom-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>

            <div className="flex mt-3 gap-2">
              <Button
                size="sm"
                variant={activeTab === "direct" ? "default" : "ghost"}
                onClick={() => setActiveTab("direct")}
                className="flex-1 h-8 text-xs"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Direct
              </Button>
              <Button
                size="sm"
                variant={activeTab === "groups" ? "default" : "ghost"}
                onClick={() => setActiveTab("groups")}
                className="flex-1 h-8 text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Groups
              </Button>
            </div>

            {/* Filters */}
            {activeTab === "direct" ? (
              <div className="flex gap-2 justify-start overflow-x-auto pb-1 scrollbar-hide mt-3">
                <Button
                  size="sm"
                  variant={filterType === "all" ? "secondary" : "ghost"}
                  className="h-7 text-xs px-2"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "online" ? "secondary" : "ghost"}
                  className="h-7 text-xs px-2"
                  onClick={() => setFilterType("online")}
                >
                  Online
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "unread" ? "secondary" : "ghost"}
                  className="h-7 text-xs px-2"
                  onClick={() => setFilterType("unread")}
                >
                  Unread
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 justify-start overflow-x-auto pb-1 scrollbar-hide mt-3">
                {/* Placeholder for group filters if needed in the future */}
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "chats" || activeSection === "direct" ? (
          activeTab === "direct" ? (
            loading ? (
              <div className="flex justify-center p-4 text-sm text-muted-foreground">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="mt-2"
                  onClick={isMobile ? onCloseMobile : undefined}
                >
                  <Link href="/chat/discover">Find people</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conv) => {
                  const isActive = activeId === conv.otherUserId
                  return (
                    <Link
                      key={conv._id}
                      href={`/chat/direct/${encodeURIComponent(conv.otherUserId)}`}
                      onClick={isMobile ? onCloseMobile : undefined}
                      className={`block p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 ${
                        isActive ? "bg-muted shadow-sm" : "transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={conv.otherUser?.image || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {conv.otherUser?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {conv.otherUser?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-medium text-sm truncate pr-2">
                              {conv.otherUser?.name || conv.otherUserId}
                            </h3>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{conv.lastMessage}</p>
                            {conv.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 min-w-[20px] px-1 text-[10px] flex items-center justify-center"
                              >
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Navigate to see content</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Navigate to see content</p>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {mounted && currentUser?.name ? currentUser.name.charAt(0) : "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{mounted && currentUser?.name ? currentUser.name : "User"}</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
