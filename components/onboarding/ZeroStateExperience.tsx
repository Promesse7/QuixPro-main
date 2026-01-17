"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOnboarding } from "@/hooks/useOnboarding"
import { OnboardingTooltip } from "./OnboardingTooltip"
import { MicroMissionChecklist } from "./MicroMissionChecklist"
import { PersonalizationPrompt } from "./PersonalizationPrompt"
import { AnimatePresence } from "framer-motion"

interface ZeroStateExperienceProps {
  onComplete?: () => void
  children: React.ReactNode
}

export function ZeroStateExperience({ onComplete, children }: ZeroStateExperienceProps) {
  const { state, isLoading, updateStep, completeOnboarding } = useOnboarding()
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipText, setTooltipText] = useState("")

  useEffect(() => {
    if (isLoading || !state || state.completed) return

    // Auto-progress through onboarding steps
    if (state.step === "welcome") {
      setTooltipText("Type your first message…")
      updateStep("first_message")
    }
  }, [state, isLoading, updateStep])

  if (isLoading || !state || state.completed) {
    return children
  }

  const handleFirstMessageSent = () => {
    setShowTooltip(true)
    setTooltipText("Nice. Conversations in Quix are real-time.")
    setTimeout(() => setShowTooltip(false), 3000)
    updateStep("chat_feature")
  }

  const handlePersonalizationComplete = (useCase: "friends" | "school" | "work") => {
    updateStep("first_group", { useCase })
  }

  const handleMissionComplete = () => {
    completeOnboarding()
    onComplete?.()
  }

  return (
    <div className="relative">
      <AnimatePresence>{showTooltip && <OnboardingTooltip text={tooltipText} />}</AnimatePresence>

      {state.step === "personalization" && <PersonalizationPrompt onComplete={handlePersonalizationComplete} />}

      {state.step === "first_group" && <MicroMissionChecklist onComplete={handleMissionComplete} />}

      <div onFocus={handleFirstMessageSent}>{children}</div>
    </div>
  )
}
