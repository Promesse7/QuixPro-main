"use client"

import React, { useState } from 'react'
import { X, Info, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatContext } from '@/components/chat/ThreePanelChatLayout'
import { useChatContextData } from '@/hooks/useChatContextData'
import { cn } from '@/lib/utils'

// Import all section components
import {
  ChatIdentityHeader,
  MembersSection,
  PinnedMessagesSection,
  SharedResourcesHub,
  LearningToolsSection,
  ActivitySection,
  GroupRulesSection
} from './context'

interface ChatContextPanelProps {
  className?: string
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function ChatContextPanel({
  className = "",
  isMobile = false,
  onCloseMobile
}: ChatContextPanelProps) {
  const { activeChatId, activeChatType } = useChatContext()
  const [isMuted, setIsMuted] = useState(false)

  // Use the centralized context data hook
  const {
    chatId,
    chatType,
    groupMeta,
    userMeta,
    members,
    pins,
    resources,
    relatedQuizzes,
    activity,
    rules,
    isLoading,
    error,
    membersCount,
    pinsCount,
    resourcesCount,
    refresh,
    isTeacher,
    isGroupAdmin,
    currentUserId
  } = useChatContextData(activeChatId, activeChatType)

  // Action handlers
  const handleMute = () => {
    setIsMuted(!isMuted)
    // TODO: Persist mute setting
  }

  const handleLeaveGroup = () => {
    // TODO: Implement leave group
    console.log('Leave group:', chatId)
  }

  const handleEditGroup = () => {
    // TODO: Implement edit group modal
    console.log('Edit group:', chatId)
  }

  const handleMemberClick = (member: any) => {
    // TODO: Open member profile preview
    console.log('View member:', member._id)
  }

  const handleRemoveMember = (member: any) => {
    // TODO: Implement remove member
    console.log('Remove member:', member._id)
  }

  const handleJumpToMessage = (pin: any) => {
    // TODO: Scroll to message in chat
    console.log('Jump to message:', pin._id)
  }

  const handleUnpin = (pin: any) => {
    // TODO: Call unpin API
    console.log('Unpin message:', pin._id)
  }

  const handleDownloadResource = (resource: any) => {
    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const handleOpenResource = (resource: any) => {
    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const handleStartQuiz = (quiz: any) => {
    // TODO: Navigate to quiz
    console.log('Start quiz:', quiz._id)
  }

  const handleCreateQuiz = () => {
    // TODO: Open create quiz modal for this group
    console.log('Create quiz for group:', chatId)
  }

  const handleOpenNotes = () => {
    // TODO: Open group notes
    console.log('Open notes for group:', chatId)
  }

  const handleEditRules = () => {
    // TODO: Open rules editor
    console.log('Edit rules for group:', chatId)
  }

  // No active chat - show empty state
  if (!activeChatId || !activeChatType) {
    return (
      <div className={cn("flex w-full flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/30 backdrop-blur-sm">
          <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Context</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground/60 transition-all animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center mb-6 shadow-inner ring-1 ring-border/50">
            <Info className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-center">Select a conversation to reveal context & resources</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Error</h2>
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Error State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-3xl bg-destructive/5 flex items-center justify-center mb-6 ring-1 ring-destructive/20 shadow-sm">
            <X className="w-7 h-7 text-destructive/70" />
          </div>
          <p className="text-sm font-bold text-foreground/80 mb-2">Sync Failed</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-8 max-w-[200px]">{error}</p>
          <Button
            onClick={refresh}
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
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Header skeleton */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          {isMobile && onCloseMobile && (
            <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-4 space-y-4 animate-in fade-in duration-300">
          {/* Identity skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>

          {/* Section skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-10 bg-muted/30 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Group Chat Context - Scrollable collapsible sections
  if (chatType === 'group' && groupMeta) {
    return (
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Minimal header with close and refresh */}
        <div className="h-12 px-4 border-b border-border/50 flex items-center justify-between bg-card/20 sticky top-0 z-10 shrink-0">
          <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
            Context
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              className="h-7 w-7 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            {isMobile && onCloseMobile && (
              <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-7 w-7 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            )}
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

  // Direct Chat Context - Simpler layout
  if (chatType === 'direct' && userMeta) {
    return (
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Minimal header with close and refresh */}
        <div className="h-12 px-4 border-b border-border/50 flex items-center justify-between bg-card/20 sticky top-0 z-10 shrink-0">
          <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
            Profile
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              className="h-7 w-7 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            {isMobile && onCloseMobile && (
              <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-7 w-7 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* User Identity Header */}
          <ChatIdentityHeader
            chatType={chatType}
            groupMeta={null}
            userMeta={userMeta}
            isTeacher={isTeacher}
            isGroupAdmin={false}
            onMute={handleMute}
            isMuted={isMuted}
            className="border-b border-border/40"
          />

          {/* Shared Resources */}
          <SharedResourcesHub
            resources={resources}
            onDownload={handleDownloadResource}
            onOpenExternal={handleOpenResource}
          />
        </div>
      </div>
    )
  }

  return null
}
