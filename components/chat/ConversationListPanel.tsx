"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, MessageCircle, Users, Settings, X, ArrowLeft, Plus, Hash, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useConversations } from "@/hooks/useConversationsNative"
import { useGroupsNative } from "@/hooks/useGroupsNative"
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
  const { conversations, loading: conversationsLoading } = useConversations()
  const { groups, loading: groupsLoading } = useGroupsNative()

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
  }, [currentUser, currentUserId, conversationsLoading])

  useEffect(() => {
    console.log("[v0] Conversations updated:", {
      count: conversations.length,
      loading: conversationsLoading,
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
  }, [conversations, conversationsLoading, currentUserId])

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
    <div className={cn("flex flex-col h-full bg-background/95 backdrop-blur-xl border-r border-border/40", className)}>
      {/* Header */}
      <div className="p-4 space-y-4">
        {/* Logo and Dashboard Button */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group/logo">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover/logo:scale-105 transition-all duration-300">
              <span className="text-white font-black text-xl font-sans leading-none">Q</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-bold text-base tracking-tight group-hover/logo:text-primary transition-colors">Quix Chat</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider opacity-70">Nexus</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2.5 text-[11px] font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/20 transition-all"
            >
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            </Button>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search and Tabs Integration */}
        {(activeSection === "chats" || activeSection === "direct") && (
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm bg-muted/30 border-border/40 focus:border-primary/30 rounded-xl transition-all"
              />
            </div>

            <div className="flex p-1 bg-muted/40 rounded-xl border border-border/40">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab("direct")}
                className={cn(
                  "flex-1 h-8 text-[11px] font-bold rounded-lg transition-all",
                  activeTab === "direct" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                DIRECT
              </Button>
              <Button
                size="sm"
                variant="ghost"
                asChild
                className={cn(
                  "flex-1 h-8 text-[11px] font-bold rounded-lg transition-all",
                  activeTab === "groups" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href="/chat/groups">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  GROUPS
                </Link>
              </Button>
            </div>
          </div>
        )}
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
        <div className="flex gap-2 justify-start pt-3">
          <Button
            size="sm"
            variant="secondary"
            asChild
            className="h-7 text-[10px] font-bold uppercase tracking-wider px-3 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Link href="/chat/groups">
              <Search className="w-3 h-3 mr-1.5" />
              Discover More
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="h-7 text-[10px] font-bold uppercase tracking-wider px-3"
          >
            <Link href="/chat/groups/create">
              <Plus className="w-3 h-3 mr-1.5" />
              New Group
            </Link>
          </Button>
        </div>
      )}

      {/* Content */}

      <div className="flex-1 overflow-y-auto">
        {(activeSection === "chats" || activeSection === "direct") ? (
          activeTab === "direct" ? (
            conversationsLoading ? (
              <div className="flex justify-center p-4 text-sm text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
                <Button variant="link" size="sm" asChild className="mt-2">
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
                      className={cn(
                        "block p-3 rounded-xl hover:bg-muted/50 transition-all duration-200",
                        isActive ? "bg-muted shadow-sm" : "transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src={conv.otherUser?.image || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {conv.otherUser?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {conv.otherUser?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-bold text-sm truncate pr-2 tracking-tight">
                              {conv.otherUser?.name || conv.otherUserId}
                            </h3>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate max-w-[140px] font-medium opacity-80">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 min-w-[20px] px-1 text-[10px] flex items-center justify-center rounded-full"
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
            groupsLoading ? (
              <div className="flex justify-center p-4 text-sm text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Loading groups...
              </div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No groups joined yet.</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/chat/groups">Explore groups</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {groups.map((group) => {
                  const isActive = pathname?.includes(`/chat/groups/${group.id}`)
                  return (
                    <Link
                      key={group.id}
                      href={`/chat/groups/${group.id}`}
                      onClick={isMobile ? onCloseMobile : undefined}
                      className={cn(
                        "block p-3 rounded-xl hover:bg-muted/50 transition-all duration-200",
                        isActive ? "bg-muted shadow-sm" : "transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center border border-border/50">
                          <Hash className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-bold text-sm truncate pr-2 tracking-tight">
                              {group.name}
                            </h3>
                            {group.lastMessage?.timestamp && (
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                                {new Date(group.lastMessage.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate max-w-[140px] font-medium opacity-80">
                              {group.lastMessage?.text || group.description || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
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
      <div className="p-4 border-t border-border/40 bg-muted/10">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-all group/profile cursor-pointer">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform group-hover/profile:scale-105">
              <AvatarImage src={currentUser?.avatar || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {mounted && currentUser?.name ? currentUser.name.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate tracking-tight">
              {mounted && currentUser?.name ? currentUser.name : "User"}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider opacity-60">
              Active Now
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
