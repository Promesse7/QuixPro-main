"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { usePresence } from "@/hooks/usePresence"
import { getCurrentUserId, getFirebaseId } from "@/lib/userUtils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function Provider({ children }: { children: React.ReactNode }) {
  const userId = getCurrentUserId()
  const firebaseId = userId ? getFirebaseId(userId) : undefined

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  // Temporarily disable Firebase authentication to test basic functionality
  // useEffect(() => {
  //   if (firebaseId) {
  //     authenticateWithFirebase(firebaseId);
  //   }
  // }, [firebaseId]);

  usePresence(firebaseId)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
