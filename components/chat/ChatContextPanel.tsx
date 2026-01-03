"use client"

import React, { useState, useEffect } from 'react'
import { X, Users, FileText, Settings, Info, BookOpen, Link as LinkIcon, Image, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useChatContext } from '@/components/chat/ThreePanelChatLayout'
import { getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

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
    role: 'teacher' | 'student'
    isOnline?: boolean
  }>
  sharedFiles?: Array<{
    _id: string
    name: string
    type: 'image' | 'file' | 'link'
    url: string
    uploadedBy: string
    uploadedAt: string
  }>
}

interface UserInfo {
  _id: string
  name: string
  email: string
  role: 'student' | 'teacher'
  school?: string
  level?: string
  lastActive?: string
  sharedFiles?: Array<{
    _id: string
    name: string
    type: 'image' | 'file'
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
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'resources' | 'actions'>('info')

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
      if (activeChatType === 'group') {
        // Load group info from MongoDB API
        const response = await fetch(`/api/groups/${activeChatId}`)
        if (response.ok) {
          const data = await response.json()
          setGroupInfo(data.group)
        } else {
          const errorText = await response.text()
          setError(`Failed to load group: ${errorText}`)
          console.error('Failed to load group info:', response.statusText)
        }
      } else if (activeChatType === 'direct') {
        // Load user info from MongoDB API
        const response = await fetch(`/api/users/${activeChatId}`)
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data.user)
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          if (response.status === 404 && errorData.availableUsers) {
            // Try to auto-sync the user if they don't exist
            const currentUser = getCurrentUser()
            if (currentUser && activeChatId === currentUser.id) {
              try {
                console.log('[AUTO-SYNC] Attempting to sync user to MongoDB...')
                const syncResponse = await fetch('/api/sync-user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: currentUser.name,
                    email: currentUser.email.replace(/_/g, '.').replace('gmail.com', '@gmail.com'),
                    role: currentUser.role,
                    level: currentUser.level || undefined
                  })
                })

                if (syncResponse.ok) {
                  console.log('[AUTO-SYNC] User synced successfully, retrying profile load...')
                  // Retry loading the user profile
                  const retryResponse = await fetch(`/api/users/${activeChatId}`)
                  if (retryResponse.ok) {
                    const retryData = await retryResponse.json()
                    setUserInfo(retryData.user)
                    return // Success, exit early
                  }
                }
              } catch (syncError) {
                console.error('[AUTO-SYNC] Failed to sync user:', syncError)
              }
            }

            setError(`User not found. Available users: ${errorData.availableUsers.map((u: any) => u.name).join(', ')}`)
          } else {
            setError(`Failed to load user: ${errorData.error || response.statusText}`)
          }
          console.error('Failed to load user info:', response.statusText, errorData)
        }
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Failed to load context data:', error)
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
          <p className="text-sm font-medium text-center balance">Select a conversation to reveal context & resources</p>
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
          <p className="text-sm font-bold text-foreground/80 mb-2">Sync Failed</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-8 max-w-[200px]">{error}</p>
          <Button
            onClick={loadContextData}
            size="sm"
            className="rounded-xl h-9 px-6 font-semibold shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  // Loading state - skeleton instead of spinner
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background border-l border-border/50">
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Loading</h2>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-primary/20 rounded-full" />
            <div className="absolute top-0 w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Syncing</p>
        </div>
      </div>
    )
  }

  // Group Chat Context
  if (activeChatType === 'group' && groupInfo) {
    return (
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50")}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/20 sticky top-0 z-10">
          <h2 className="font-bold text-sm leading-none truncate max-w-[150px]">{groupInfo.name}</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg translate-x-3">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 gap-1 bg-muted/20 border-b border-border/50">
          {[
            { id: 'info', label: 'Info', icon: Info },
            { id: 'members', label: 'People', icon: Users },
            { id: 'resources', label: 'Files', icon: FileText },
            { id: 'actions', label: 'Tools', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "flex-1 h-8 text-[11px] font-bold rounded-lg transition-all px-0",
                activeTab === id ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {activeTab === 'info' && <GroupInfoSection group={groupInfo} />}
            {activeTab === 'members' && <MembersListSection members={groupInfo.members || []} />}
            {activeTab === 'resources' && <SharedResourcesSection resources={groupInfo.sharedFiles || []} />}
            {activeTab === 'actions' && <GroupActionsSection />}
          </div>
        </div>
      </div>
    )
  }

  // Direct Chat Context
  if (activeChatType === 'direct' && userInfo) {
    return (
      <div className="flex flex-col h-full bg-background border-l border-border/50">
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/20 sticky top-0 z-10">
          <h2 className="font-bold text-sm leading-none truncate max-w-[150px]">{userInfo.name}</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg translate-x-3">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 gap-1 bg-muted/20 border-b border-border/50">
          {[
            { id: 'info', label: 'Profile', icon: Info },
            { id: 'resources', label: 'Media', icon: FileText },
            { id: 'actions', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "flex-1 h-8 text-[11px] font-bold rounded-lg transition-all px-0",
                activeTab === id ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {activeTab === 'info' && <UserProfileSection user={userInfo} />}
            {activeTab === 'resources' && <SharedResourcesSection resources={userInfo.sharedFiles || []} />}
            {activeTab === 'actions' && <UserActionsSection />}
          </div>
        </div>

        {/* Scrollable content with all sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* 1. Chat Identity Header - Always visible at top */}
          <ChatIdentityHeader
            chatType={chatType}
            groupMeta={groupMeta}
            userMeta={null}
            isTeacher={isTeacher}
            isGroupAdmin={isGroupAdmin}
            onMute={handleMute}
            onLeave={handleLeaveGroup}
            onEdit={handleEditGroup}
            isMuted={isMuted}
            className="border-b border-border/40"
          />

          {/* 2. Members Section */}
          <MembersSection
            members={members}
            isGroupAdmin={isGroupAdmin}
            currentUserId={currentUserId}
            onMemberClick={handleMemberClick}
            onRemoveMember={isGroupAdmin ? handleRemoveMember : undefined}
          />

          {/* 3. Pinned Messages Section */}
          <PinnedMessagesSection
            pins={pins}
            isGroupAdmin={isGroupAdmin}
            onJumpToMessage={handleJumpToMessage}
            onUnpin={isGroupAdmin ? handleUnpin : undefined}
          />

          {/* 4. Shared Resources Hub */}
          <SharedResourcesHub
            resources={resources}
            onDownload={handleDownloadResource}
            onOpenExternal={handleOpenResource}
          />

          {/* 5. Learning Tools Section */}
          <LearningToolsSection
            quizzes={relatedQuizzes}
            isTeacher={isTeacher}
            groupSubject={groupMeta.subject}
            onStartQuiz={handleStartQuiz}
            onCreateQuiz={handleCreateQuiz}
            onOpenNotes={handleOpenNotes}
          />

          {/* 6. Activity Section */}
          <ActivitySection
            activity={activity}
          />

          {/* 7. Group Rules Section */}
          <GroupRulesSection
            rules={rules}
            isGroupAdmin={isGroupAdmin}
            onEditRules={handleEditRules}
          />
        </div>
      </div>
    )
  }

  return null
}

// Group Info Section Component
function GroupInfoSection({ group }: { group: GroupInfo }) {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Subject Area</h3>
        </div>
        <div className="pl-1">
          <p className="text-sm font-semibold tracking-tight leading-relaxed">{group.subject || 'General Knowledge'}</p>
        </div>
      </div>

      {group.description && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center ring-1 ring-orange-500/20">
              <Info className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Description</h3>
          </div>
          <div className="pl-1">
            <p className="text-sm text-muted-foreground leading-relaxed balance">{group.description}</p>
          </div>
        </div>
      )}

      {group.teacher && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mentor / Teacher</h3>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-border/40 transition-all hover:bg-muted/50">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {group.teacher.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight truncate">{group.teacher.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-medium">{group.teacher.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Members List Section Component
function MembersListSection({ members }: { members: GroupInfo['members'] }) {
  if (!members || members.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">Members</h3>
          <Badge variant="secondary" className="text-xs">
            0
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">No members found</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Members</h3>
        <Badge variant="secondary" className="text-xs">
          {members.length}
        </Badge>
      </div>

      {members.map((member) => (
        <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {member.isOnline && (
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
          </div>
          {member.role === 'teacher' && (
            <Badge variant="outline" className="text-xs">
              Teacher
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

// Shared Resources Section Component
function SharedResourcesSection({ resources }: { resources: any[] }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image
      case 'link': return LinkIcon
      default: return File
    }
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Shared Files</h3>
        <Badge variant="secondary" className="text-xs">
          {resources.length}
        </Badge>
      </div>

      {resources.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No shared files yet</p>
      ) : (
        resources.map((resource) => {
          const Icon = getFileIcon(resource.type)
          return (
            <div key={resource._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{resource.name}</p>
                <p className="text-xs text-muted-foreground">
                  {resource.uploadedBy} • {resource.uploadedAt}
                </p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// Group Actions Section Component
function GroupActionsSection() {
  return (
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start">
        Mute Notifications
      </Button>
      <Button variant="outline" className="w-full justify-start">
        View Group Rules
      </Button>
      <Button variant="outline" className="w-full justify-start">
        Create Group Quiz
      </Button>
      <Separator />
      <Button variant="destructive" className="w-full justify-start">
        Leave Group
      </Button>
    </div>
  )
}

// User Profile Section Component
function UserProfileSection({ user }: { user: UserInfo }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Email</h4>
          <p className="text-sm">{user.email}</p>
        </div>

        {user.school && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">School</h4>
            <p className="text-sm">{user.school}</p>
          </div>
        )}

        {user.level && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Level</h4>
            <p className="text-sm">{user.level}</p>
          </div>
        )}

        {user.lastActive && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Last Active</h4>
            <p className="text-sm">{user.lastActive}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// User Actions Section Component
function UserActionsSection() {
  return (
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start">
        Mute Notifications
      </Button>
      <Button variant="outline" className="w-full justify-start">
        View Shared Media
      </Button>
      <Separator />
      <Button variant="outline" className="w-full justify-start text-destructive">
        Block User
      </Button>
      <Button variant="outline" className="w-full justify-start text-destructive">
        Report User
      </Button>
    </div>
  )
}
