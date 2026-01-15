"use client"

export function QuizSkeleton() {
  return (
    <div className="glass-effect border border-border/50 rounded-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>

        <div className="flex justify-between mb-4 gap-2">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-12"></div>
        </div>

        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    </div>
  )
}
