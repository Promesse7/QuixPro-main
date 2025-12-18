"use client"
import React from 'react'
import { useQuixSites } from '@/hooks/useQuixSites'
import PostList from '@/components/quix-sites/PostList'
import CreatePost from '@/components/quix-sites/CreatePost'

export default function QuixSitesPage() {
  const { posts, refresh } = useQuixSites()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quix Sites</h1>
      <div className="max-w-3xl space-y-6">
        <CreatePost onCreate={() => refresh?.()} />
        <PostList posts={posts} />
      </div>
    </div>
  )
}
