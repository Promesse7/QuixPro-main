// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/hooks/useOnboarding'
import { OnboardingSlides } from '@/components/onboarding/OnboardingSlides'
import { ZeroStateExperience } from '@/components/onboarding/ZeroStateExperience'

export default function Home() {
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(true)
  const { state, isLoading } = useOnboarding()

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    router.push('/auth')
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  if (state?.completed || !showOnboarding) {
    return <ZeroStateExperience onComplete={() => {}}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Quix</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your learning journey starts here
          </p>
          <a 
            href="/auth" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </ZeroStateExperience>
  }

  return <OnboardingSlides onComplete={handleOnboardingComplete} />
}