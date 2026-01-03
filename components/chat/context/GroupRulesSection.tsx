"use client"

import React from 'react'
import { Shield, Target, BookOpen, AlertTriangle, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { GroupRules } from '@/hooks/useChatContextData'

interface GroupRulesSectionProps {
    rules: GroupRules | null
    isGroupAdmin: boolean
    onEditRules?: () => void
    className?: string
}

export function GroupRulesSection({
    rules,
    isGroupAdmin,
    onEditRules,
    className = ""
}: GroupRulesSectionProps) {
    // Check if there are any rules to display
    const hasRules = rules && (rules.purpose || rules.postingGuidelines || rules.academicIntegrity)

    return (
        <CollapsibleSection
            title="Group Guidelines"
            icon={<Shield className="w-3.5 h-3.5 text-slate-500" />}
            accentColor="slate-500"
            className={className}
        >
            <div className="px-4 space-y-4">
                {!hasRules ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No guidelines set yet</p>
                        {isGroupAdmin && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditRules}
                                className="mt-3 h-8 text-xs gap-1.5"
                            >
                                <Edit className="w-3 h-3" />
                                Add Guidelines
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Purpose */}
                        {rules?.purpose && (
                            <RuleBlock
                                icon={Target}
                                title="Purpose"
                                content={rules.purpose}
                                iconColor="text-blue-500"
                                bgColor="bg-blue-500/5"
                            />
                        )}

                        {/* Posting Guidelines */}
                        {rules?.postingGuidelines && (
                            <RuleBlock
                                icon={BookOpen}
                                title="Posting Rules"
                                content={rules.postingGuidelines}
                                iconColor="text-green-500"
                                bgColor="bg-green-500/5"
                            />
                        )}

                        {/* Academic Integrity */}
                        {rules?.academicIntegrity && (
                            <RuleBlock
                                icon={AlertTriangle}
                                title="Academic Integrity"
                                content={rules.academicIntegrity}
                                iconColor="text-amber-500"
                                bgColor="bg-amber-500/5"
                                isImportant
                            />
                        )}

                        {/* Edit button for admins */}
                        {isGroupAdmin && onEditRules && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onEditRules}
                                className="w-full h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <Edit className="w-3 h-3" />
                                Edit Guidelines
                            </Button>
                        )}
                    </>
                )}
            </div>
        </CollapsibleSection>
    )
}

// Individual rule block
function RuleBlock({
    icon: Icon,
    title,
    content,
    iconColor,
    bgColor,
    isImportant = false
}: {
    icon: typeof Target
    title: string
    content: string
    iconColor: string
    bgColor: string
    isImportant?: boolean
}) {
    return (
        <div className={cn(
            "p-3 rounded-xl border",
            bgColor,
            isImportant ? "border-amber-500/20" : "border-transparent"
        )}>
            <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center",
                    bgColor
                )}>
                    <Icon className={cn("w-3.5 h-3.5", iconColor)} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {title}
                </h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        </div>
    )
}
