"use client"
import React, { useState } from 'react'
import { useQuixSites } from '@/hooks/useQuixSites'
import PostList from '@/components/quix-sites/PostList'
import CreatePost from '@/components/quix-sites/CreatePost'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Plus, Search, Filter, TrendingUp, MessageSquare, Heart, Share2 } from 'lucide-react'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function QuixSitesPage() {
  const { posts, refresh } = useQuixSites()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const router = useRouter()

  // Action handlers
  const handleAnswer = (postId: string) => {
    router.push(`/quix-sites/${postId}#answer`)
  }

  const handleAskClarification = (postId: string) => {
    router.push(`/quix-sites/${postId}#clarify`)
  }

  const handleFollow = (postId: string) => {
    // TODO: Implement follow functionality
    console.log('Following post:', postId)
  }

  const handleViewSolutions = (postId: string) => {
    router.push(`/quix-sites/${postId}#solutions`)
  }

  const handleProposeAlternative = (postId: string) => {
    router.push(`/quix-sites/${postId}#alternative`)
  }

  const handleQuestionSolution = (postId: string) => {
    router.push(`/quix-sites/${postId}#question`)
  }

  // Filter posts based on search and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Get unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Quix Sites' }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Quix Sites</h1>
                <p className="text-muted-foreground">Share knowledge, collaborate, and learn together</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="rounded-xl border-2 hover:border-primary/50">
                  <Link href="/dashboard">
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreatePost onCreate={() => refresh?.()} />
                </CardContent>
              </Card>

              {/* Posts List */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recent Posts
                    </div>
                    <Badge variant="secondary" className="rounded-full">{filteredPosts.length} posts</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <PostList 
  posts={filteredPosts}
  onAnswer={handleAnswer}
  onAskClarification={handleAskClarification}
  onFollow={handleFollow}
  onViewSolutions={handleViewSolutions}
  onProposeAlternative={handleProposeAlternative}
  onQuestionSolution={handleQuestionSolution}
/>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Search */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </CardContent>
              </Card>

              {/* Tags Filter */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter by Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedTag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag("")}
                      className="rounded-full"
                    >
                      All
                    </Button>
                    {allTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTag(tag)}
                        className="rounded-full"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                    <Badge variant="secondary">{posts.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Tags</span>
                    <Badge variant="secondary">{allTags.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      High
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-2 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start rounded-xl">
                    <Heart className="h-4 w-4 mr-2" />
                    Liked Posts
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start rounded-xl">
                    <Share2 className="h-4 w-4 mr-2" />
                    Shared Posts
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start rounded-xl">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending Topics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
