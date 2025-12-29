import { useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AnswerInput({ postId, onAdded }: { postId: string; onAdded?: (a: any) => void }) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  
  const submit = async () => {
    if (!body.trim()) return
    setLoading(true)
    
    try {
      const currentUser = getCurrentUser()
      const res = await fetch(`/api/sites/posts/${postId}/answers`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          body: body.trim(),
          author: currentUser?.name || 'Anonymous'
        }) 
      })
      
      const json = await res.json()
      onAdded?.(json.answer)
      setBody('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-3">
      <textarea 
        value={body} 
        onChange={(e) => setBody(e.target.value)} 
        placeholder="Write your answer here..."
        className="w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
        rows={4}
      />
      <Button 
        onClick={submit} 
        disabled={loading || !body.trim()}
        className="rounded-xl"
      >
        {loading ? 'Submitting...' : 'Submit Answer'}
      </Button>
    </div>
  )
}
