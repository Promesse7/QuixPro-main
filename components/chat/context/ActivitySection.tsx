"use client"

import React from 'react'
import { Activity, Clock, MessageSquare, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { ActivitySummary } from '@/hooks/useChatContextData'

interface ActivitySectionProps {
    activity: ActivitySummary | null
    className?: string
}

export function ActivitySection({
    activity,
    className = ""
}: ActivitySectionProps) {
    if (!activity) {
        return null
    }

    // Format last activity time
    const formatLastActivity = (date: Date | null) => {
        if (!date) return 'No activity yet'

        const now = new Date()
        const d = new Date(date)
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Get frequency indicator
    const getFrequencyInfo = (frequency: 'low' | 'medium' | 'high') => {
        switch (frequency) {
            case 'high':
                return {
                    icon: TrendingUp,
                    label: 'Very Active',
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10'
                }
            case 'medium':
                return {
                    icon: Minus,
                    label: 'Moderately Active',
                    color: 'text-amber-500',
                    bgColor: 'bg-amber-500/10'
                }
            case 'low':
                return {
                    icon: TrendingDown,
                    label: 'Low Activity',
                    color: 'text-muted-foreground',
                    bgColor: 'bg-muted/50'
                }
        }
    }

    const frequencyInfo = getFrequencyInfo(activity.messageFrequency)
    const FrequencyIcon = frequencyInfo.icon

    return (
        <CollapsibleSection
            title="Activity"
            icon={<Activity className="w-3.5 h-3.5 text-cyan-500" />}
            accentColor="cyan-500"
            className={className}
        >
            <div className="px-4 space-y-3">
                {/* Last Activity */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Last Activity</p>
                        <p className="text-sm font-semibold">
                            {formatLastActivity(activity.lastActivityAt)}
                        </p>
                    </div>
                </div>

                {/* Message Frequency */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                    <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        frequencyInfo.bgColor
                    )}>
                        <FrequencyIcon className={cn("w-4 h-4", frequencyInfo.color)} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Message Frequency</p>
                        <p className={cn("text-sm font-semibold", frequencyInfo.color)}>
                            {frequencyInfo.label}
                        </p>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                {activity.upcomingDeadlines && activity.upcomingDeadlines.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            Upcoming Deadlines
                        </h4>

                        <div className="space-y-1.5">
                            {activity.upcomingDeadlines.map((deadline, index) => (
                                <DeadlineItem
                                    key={deadline.quizId || index}
                                    title={deadline.title}
                                    dueDate={deadline.dueDate}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleSection>
    )
}

// Individual deadline item
function DeadlineItem({
    title,
    dueDate
}: {
    title: string
    dueDate: Date
}) {
    const d = new Date(dueDate)
    const now = new Date()
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Determine urgency
    const isUrgent = diffDays <= 1
    const isSoon = diffDays <= 3

    const formatDate = () => {
        if (diffDays < 0) return 'Overdue'
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Tomorrow'
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className={cn(
            "flex items-center gap-2 p-2 rounded-lg",
            isUrgent ? "bg-red-500/10" : isSoon ? "bg-amber-500/10" : "bg-muted/30"
        )}>
            <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold",
                isUrgent ? "bg-red-500/20 text-red-600" :
                    isSoon ? "bg-amber-500/20 text-amber-600" :
                        "bg-muted text-muted-foreground"
            )}>
                {diffDays < 0 ? '!' : diffDays}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className={cn(
                    "text-[10px]",
                    isUrgent ? "text-red-600" : isSoon ? "text-amber-600" : "text-muted-foreground"
                )}>
                    {formatDate()}
                </p>
            </div>
        </div>
    )
}
