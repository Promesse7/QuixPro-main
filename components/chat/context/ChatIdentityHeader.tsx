"use client"

import React from 'react'
import {
    User,
    Users,
    GraduationCap,
    Bell,
    BellOff,
    LogOut,
    Settings,
    MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { GroupMetadata, UserMetadata } from '@/hooks/useChatContextData'

interface ChatIdentityHeaderProps {
    chatType: 'direct' | 'group' | null
    groupMeta: GroupMetadata | null
    userMeta: UserMetadata | null
    isTeacher: boolean
    isGroupAdmin: boolean
    onMute?: () => void
    onLeave?: () => void
    onEdit?: () => void
    isMuted?: boolean
    className?: string
}

export function ChatIdentityHeader({
    chatType,
    groupMeta,
    userMeta,
    isTeacher,
    isGroupAdmin,
    onMute,
    onLeave,
    onEdit,
    isMuted = false,
    className = ""
}: ChatIdentityHeaderProps) {
    if (chatType === 'group' && groupMeta) {
        return <GroupIdentityHeader
            group={groupMeta}
            isTeacher={isTeacher}
            isGroupAdmin={isGroupAdmin}
            onMute={onMute}
            onLeave={onLeave}
            onEdit={onEdit}
            isMuted={isMuted}
            className={className}
        />
    }

    if (chatType === 'direct' && userMeta) {
        return <DirectIdentityHeader
            user={userMeta}
            onMute={onMute}
            isMuted={isMuted}
            className={className}
        />
    }

    return null
}

// Group chat identity header
function GroupIdentityHeader({
    group,
    isTeacher,
    isGroupAdmin,
    onMute,
    onLeave,
    onEdit,
    isMuted,
    className
}: {
    group: GroupMetadata
    isTeacher: boolean
    isGroupAdmin: boolean
    onMute?: () => void
    onLeave?: () => void
    onEdit?: () => void
    isMuted: boolean
    className?: string
}) {
    // Determine chat type badge
    const getChatTypeBadge = () => {
        if (group.teacher) {
            return { label: 'Class', variant: 'default' as const, icon: GraduationCap }
        }
        return { label: 'Group', variant: 'secondary' as const, icon: Users }
    }

    const typeBadge = getChatTypeBadge()
    const TypeIcon = typeBadge.icon

    return (
        <div className={cn("p-4 space-y-4", className)}>
            {/* Main identity */}
            <div className="flex items-start gap-4">
                {/* Group avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10 shadow-sm">
                    <MessageSquare className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h2 className="font-bold text-base leading-tight truncate mb-1">
                        {group.name}
                    </h2>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {/* Type badge */}
                        <Badge
                            variant={typeBadge.variant}
                            className="text-[10px] font-bold px-2 py-0.5 gap-1"
                        >
                            <TypeIcon className="w-3 h-3" />
                            {typeBadge.label}
                        </Badge>

                        {/* Subject badge */}
                        {group.subject && group.subject !== 'General' && (
                            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5">
                                {group.subject}
                            </Badge>
                        )}

                        {/* Public/Private badge */}
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px] font-medium px-2 py-0.5",
                                group.isPublic ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"
                            )}
                        >
                            {group.isPublic ? 'Public' : 'Private'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Teacher info */}
            {group.teacher && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
                        <GraduationCap className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Teacher</p>
                        <p className="text-sm font-semibold truncate">{group.teacher.name}</p>
                    </div>
                </div>
            )}

            {/* Description */}
            {group.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {group.description}
                </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
                {onMute && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMute}
                        className="h-8 px-3 text-xs gap-1.5"
                    >
                        {isMuted ? (
                            <>
                                <Bell className="w-3.5 h-3.5" />
                                Unmute
                            </>
                        ) : (
                            <>
                                <BellOff className="w-3.5 h-3.5" />
                                Mute
                            </>
                        )}
                    </Button>
                )}

                {(isTeacher || isGroupAdmin) && onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="h-8 px-3 text-xs gap-1.5"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                )}

                {!isGroupAdmin && onLeave && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLeave}
                        className="h-8 px-3 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Leave
                    </Button>
                )}
            </div>
        </div>
    )
}

// Direct chat identity header
function DirectIdentityHeader({
    user,
    onMute,
    isMuted,
    className
}: {
    user: UserMetadata
    onMute?: () => void
    isMuted: boolean
    className?: string
}) {
    const getRoleBadge = () => {
        switch (user.role) {
            case 'teacher':
                return { label: 'Teacher', icon: GraduationCap, color: 'text-purple-600 border-purple-200' }
            case 'admin':
                return { label: 'Admin', icon: Settings, color: 'text-amber-600 border-amber-200' }
            default:
                return { label: 'Student', icon: User, color: 'text-blue-600 border-blue-200' }
        }
    }

    const roleBadge = getRoleBadge()
    const RoleIcon = roleBadge.icon

    return (
        <div className={cn("p-4 space-y-4", className)}>
            {/* Main identity */}
            <div className="flex items-start gap-4">
                {/* User avatar */}
                <Avatar className="w-14 h-14 ring-2 ring-primary/10">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h2 className="font-bold text-base leading-tight truncate mb-1">
                        {user.name}
                    </h2>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {/* Role badge */}
                        <Badge
                            variant="outline"
                            className={cn("text-[10px] font-bold px-2 py-0.5 gap-1", roleBadge.color)}
                        >
                            <RoleIcon className="w-3 h-3" />
                            {roleBadge.label}
                        </Badge>

                        {/* Level badge */}
                        {user.level && (
                            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                                {user.level}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional info */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{user.email}</span>
                </div>

                {user.school && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">School:</span>
                        <span className="truncate">{user.school}</span>
                    </div>
                )}

                {user.lastActive && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">Last Active:</span>
                        <span>{user.lastActive}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {onMute && (
                <div className="pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMute}
                        className="h-8 px-3 text-xs gap-1.5"
                    >
                        {isMuted ? (
                            <>
                                <Bell className="w-3.5 h-3.5" />
                                Unmute
                            </>
                        ) : (
                            <>
                                <BellOff className="w-3.5 h-3.5" />
                                Mute
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
