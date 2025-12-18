import { useState } from 'react'

export default function CreateGroup({ onCreated }: { onCreated?: (g: any) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const submit = async () => {
    const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description }) })
    const json = await res.json()
    onCreated?.(json.group)
    setName('')
    setDescription('')
  }
  return (
    <div className="space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="w-full border rounded px-2 py-1" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border rounded px-2 py-1" />
      <button onClick={submit} className="btn">Create</button>
    </div>
  )
}
