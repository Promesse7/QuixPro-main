"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TryQuizPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to quiz selection or quiz list
    router.push('/quiz-selection')
  }, [router])
  
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to quiz selection...</p>
      </div>
    </div>
  )
}