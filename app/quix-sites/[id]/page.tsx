"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import PostCard from '@/components/quix-sites/PostCard'
import AnswerInput from '@/components/quix-sites/AnswerInput'

export default function PostDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id

  // Minimal client fetch for post details
  const [post, setPost] = React.useState<any | null>(null)

  React.useEffect(() => {
    if (!id) return
    fetch(`/api/sites/posts/${id}`).then(r => r.json()).then(j => setPost(j.post || null)).catch(()=>setPost(null))
  }, [id])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Post</h1>
      <div className="max-w-3xl space-y-4">
        {post ? <PostCard post={post} /> : <div>Loading...</div>}
        <AnswerInput postId={id} />
      </div>
    </div>
  )
}
