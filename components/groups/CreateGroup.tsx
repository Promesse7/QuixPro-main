import { useState } from 'react'

export default function CreateGroup({ onCreated }: { onCreated?: (g: any) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), description: description.trim() }) })
      const json = await res.json()
      onCreated?.(json.group)
      setName('')
      setDescription('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2" aria-label="Create new group">
      <div>
        <label className="block text-sm font-medium mb-1">Group name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          aria-required
          aria-label="Group name"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          aria-label="Group description"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <button type="submit" className="btn" disabled={loading || !name.trim()} aria-disabled={loading || !name.trim()}>
          {loading ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  )
}
