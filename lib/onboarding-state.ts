export type OnboardingStep =
  | "welcome"
  | "feature_showcase"
  | "personalization"
  | "first_group"
  | "group_message"
  | "completed"

export interface OnboardingState {
  step: OnboardingStep
  completed: boolean
  timestamps: {
    started: number
    featureShowcase?: number
    personalization?: number
    firstGroup?: number
    groupMessage?: number
    completed?: number
  }
  preferences?: {
    useCase?: "friends" | "school" | "work"
  }
}

const STORAGE_KEY = "quix_onboarding_state"
const COMPLETION_KEY = "quix_onboarding_completed"

export const OnboardingStateManager = {
  getState: (): OnboardingState => {
    if (typeof window === "undefined") return getDefaultState()
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return getDefaultState()
      }
    }
    return getDefaultState()
  },

  setState: (state: OnboardingState) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  isCompleted: (): boolean => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(COMPLETION_KEY) === "true"
  },

  markCompleted: () => {
    if (typeof window === "undefined") return
    localStorage.setItem(COMPLETION_KEY, "true")
  },

  reset: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(COMPLETION_KEY)
  },
}

function getDefaultState(): OnboardingState {
  return {
    step: "welcome",
    completed: false,
    timestamps: {
      started: Date.now(),
    },
  }
}
