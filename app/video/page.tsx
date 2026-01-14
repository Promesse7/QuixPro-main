"use client"
import React from 'react'
import Link from 'next/link'

export default function VideoIndex() {
  // Simple entry to create/join room by id
  const [roomId, setRoomId] = React.useState('')
  const create = () => setRoomId(String(Math.random()).slice(2,9))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Video Rooms</h1>
      <div className="space-y-4 max-w-md">
        <div className="flex gap-2">
          <input value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="Room id" className="flex-1 border rounded px-2 py-1" />
          <Link href={`/video/${roomId}`} className="btn">Join</Link>
        </div>
        <button onClick={create} className="btn">Create random room</button>
      </div>
    </div>
  )
}
