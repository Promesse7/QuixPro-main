'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Users, BookOpen, Zap } from 'lucide-react'

export interface SelectionOption {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  count?: number
  difficulty?: string
  color?: string
}

interface SelectionCardProps {
  option: SelectionOption
  href: string
  variant?: 'compact' | 'detailed'
  onSelect?: (id: string) => void
  selected?: boolean
}

export function SelectionCard({
  option,
  href,
  variant = 'detailed',
  onSelect,
  selected = false,
}: SelectionCardProps) {
  const cardContent = variant === 'compact' ? (
    <Card
      className={`cursor-pointer transition-all duration-300 h-full ${
        selected
          ? 'border-primary bg-primary/10 glow-effect'
          : 'glass-effect border-border/50 hover:border-primary/50 hover:bg-primary/5'
      }`}
      onClick={() => onSelect?.(option.id)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        {option.icon && (
          <div className="mb-4 p-3 bg-primary/20 rounded-lg">
            {option.icon}
          </div>
        )}
        <h3 className="font-bold text-lg mb-2">{option.name}</h3>
        {option.count && (
          <Badge variant="secondary" className="mb-2">
            {option.count} items
          </Badge>
        )}
        {option.difficulty && (
          <Badge
            className={`mb-2 ${
              option.difficulty === 'Easy'
                ? 'bg-green-500/20 text-green-600'
                : option.difficulty === 'Medium'
                ? 'bg-yellow-500/20 text-yellow-600'
                : option.difficulty === 'Hard'
                ? 'bg-orange-500/20 text-orange-600'
                : 'bg-red-500/20 text-red-600'
            }`}
          >
            {option.difficulty}
          </Badge>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card className={`cursor-pointer transition-all duration-300 ${
      selected
        ? 'border-primary bg-primary/10 glow-effect'
        : 'glass-effect border-border/50 hover:border-primary/50 hover:bg-primary/5'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle className="text-xl">{option.name}</CardTitle>
            {option.description && (
              <CardDescription className="mt-2">{option.description}</CardDescription>
            )}
          </div>
          {option.icon && (
            <div className="ml-4">{option.icon}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          {option.count && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{option.count} units</span>
            </div>
          )}
          {option.difficulty && (
            <Badge
              className={`${
                option.difficulty === 'Easy'
                  ? 'bg-green-500/20 text-green-600'
                  : option.difficulty === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-600'
                  : option.difficulty === 'Hard'
                  ? 'bg-orange-500/20 text-orange-600'
                  : 'bg-red-500/20 text-red-600'
              }`}
            >
              {option.difficulty}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Link href={href} className="block h-full" onClick={() => onSelect?.(option.id)}>
      {cardContent}
    </Link>
  )
}
