"use client"
import React from 'react'
import { useGroups } from '@/hooks/useGroups'
import GroupCard from '@/components/groups/GroupCard'
import CreateGroup from '@/components/groups/CreateGroup'
import Link from 'next/link'

export default function GroupsPage() {
  const { groups, refresh } = useGroups()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Groups</h1>
      <div className="max-w-2xl space-y-4">
        <CreateGroup onCreated={() => refresh?.()} />
        <div className="grid grid-cols-1 gap-3">
          {groups?.length ? groups.map((g: any) => (
            <Link key={g._id} href={`/groups/${g._id}`}>
              <a>
                <GroupCard group={g} />
              </a>
            </Link>
          )) : <div className="text-sm text-muted-foreground">No groups yet.</div>}
        </div>
      </div>
    </div>
  )
}
