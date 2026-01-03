"use client"

import React from 'react'
import { Pin, ArrowRight, X, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { PinnedMessage } from '@/hooks/useChatContextData'

interface PinnedMessagesSectionProps {
    pins: PinnedMessage[]
    isGroupAdmin: boolean
    onJumpToMessage?: (pin: PinnedMessage) => void
    onUnpin?: (pin: PinnedMessage) => void
    className?: string
}

export function PinnedMessagesSection({
    pins,
    isGroupAdmin,
    onJumpToMessage,
    onUnpin,
    className = ""
}: PinnedMessagesSectionProps) {
    return (
        <CollapsibleSection
            title="Pinned Messages"
            icon={<Pin className="w-3.5 h-3.5 text-amber-500" />}
            count={pins.length}
            accentColor="amber-500"
            className={className}
        >
            <div className="px-4 space-y-2">
                {pins.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Pin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No pinned messages yet</p>
                        <p className="text-xs mt-1">Pin important messages to keep them accessible</p>
                    </div>
                ) : (
                    pins.map((pin) => (
                        <PinnedMessageItem
                            key={pin._id}
                            pin={pin}
                            canUnpin={isGroupAdmin}
                            onJumpTo={onJumpToMessage ? () => onJumpToMessage(pin) : undefined}
                            onUnpin={onUnpin && isGroupAdmin ? () => onUnpin(pin) : undefined}
                        />
                    ))
                )}
            </div>
        </CollapsibleSection>
    )
}

// Individual pinned message item
function PinnedMessageItem({
    pin,
    canUnpin,
    onJumpTo,
    onUnpin
}: {
    pin: PinnedMessage
    canUnpin: boolean
    onJumpTo?: () => void
    onUnpin?: () => void
}) {
    // Format the pinned date
    const formatDate = (date: Date | string) => {
        const d = new Date(date)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Truncate content for preview
    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength).trim() + '...'
    }

    // Get icon based on message type
    const getTypeIcon = () => {
        switch (pin.messageType) {
            case 'math':
                return <span className="text-xs font-mono">∑</span>
            case 'image':
                return <span className="text-xs">🖼️</span>
            case 'file':
                return <span className="text-xs">📎</span>
            default:
                return <MessageSquare className="w-3 h-3" />
        }
    }

    return (
        <div className="group relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
            {/* Header: sender and date */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
                        {getTypeIcon()}
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                        {pin.senderName}
                    </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                    {formatDate(pin.pinnedAt)}
                </span>
            </div>

            {/* Content preview */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {truncateContent(pin.content)}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
                {onJumpTo && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onJumpTo}
                        className="h-7 px-2 text-xs gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                    >
                        Jump to message
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                )}

                {onUnpin && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onUnpin}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                )}
            </div>
        </div>
    )
}
