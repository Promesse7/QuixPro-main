"use client"
import React from 'react'
import VideoRoom from '@/components/video/VideoRoom'
import { useParams } from 'next/navigation'

export default function VideoRoomPage() {
  const params = useParams() as { id?: string }
  const id = params?.id

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Video Room</h1>
      {id ? <VideoRoom roomId={id} /> : <div>No room id</div>}
    </div>
  )
}
