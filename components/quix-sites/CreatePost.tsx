import { useState } from 'react'

export default function CreatePost({ onCreate }: { onCreate?: (p: any) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const post = { title: title.trim(), body: body.trim(), createdAt: new Date() }
    try {
      const res = await fetch('/api/sites/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) })
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
    <form onSubmit={submit} className="space-y-2" aria-label="Create new post">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-required aria-label="Post title" className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Describe the problem</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the problem" aria-label="Post body" className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <button type="submit" className="btn" disabled={loading || !title.trim()} aria-disabled={loading || !title.trim()}>
          {loading ? 'Posting…' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
