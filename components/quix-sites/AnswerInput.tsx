import { useState } from 'react'

export default function AnswerInput({ postId, onAdded }: { postId: string; onAdded?: (a: any) => void }) {
  const [body, setBody] = useState('')
  const submit = async () => {
    if (!body.trim()) return
    try {
      const res = await fetch(`/api/sites/posts/${postId}/answers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) })
      const json = await res.json()
      onAdded?.(json.answer)
      setBody('')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="space-y-2">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full border rounded px-2 py-1" />
      <button onClick={submit} className="btn">Submit Answer</button>
    </div>
  )
}
