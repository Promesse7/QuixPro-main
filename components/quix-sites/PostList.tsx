import PostCard from './PostCard'
import { cn } from '@/lib/utils'

// Define the Post interface here to avoid circular imports
export interface Post {
  _id: string
  title: string
  description: string
  status: 'solved' | 'open' | 'unsolved'
  subject: string
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert'
  author: {
    id: string
    name: string
    avatar?: string
    role: 'student' | 'teacher' | 'admin'
  }
  createdAt: string
  lastActivityAt: string
  stats: {
    answers: number
    alternatives: number
    inquiries: number
  }
  acceptedAnswer?: {
    exists: boolean
    authorName?: string
    preview?: string
  }
  tags: string[]
}

interface PostListProps {
  posts: Post[]
  className?: string
  onAnswer?: (postId: string) => void
  onAskClarification?: (postId: string) => void
  onFollow?: (postId: string) => void
  onViewSolutions?: (postId: string) => void
  onProposeAlternative?: (postId: string) => void
  onQuestionSolution?: (postId: string) => void
}

export default function PostList({ 
  posts, 
  className,
  onAnswer,
  onAskClarification,
  onFollow,
  onViewSolutions,
  onProposeAlternative,
  onQuestionSolution
}: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
        <p className="text-muted-foreground">Be the first to ask a question or share a problem!</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {posts.map((post) => (
        <PostCard 
          key={post._id} 
          post={post}
          onAnswer={onAnswer}
          onAskClarification={onAskClarification}
          onFollow={onFollow}
          onViewSolutions={onViewSolutions}
          onProposeAlternative={onProposeAlternative}
          onQuestionSolution={onQuestionSolution}
        />
      ))}
    </div>
  )
}
