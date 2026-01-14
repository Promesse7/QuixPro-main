import { useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function CreatePost({ onCreate }: { onCreate?: (p: any) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    
    const currentUser = getCurrentUser()
    const post = { 
      title: title.trim(), 
      body: body.trim(), 
      author: currentUser?.name || 'Anonymous',
      createdAt: new Date() 
    }
    
    try {
      const res = await fetch('/api/sites/posts', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(post) 
      })
      const data = await res.json()
      onCreate?.(data.post || post)
      setTitle('')
      setBody('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" aria-label="Create new post">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="What's your question or problem?" 
          aria-required 
          aria-label="Post title" 
          className="w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          placeholder="Provide more details about your problem..." 
          aria-label="Post body" 
          rows={4}
          className="w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="rounded-full">
            {title.length}/100 characters
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {body.length}/500 characters
          </Badge>
        </div>
        <Button 
          type="submit" 
          disabled={loading || !title.trim()} 
          aria-disabled={loading || !title.trim()}
          className="rounded-xl px-6"
        >
          {loading ? 'Posting…' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
