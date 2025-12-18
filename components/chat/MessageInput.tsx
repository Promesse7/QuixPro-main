"use client"
import { useState } from 'react'

export default function MessageInput({ onSend, placeholder = 'Type a message' }: { onSend: (text: string, type?: string) => void; placeholder?: string }) {
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }
  return (
    <div className="flex gap-2">
      <input className="flex-1 rounded-md border px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
      <button className="btn" onClick={send}>Send</button>
    </div>
  )
}
