"use client"

import UserSearch from '@/components/chat/UserSearch'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default function DiscoverPage() {
  const router = useRouter()
  const currentUser = getCurrentUser()

  const handleUserSelect = (user: any) => {
    // Navigate to direct chat with this user
    router.push(`/chat/direct/${encodeURIComponent(user.email)}`)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find People</h1>
        <p className="text-muted-foreground">Search for Students and Teachers across the platform.</p>
      </div>
      <UserSearch onUserSelect={handleUserSelect} />
    </div>
  )
}
