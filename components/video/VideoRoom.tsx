"use client"
import React, { useEffect, useRef } from 'react'

export default function VideoRoom({ roomId }: { roomId: string }) {
  const localRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        if (localRef.current) localRef.current.srcObject = stream
      } catch (err) {
        console.error('Video access denied', err)
      }
    }
    if (mounted) init()
    return () => { mounted = false }
  }, [roomId])

  return (
    <div className="grid grid-cols-2 gap-2">
      <video ref={localRef} autoPlay muted className="w-full h-64 bg-black" />
      <div className="bg-gray-100 p-2">Remote peers will appear here (placeholder)</div>
    </div>
  )
}
