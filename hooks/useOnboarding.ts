"use client"

import { useState, useEffect, useCallback } from "react"
import { type OnboardingState, OnboardingStateManager, type OnboardingStep } from "@/lib/onboarding-state"

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialState = OnboardingStateManager.getState()
    setState(initialState)
    setIsLoading(false)
  }, [])

  const updateStep = useCallback((step: OnboardingStep, metadata?: any) => {
    setState((prev) => {
      if (!prev) return null
      const updated: OnboardingState = {
        ...prev,
        step,
        timestamps: {
          ...prev.timestamps,
          [step]: Date.now(),
        },
        preferences: metadata ? { ...prev.preferences, ...metadata } : prev.preferences,
      }
      OnboardingStateManager.setState(updated)
      return updated
    })
  }, [])

  const completeOnboarding = useCallback(() => {
    setState((prev) => {
      if (!prev) return null
      const updated: OnboardingState = {
        ...prev,
        step: "completed",
        completed: true,
        timestamps: {
          ...prev.timestamps,
          completed: Date.now(),
        },
      }
      OnboardingStateManager.setState(updated)
      OnboardingStateManager.markCompleted()
      return updated
    })
  }, [])

  const resetOnboarding = useCallback(() => {
    OnboardingStateManager.reset()
    const freshState = OnboardingStateManager.getState()
    setState(freshState)
  }, [])

  return {
    state,
    isLoading,
    updateStep,
    completeOnboarding,
    resetOnboarding,
  }
}
