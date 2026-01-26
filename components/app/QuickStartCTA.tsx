"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, Play, GraduationCap, User, RotateCcw, BookOpen, Award } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

export function QuickStartCTA() {
  const [resumeLinks, setResumeLinks] = useState<{ lastQuizUrl?: string | null; continueCourseUrl?: string | null; latestCertificateUrl?: string | null }>({})
  const [isLoadingResume, setIsLoadingResume] = useState(true)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u?.id) {
      setIsLoadingResume(false)
      return
    }
    const load = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/api/user/resume?userId=${encodeURIComponent(u.id)}`)
        if (res.ok) {
          const data = await res.json()
          setResumeLinks(data)
        }
      } catch (error) {
        console.error("Failed to load resume data:", error)
      } finally {
        setIsLoadingResume(false)
      }
    }
    load()
  }, [])

  return (
    <div className="mt-6 rounded-3xl border border-border/50 bg-muted/20 backdrop-blur-xl shadow-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
          <Rocket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold">Quick start</div>
          <div className="text-sm text-muted-foreground">Jump back into learning in one click</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoadingResume ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading quick actions...</div>
        ) : (
          <>
            {resumeLinks.lastQuizUrl && (
              <Button asChild size="sm" className="glow-effect">
                <Link href={resumeLinks.lastQuizUrl} className="rounded-xl"><RotateCcw className="h-4 w-4 mr-2" /> Resume Quiz</Link>
              </Button>
            )}
            {resumeLinks.continueCourseUrl && (
              <Button asChild size="sm" variant="outline">
                <Link href={resumeLinks.continueCourseUrl} className="rounded-xl"><BookOpen className="h-4 w-4 mr-2" /> Continue Course</Link>
              </Button>
            )}
            {resumeLinks.latestCertificateUrl && (
              <Button asChild size="sm" variant="outline">
                <Link href={resumeLinks.latestCertificateUrl} className="rounded-xl"><Award className="h-4 w-4 mr-2" /> Latest Certificate</Link>
              </Button>
            )}
          </>
        )}
        <Button asChild size="sm" className="glow-effect">
          <Link href="/quiz" className="rounded-xl"><Play className="h-4 w-4 mr-2" /> Take a Quiz</Link>
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
