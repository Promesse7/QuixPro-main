import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  CheckCircle, 
  MessageCircle, 
  Users, 
  HelpCircle, 
  ArrowRight,
  Clock,
  BookOpen,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Post } from './PostList'

interface PostCardProps {
  post: Post
  className?: string
  onAnswer?: (postId: string) => void
  onAskClarification?: (postId: string) => void
  onFollow?: (postId: string) => void
  onViewSolutions?: (postId: string) => void
  onProposeAlternative?: (postId: string) => void
  onQuestionSolution?: (postId: string) => void
}

export default function PostCard({ post, className, onAnswer, onAskClarification, onFollow, onViewSolutions, onProposeAlternative, onQuestionSolution }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isSolved = post.status === 'solved'
  const isUnsolved = post.status === 'unsolved' || post.status === 'open'
  const hasAnswers = post.stats?.answers > 0

  const handleAction = (action: () => void, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    action()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'open': case 'unsolved': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-lg dark:hover:shadow-primary/20 border-2 rounded-2xl",
      "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
      "hover:border-primary/50 dark:hover:border-primary/30",
      className
    )}>
      {/* Header Section */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author?.avatar} alt={post.author?.name || 'Anonymous'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author?.name ? 
                  post.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 
                  'AN'
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm truncate">{post.author?.name || 'Anonymous'}</p>
                <Badge variant="secondary" className={cn("text-xs", getRoleColor(post.author?.role || 'student'))}>
                  {post.author?.role || 'student'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {post.subject || 'General'}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", getDifficultyColor(post.difficulty || 'moderate'))}>
                  {post.difficulty || 'moderate'}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(post.status || 'open'))}>
                  {isSolved ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Solved
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3 h-3 mr-1" />
                      {post.status || 'open'}
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Problem Statement */}
        <div>
          <Link 
            href={`/quix-sites/${post._id}`}
            className="block group"
          >
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {post.title || 'Untitled Post'}
            </h3>
          </Link>
          <div className="mt-2 text-sm text-muted-foreground">
            {expanded ? (post.description || '') : truncateText(post.description || '', 150)}
            {(post.description || '').length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-primary hover:underline text-xs"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Accepted Solution Indicator */}
        {isSolved && post.acceptedAnswer?.exists && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Accepted solution available
              </p>
              {post.acceptedAnswer.authorName && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  By {post.acceptedAnswer.authorName}
                </p>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        )}

        {/* Interaction Summary */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>{post.stats?.answers || 0} answers</span>
          </div>
          {(post.stats?.alternatives || 0) > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{post.stats?.alternatives || 0} alternatives</span>
            </div>
          )}
          {(post.stats?.inquiries || 0) > 0 && (
            <div className="flex items-center space-x-1">
              <HelpCircle className="w-3 h-3" />
              <span>{post.stats?.inquiries || 0} inquiries</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {isUnsolved && !hasAnswers ? (
            <>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => handleAction(() => onAnswer?.(post._id), e)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Answer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => handleAction(() => onAskClarification?.(post._id), e)}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Ask
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => handleAction(() => onFollow?.(post._id), e)}
              >
                <Star className="w-4 h-4 mr-1" />
                Follow
              </Button>
            </>
          ) : (
            <>
              {hasAnswers && (
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => handleAction(() => onViewSolutions?.(post._id), e)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  View Solutions ({post.stats?.answers})
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => handleAction(() => onProposeAlternative?.(post._id), e)}
              >
                <Users className="w-4 h-4 mr-1" />
                Alternative
              </Button>
              {!isSolved && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => handleAction(() => onAnswer?.(post._id), e)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Answer
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => handleAction(() => onFollow?.(post._id), e)}
              >
                <Star className="w-4 h-4 mr-1" />
                Follow
              </Button>
            </>
          )}
        </div>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Posted {formatTimeAgo(post.createdAt || new Date().toISOString())}</span>
            <span>·</span>
            <span>Last activity {formatTimeAgo(post.lastActivityAt || post.createdAt || new Date().toISOString())}</span>
          </div>
          <div className="flex items-center space-x-1">
            {(post.tags || []).slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
