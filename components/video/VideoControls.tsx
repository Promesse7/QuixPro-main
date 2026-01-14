"use client"
import React from 'react'

export default function VideoControls({ onLeave }: { onLeave?: () => void }) {
  return (
    <div className="flex gap-2">
      <button className="btn">Toggle Mic</button>
      <button className="btn">Toggle Camera</button>
      <button className="btn text-red-600" onClick={onLeave}>Leave</button>
    </div>
  )
}
