"use client"
import React from 'react'
import ChatWindow from '@/components/chat/ChatWindow'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function GroupDetailPage() {
  const params = useParams() as { id?: string }
  const groupId = params?.id

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Group Chat</CardTitle>
          </CardHeader>
          <CardContent>
            {groupId ? (
              <div className="h-[70vh]">
                <ChatWindow groupId={groupId} className="h-full" />
              </div>
            ) : (
              <div className="text-muted-foreground">No group selected.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
