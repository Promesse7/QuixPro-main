"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare } from "lucide-react"
import Link from "next/link"

interface GroupPreviewProps {
  groupName: string
  members: number
  newPosts: number
}

export function GroupPreview({ groupName, members, newPosts }: GroupPreviewProps) {
  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {groupName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            {members} members
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {newPosts} new
          </Badge>
        </div>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/groups">View Group</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
