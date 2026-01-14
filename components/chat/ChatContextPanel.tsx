"use client"

import { useState, useEffect } from "react"
import { X, Users, FileText, Settings, Info, LinkIcon, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useChatContext } from "@/components/chat/ThreePanelChatLayout"
import { getCurrentUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface ChatContextPanelProps {
  className?: string
  isMobile?: boolean
  onCloseMobile?: () => void
}

interface GroupInfo {
  _id: string
  name: string
  subject?: string
  description?: string
  teacher?: {
    _id: string
    name: string
    email: string
  }
  members?: Array<{
    _id: string
    name: string
    email: string
    role: "teacher" | "student"
    isOnline?: boolean
  }>
  sharedFiles?: Array<{
    _id: string
    name: string
    type: "image" | "file" | "link"
    url: string
    uploadedBy: string
    uploadedAt: string
  }>
}

interface UserInfo {
  _id: string
  name: string
  email: string
  role: "student" | "teacher"
  school?: string
  level?: string
  lastActive?: string
  sharedFiles?: Array<{
    _id: string
    name: string
    type: "image" | "file"
    url: string
    uploadedAt: string
  }>
}

export function ChatContextPanel({ className = "", isMobile = false, onCloseMobile }: ChatContextPanelProps) {
  const { activeChatId, activeChatType } = useChatContext()
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"info" | "members" | "resources" | "actions">("info")

  const currentUser = getCurrentUser()

  // Load context data when active chat changes
  useEffect(() => {
    if (!activeChatId || !activeChatType) {
      setGroupInfo(null)
      setUserInfo(null)
      setError(null)
      return
    }

    loadContextData()
  }, [activeChatId, activeChatType])

  const loadContextData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeChatType === "group") {
        // Load group info from MongoDB API
        const response = await fetch(`/api/groups/${activeChatId}`)
        if (response.ok) {
          const data = await response.json()
          setGroupInfo(data.group)
        } else {
          const errorText = await response.text()
          setError(`Failed to load group: ${errorText}`)
          console.error("Failed to load group info:", response.statusText)
        }
      } else if (activeChatType === "direct") {
        // Load user info from MongoDB API
        const response = await fetch(`/api/users/${activeChatId}`)
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data.user)
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          if (response.status === 404 && errorData.availableUsers) {
            // Try to auto-sync the user if they don't exist
            const currentUser = getCurrentUser()
            if (currentUser && activeChatId === currentUser.id) {
              try {
                console.log("[AUTO-SYNC] Attempting to sync user to MongoDB...")
                const syncResponse = await fetch("/api/sync-user", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: currentUser.name,
                    email: currentUser.email.replace(/_/g, ".").replace("gmail.com", "@gmail.com"),
                    role: currentUser.role,
                    level: currentUser.level || undefined,
                  }),
                })

                if (syncResponse.ok) {
                  console.log("[AUTO-SYNC] User synced successfully, retrying profile load...")
                  // Retry loading the user profile
                  const retryResponse = await fetch(`/api/users/${activeChatId}`)
                  if (retryResponse.ok) {
                    const retryData = await retryResponse.json()
                    setUserInfo(retryData.user)
                    return // Success, exit early
                  }
                }
              } catch (syncError) {
                console.error("[AUTO-SYNC] Failed to sync user:", syncError)
              }
            }

            setError(`User not found. Available users: ${errorData.availableUsers.map((u: any) => u.name).join(", ")}`)
          } else {
            setError(`Failed to load user: ${errorData.error || response.statusText}`)
          }
          console.error("Failed to load user info:", response.statusText, errorData)
        }
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Failed to load context data:", error)
    } finally {
      setLoading(false)
    }
  }

  // No active chat - show empty state
  if (!activeChatId || !activeChatType) {
    return (
      <div className={cn("flex w-full flex-col h-full bg-white border-l border-gray-200", className)}>
        <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="font-semibold text-sm text-gray-900">Context</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-center text-gray-600">Select a conversation to view details</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex flex-col h-full bg-white border-l border-gray-200", className)}>
        <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="font-semibold text-sm text-gray-900">Error</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <X className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Failed to Load</p>
          <p className="text-xs text-gray-500 text-center mb-6 max-w-[200px]">{error}</p>
          <Button onClick={loadContextData} size="sm" className="h-8 px-4 text-xs font-medium">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="h-16 px-6 border-b border-gray-200 flex items-center bg-white">
          <h2 className="font-semibold text-sm text-gray-900">Loading</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-gray-900 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500">Loading details...</p>
        </div>
      </div>
    )
  }

  // Group Chat Context
  if (activeChatType === "group" && groupInfo) {
    return (
      <div className={cn("flex flex-col h-full bg-white border-l border-gray-200")}>
        <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-sm text-gray-900 truncate">{groupInfo.name}</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-gray-200 bg-white">
          {[
            { id: "info", label: "Info", icon: Info },
            { id: "members", label: "People", icon: Users },
            { id: "resources", label: "Files", icon: FileText },
            { id: "actions", label: "Tools", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "h-8 text-xs font-medium rounded-lg transition-all flex-1",
                activeTab === id ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Icon className="w-3.5 h-3.5 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "info" && <GroupInfoSection group={groupInfo} />}
          {activeTab === "members" && <MembersListSection members={groupInfo.members || []} />}
          {activeTab === "resources" && <SharedResourcesSection resources={groupInfo.sharedFiles || []} />}
          {activeTab === "actions" && <GroupActionsSection />}
        </div>
      </div>
    )
  }

  // Direct Chat Context
  if (activeChatType === "direct" && userInfo) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-sm text-gray-900 truncate">{userInfo.name}</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-gray-200 bg-white">
          {[
            { id: "info", label: "Profile", icon: Info },
            { id: "resources", label: "Media", icon: FileText },
            { id: "actions", label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "h-8 text-xs font-medium rounded-lg transition-all flex-1",
                activeTab === id ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Icon className="w-3.5 h-3.5 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "info" && <UserProfileSection user={userInfo} />}
          {activeTab === "resources" && <SharedResourcesSection resources={userInfo.sharedFiles || []} />}
          {activeTab === "actions" && <UserActionsSection />}
        </div>
      </div>
    )
  }

  return null
}

function GroupInfoSection({ group }: { group: GroupInfo }) {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</p>
        <p className="text-sm text-gray-900 font-medium">{group.subject || "General"}</p>
      </div>

      {group.description && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
        </div>
      )}

      {group.teacher && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Instructor</p>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-200 text-gray-900 text-sm font-semibold">
                {group.teacher.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{group.teacher.name}</p>
              <p className="text-xs text-gray-500 truncate">{group.teacher.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MembersListSection({ members }: { members: GroupInfo["members"] }) {
  if (!members || members.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">No members found</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      {members.map((member) => (
        <div key={member._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gray-200 text-gray-900 text-xs font-semibold">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {member.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{member.name}</p>
            <p className="text-xs text-gray-500 capitalize">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SharedResourcesSection({ resources }: { resources: any[] }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon
      case "link":
        return LinkIcon
      default:
        return File
    }
  }

  return (
    <div className="p-4 space-y-2">
      {resources.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">No files shared yet</p>
      ) : (
        resources.map((resource) => {
          const Icon = getFileIcon(resource.type)
          return (
            <div
              key={resource._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{resource.name}</p>
                <p className="text-xs text-gray-500">{resource.uploadedBy || "Unknown"}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function GroupActionsSection() {
  return (
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start h-9 text-sm bg-transparent">
        Mute Notifications
      </Button>
      <Button variant="outline" className="w-full justify-start h-9 text-sm bg-transparent">
        View Rules
      </Button>
      <Button variant="outline" className="w-full justify-start h-9 text-sm bg-transparent">
        Create Quiz
      </Button>
      <Separator className="my-2" />
      <Button variant="destructive" className="w-full justify-start h-9 text-sm">
        Leave Group
      </Button>
    </div>
  )
}

function UserProfileSection({ user }: { user: UserInfo }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center space-y-3 pb-4 border-b border-gray-200">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-gray-200 text-gray-900 text-lg font-bold">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        {user.email && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
            <p className="text-sm text-gray-900">{user.email}</p>
          </div>
        )}

        {user.level && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</p>
            <p className="text-sm text-gray-900 font-medium">{user.level}</p>
          </div>
        )}

        {user.lastActive && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</p>
            <p className="text-sm text-gray-900">{user.lastActive}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function UserActionsSection() {
  return (
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start h-9 text-sm bg-transparent">
        Block User
      </Button>
      <Button variant="outline" className="w-full justify-start h-9 text-sm bg-transparent">
        Report
      </Button>
      <Separator className="my-2" />
      <Button variant="destructive" className="w-full justify-start h-9 text-sm">
        Clear Chat
      </Button>
    </div>
  )
}
