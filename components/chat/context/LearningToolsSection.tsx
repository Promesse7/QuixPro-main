"use client"

import React from 'react'
import {
    Lightbulb,
    Play,
    Plus,
    BookOpen,
    Clock,
    Star,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { RelatedQuiz } from '@/hooks/useChatContextData'

interface LearningToolsSectionProps {
    quizzes: RelatedQuiz[]
    isTeacher: boolean
    groupSubject?: string
    onStartQuiz?: (quiz: RelatedQuiz) => void
    onCreateQuiz?: () => void
    onOpenNotes?: () => void
    className?: string
}

export function LearningToolsSection({
    quizzes,
    isTeacher,
    groupSubject,
    onStartQuiz,
    onCreateQuiz,
    onOpenNotes,
    className = ""
}: LearningToolsSectionProps) {
    return (
        <CollapsibleSection
            title="Learning Tools"
            icon={<Lightbulb className="w-3.5 h-3.5 text-violet-500" />}
            count={quizzes.length}
            accentColor="violet-500"
            className={className}
        >
            <div className="px-4 space-y-4">
                {/* Related Quizzes */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Suggested Quizzes
                        </h4>
                        {groupSubject && (
                            <Badge variant="outline" className="text-[10px]">
                                {groupSubject}
                            </Badge>
                        )}
                    </div>

                    {quizzes.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No quizzes for this subject yet</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {quizzes.slice(0, 3).map((quiz) => (
                                <QuizCard
                                    key={quiz._id}
                                    quiz={quiz}
                                    onStart={onStartQuiz ? () => onStartQuiz(quiz) : undefined}
                                />
                            ))}
                        </div>
                    )}

                    {quizzes.length > 3 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-xs text-muted-foreground"
                        >
                            View all {quizzes.length} quizzes
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    )}
                </div>

                {/* Teacher Actions */}
                {isTeacher && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Teacher Tools
                        </h4>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCreateQuiz}
                            className="w-full h-9 text-sm justify-start gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Quiz for This Group
                        </Button>
                    </div>
                )}

                {/* Notes/Scratchpad (Future Feature) */}
                <div className="pt-2 border-t border-border/40">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onOpenNotes}
                        disabled
                        className="w-full h-9 text-sm justify-start gap-2 opacity-50"
                    >
                        <BookOpen className="w-4 h-4" />
                        Group Notes
                        <Badge variant="secondary" className="ml-auto text-[9px]">Coming Soon</Badge>
                    </Button>
                </div>
            </div>
        </CollapsibleSection>
    )
}

// Individual quiz card
function QuizCard({
    quiz,
    onStart
}: {
    quiz: RelatedQuiz
    onStart?: () => void
}) {
    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-500/10 text-green-600 border-green-200'
            case 'medium':
            case 'moderate':
                return 'bg-amber-500/10 text-amber-600 border-amber-200'
            case 'hard':
                return 'bg-red-500/10 text-red-600 border-red-200'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    return (
        <div className="group p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition-colors">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-violet-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold truncate mb-1">
                        {quiz.title}
                    </h5>
                    {quiz.unit && (
                        <p className="text-xs text-muted-foreground truncate mb-2">
                            {quiz.unit}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                            variant="outline"
                            className={cn("text-[9px] px-1.5 py-0", getDifficultyColor(quiz.difficulty))}
                        >
                            {quiz.difficulty}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5" />
                            {quiz.questions} Q
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {quiz.duration}m
                        </span>
                    </div>
                </div>

                {/* Start button */}
                {onStart && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onStart}
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600"
                    >
                        <Play className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
