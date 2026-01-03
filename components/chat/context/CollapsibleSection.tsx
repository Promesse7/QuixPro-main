"use client"

import React, { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
    title: string
    icon?: React.ReactNode
    count?: number
    defaultExpanded?: boolean
    children: React.ReactNode
    className?: string
    headerClassName?: string
    contentClassName?: string
    accentColor?: string
}

export function CollapsibleSection({
    title,
    icon,
    count,
    defaultExpanded = false,
    children,
    className = "",
    headerClassName = "",
    contentClassName = "",
    accentColor = "primary"
}: CollapsibleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const toggle = useCallback(() => {
        setIsExpanded(prev => !prev)
    }, [])

    return (
        <div className={cn("border-b border-border/40", className)}>
            {/* Header - always clickable */}
            <button
                onClick={toggle}
                className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors",
                    "text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-inset",
                    headerClassName
                )}
                aria-expanded={isExpanded}
            >
                {/* Collapse indicator */}
                <div className="shrink-0 text-muted-foreground">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </div>

                {/* Icon */}
                {icon && (
                    <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        `bg-${accentColor}/10 ring-1 ring-${accentColor}/20`
                    )}>
                        {icon}
                    </div>
                )}

                {/* Title */}
                <span className="flex-1 font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                    {title}
                </span>

                {/* Count badge */}
                {typeof count === 'number' && count > 0 && (
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full bg-muted/50 text-muted-foreground">
                        {count}
                    </span>
                )}
            </button>

            {/* Content - collapsible */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200 ease-out",
                    isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className={cn("pb-4", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    )
}
