"use client"

import React, { useState } from 'react'
import { Users, UserPlus, UserMinus, Crown, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { Member } from '@/hooks/useChatContextData'

interface MembersSectionProps {
    members: Member[]
    isGroupAdmin: boolean
    currentUserId?: string
    onMemberClick?: (member: Member) => void
    onRemoveMember?: (member: Member) => void
    className?: string
}

export function MembersSection({
    members,
    isGroupAdmin,
    currentUserId,
    onMemberClick,
    onRemoveMember,
    className = ""
}: MembersSectionProps) {
    const [showAll, setShowAll] = useState(false)

    // Sort: teachers/admins first, then alphabetically
    const sortedMembers = [...members].sort((a, b) => {
        const aIsLeader = a.role === 'teacher' || a.role === 'admin'
        const bIsLeader = b.role === 'teacher' || b.role === 'admin'
        if (aIsLeader && !bIsLeader) return -1
        if (!aIsLeader && bIsLeader) return 1
        return a.name.localeCompare(b.name)
    })

    const displayMembers = showAll ? sortedMembers : sortedMembers.slice(0, 5)
    const hasMore = sortedMembers.length > 5

    return (
        <CollapsibleSection
            title="Members"
            icon={<Users className="w-3.5 h-3.5 text-blue-500" />}
            count={members.length}
            accentColor="blue-500"
            className={className}
        >
            <div className="px-4 space-y-1">
                {displayMembers.map((member) => (
                    <MemberItem
                        key={member._id}
                        member={member}
                        isCurrentUser={member._id === currentUserId}
                        isGroupAdmin={isGroupAdmin}
                        onClick={onMemberClick ? () => onMemberClick(member) : undefined}
                        onRemove={onRemoveMember && isGroupAdmin && member._id !== currentUserId
                            ? () => onRemoveMember(member)
                            : undefined
                        }
                    />
                ))}

                {hasMore && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                        className="w-full h-8 text-xs text-muted-foreground hover:text-foreground mt-2"
                    >
                        {showAll ? 'Show less' : `Show ${sortedMembers.length - 5} more`}
                    </Button>
                )}

                {members.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No members found
                    </p>
                )}
            </div>
        </CollapsibleSection>
    )
}

// Individual member item
function MemberItem({
    member,
    isCurrentUser,
    isGroupAdmin,
    onClick,
    onRemove
}: {
    member: Member
    isCurrentUser: boolean
    isGroupAdmin: boolean
    onClick?: () => void
    onRemove?: () => void
}) {
    const getRoleInfo = () => {
        switch (member.role) {
            case 'teacher':
                return { icon: GraduationCap, color: 'text-purple-500', label: 'Teacher' }
            case 'admin':
                return { icon: Crown, color: 'text-amber-500', label: 'Admin' }
            default:
                return null
        }
    }

    const roleInfo = getRoleInfo()

    return (
        <div
            className={cn(
                "group flex items-center gap-3 p-2 rounded-xl transition-colors",
                onClick ? "cursor-pointer hover:bg-muted/50" : "",
                isCurrentUser && "bg-primary/5"
            )}
            onClick={onClick}
        >
            {/* Avatar with online indicator */}
            <div className="relative shrink-0">
                <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
            </div>

            {/* Name and role */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className={cn(
                        "text-sm font-medium truncate",
                        isCurrentUser && "text-primary"
                    )}>
                        {member.name}
                        {isCurrentUser && <span className="text-muted-foreground"> (You)</span>}
                    </p>
                    {roleInfo && (
                        <roleInfo.icon className={cn("w-3.5 h-3.5 shrink-0", roleInfo.color)} />
                    )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                    {roleInfo ? roleInfo.label : 'Student'}
                </p>
            </div>

            {/* Remove button (only for admins, not self) */}
            {onRemove && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <UserMinus className="w-3.5 h-3.5" />
                </Button>
            )}
        </div>
    )
}
