'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbStep {
  label: string
  href?: string
  active?: boolean
}

interface QuizBreadcrumbProps {
  steps: BreadcrumbStep[]
}

export function QuizBreadcrumb({ steps }: QuizBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          {step.href ? (
            <Link
              href={step.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {step.label}
            </Link>
          ) : (
            <span className={step.active ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
              {step.label}
            </span>
          )}
          {index < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </nav>
  )
}
