"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PostCard from '@/components/quix-sites/PostCard'
import AnswerInput from '@/components/quix-sites/AnswerInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageCircle, Users, HelpCircle, Star } from 'lucide-react'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'

export default function PostDetailPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const id = params?.id
  const [post, setPost] = React.useState<any | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [answers, setAnswers] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!id) return
    
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/sites/posts/${id}`)
        const data = await res.json()
        setPost(data.post || null)
        setAnswers(data.post?.answers || [])
      } catch (error) {
        console.error('Failed to fetch post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleAnswerAdded = (newAnswer: any) => {
    setAnswers(prev => [...prev, newAnswer])
  }

  const handleBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/quix-sites')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-4"></div>
              <div className="h-64 bg-muted rounded-xl mb-6"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
            <Button onClick={handleGoHome}>Back to Quix Sites</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Quix Sites', href: '/quix-sites' },
              { label: post.title || 'Post' }
            ]} />
          </div>

          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleGoHome}
              className="rounded-xl"
            >
              All Posts
            </Button>
          </div>

          {/* Post Content */}
          <div className="space-y-6">
            <PostCard 
              post={post}
              onAnswer={(postId) => {
                // Scroll to answer section
                document.getElementById('answer-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              onAskClarification={(postId) => {
                // TODO: Implement clarification modal
                console.log('Ask clarification:', postId)
              }}
              onFollow={(postId) => {
                // TODO: Implement follow functionality
                console.log('Follow post:', postId)
              }}
              onViewSolutions={(postId) => {
                // Scroll to answers section
                document.getElementById('answers-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              onProposeAlternative={(postId) => {
                // Scroll to answer section
                document.getElementById('answer-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              onQuestionSolution={(postId) => {
                // TODO: Implement question modal
                console.log('Question solution:', postId)
              }}
            />

            {/* Answers Section */}
            <Card className="border-2 rounded-2xl bg-card shadow-sm">
              <CardHeader className="pb-3" id="answers-section">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Answers & Solutions
                  <Badge variant="secondary" className="rounded-full">
                    {answers.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {answers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No answers yet. Be the first to help!</p>
                  </div>
                ) : (
                  answers.map((answer, index) => (
                    <div key={answer._id || index} className="p-4 border border-border/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{answer.author || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {answer.accepted && (
                          <Badge variant="default" className="rounded-full">
                            ✓ Accepted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{answer.body}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Add Answer Section */}
            <Card className="border-2 rounded-2xl bg-card shadow-sm" id="answer-section">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Add Your Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnswerInput postId={id || ''} onAdded={handleAnswerAdded} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
