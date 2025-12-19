"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, Play, GraduationCap, User, RotateCcw, BookOpen, Award } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

export function QuickStartCTA() {
  const [resumeLinks, setResumeLinks] = useState<{ lastQuizUrl?: string | null; continueCourseUrl?: string | null; latestCertificateUrl?: string | null }>({})

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) return
    const load = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/api/user/resume?userId=${encodeURIComponent(u.id)}`)
        if (res.ok) {
          const data = await res.json()
          setResumeLinks(data)
        }
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="mt-6 rounded-xl border border-border/50 glass-effect p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <Rocket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold">Quick start</div>
          <div className="text-sm text-muted-foreground">Jump back into learning in one click</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {resumeLinks.lastQuizUrl && (
          <Button asChild size="sm" className="glow-effect">
            <Link href={resumeLinks.lastQuizUrl}><RotateCcw className="h-4 w-4 mr-2" /> Resume Quiz</Link>
          </Button>
        )}
        {resumeLinks.continueCourseUrl && (
          <Button asChild size="sm" variant="outline">
            <Link href={resumeLinks.continueCourseUrl}><BookOpen className="h-4 w-4 mr-2" /> Continue Course</Link>
          </Button>
        )}
        {resumeLinks.latestCertificateUrl && (
          <Button asChild size="sm" variant="outline">
            <Link href={resumeLinks.latestCertificateUrl}><Award className="h-4 w-4 mr-2" /> Latest Certificate</Link>
          </Button>
        )}
        <Button asChild size="sm" className="glow-effect">
          <Link href="/quiz"><Play className="h-4 w-4 mr-2" /> Take a Quiz</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/quiz-selection"><GraduationCap className="h-4 w-4 mr-2" /> Explore Courses</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/profile"><User className="h-4 w-4 mr-2" /> Profile</Link>
        </Button>
      </div>
    </div>
  )
}
