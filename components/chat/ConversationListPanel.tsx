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
    <div className={cn("flex flex-col h-full bg-background border-r border-border shadow-2xl md:shadow-none", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border space-y-6">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-black text-xl">Q</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none italic">Quix Chat</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Classroom Connect</span>
            </div>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="rounded-full hover:bg-muted">
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Search and Tabs */}
        {(activeSection === "chats" || activeSection === "direct") && (
          <div className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-11 text-sm bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex p-1 bg-muted/50 rounded-xl gap-1">
              <Button
                size="sm"
                variant={activeTab === "direct" ? "default" : "ghost"}
                onClick={() => setActiveTab("direct")}
                className={cn(
                  "flex-1 h-9 text-xs font-bold rounded-lg transition-all",
                  activeTab === "direct" ? "shadow-md" : "hover:bg-background/50"
                )}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-2" />
                Direct
              </Button>
              <Button
                size="sm"
                variant={activeTab === "groups" ? "default" : "ghost"}
                onClick={() => setActiveTab("groups")}
                className={cn(
                  "flex-1 h-9 text-xs font-bold rounded-lg transition-all",
                  activeTab === "groups" ? "shadow-md" : "hover:bg-background/50"
                )}
              >
                <Users className="w-3.5 h-3.5 mr-2" />
                Groups
              </Button>
            </div>

            {/* Filters */}
            {activeTab === "direct" && (
              <div className="flex gap-2 justify-start overflow-x-auto pb-1 scrollbar-hide">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'online', label: 'Online' },
                  { id: 'unread', label: 'Unread' }
                ].map((f) => (
                  <Button
                    key={f.id}
                    size="sm"
                    variant={filterType === f.id ? "secondary" : "ghost"}
                    className={cn(
                      "h-8 text-xs px-4 rounded-full font-semibold border border-transparent",
                      filterType === f.id ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground"
                    )}
                    onClick={() => setFilterType(f.id as any)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "chats" || activeSection === "direct" ? (
          activeTab === "direct" ? (
            loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Loading chats...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="font-bold text-lg">No chats found</p>
                  <p className="text-sm text-muted-foreground mt-1 px-4">Start a conversation with your classmates!</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                  onClick={isMobile ? onCloseMobile : undefined}
                >
                  <Link href="/chat/discover">Find people</Link>
                </Button>
              </div>
            ) : (
              <div className="px-3 py-4 space-y-1">
                {filteredConversations.map((conv) => {
                  const isActive = activeId === conv.otherUserId
                  return (
                    <Link
                      key={conv._id}
                      href={`/chat/direct/${encodeURIComponent(conv.otherUserId)}`}
                      onClick={isMobile ? onCloseMobile : undefined}
                      className={cn(
                        "group block p-4 rounded-2xl transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02] z-10"
                          : "hover:bg-muted/50 transparent"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className={cn(
                            "h-12 w-12 border-2 transition-transform duration-300 group-hover:scale-105",
                            isActive ? "border-primary-foreground/30" : "border-background shadow-sm"
                          )}>
                            <AvatarImage src={conv.otherUser?.image || "/placeholder.svg"} />
                            <AvatarFallback className={cn(
                              isActive ? "bg-primary-foreground/10 text-primary-foreground" : "bg-primary/10 text-primary"
                            )}>
                              {conv.otherUser?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {conv.otherUser?.isOnline && (
                            <div className={cn(
                              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2",
                              isActive ? "bg-green-400 border-primary" : "bg-green-500 border-background"
                            )} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className={cn(
                              "font-bold text-sm truncate",
                              isActive ? "text-primary-foreground" : "text-foreground"
                            )}>
                              {conv.otherUser?.name || conv.otherUserId}
                            </h3>
                            <span className={cn(
                              "text-[10px] font-medium whitespace-nowrap",
                              isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn(
                              "text-xs truncate font-medium",
                              isActive ? "text-primary-foreground/80 font-normal" : "text-muted-foreground"
                            )}>
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className={cn(
                                  "h-5 min-w-[20px] px-1.5 text-[10px] font-black border-2",
                                  isActive ? "bg-primary-foreground text-primary border-primary" : "border-background"
                                )}
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
            <div className="flex items-center justify-center h-full text-muted-foreground p-10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10 opacity-30" />
                </div>
                <p className="font-bold">Group chats coming soon!</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground p-10">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 opacity-30" />
              </div>
              <p className="font-bold">Select a section to view</p>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-background shadow-sm border border-border/50 group transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/5 group-hover:scale-105 transition-transform">
            <span className="text-base font-black text-primary">
              {mounted && currentUser?.name ? currentUser.name.charAt(0) : "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{mounted && currentUser?.name ? currentUser.name : "User"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-xl hover:bg-muted">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
