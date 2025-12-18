import { useState } from 'react'

export default function CreatePost({ onCreate }: { onCreate?: (p: any) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const submit = async () => {
    const post = { title, body, createdAt: new Date() }
    try {
      const res = await fetch('/api/sites/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) })
      const data = await res.json()
      onCreate?.(data.post || post)
      setTitle('')
      setBody('')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-2 py-1" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the problem" className="w-full border rounded px-2 py-1" />
      <button onClick={submit} className="btn">Create Post</button>
    </div>
  )
}
