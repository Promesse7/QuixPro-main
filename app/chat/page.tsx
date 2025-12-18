"use client"
import React from 'react'
import GroupList from '@/components/chat/GroupList'
import { useGroups } from '@/hooks/useGroups'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ChatIndexPage() {
  const { groups } = useGroups()

  return (
    <div className="p-6">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <Card className="rounded-2xl sticky top-20">
            <CardHeader>
              <CardTitle>Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">Your groups</div>
                <Button asChild variant="ghost" size="sm"><Link href="/groups">Manage</Link></Button>
              </div>
              <GroupList groups={groups} />
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Select a group on the left to open the chat, or <Link href="/groups" className="text-primary">create one</Link>.</div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
