import React from 'react'

export default function MessageItem({ message }: { message: any }) {
  if (!message) return null
  if (message.type === 'math') {
    return <div className="italic text-indigo-700">Math: {message.content?.latex || message.content}</div>
  }
  if (message.type === 'image') {
    return (
      <div>
        <img src={message.content?.url || ''} alt={message.content?.caption || 'image'} className="max-w-xs" />
      </div>
    )
  }
  return <div>{message.content?.text || message.content}</div>
}
