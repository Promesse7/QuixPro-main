"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

const QUIZ_PAGE_SIZE = 10

interface QuizFilter {
  level?: string
  course?: string
  unit?: string
  difficulty?: string
}

export function useInfiniteQuizzes(filters: QuizFilter = {}) {
  return useInfiniteQuery({
    queryKey: ["quizzes", "infinite", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: QUIZ_PAGE_SIZE.toString(),
        ...(filters.level && { level: filters.level }),
        ...(filters.course && { course: filters.course }),
        ...(filters.unit && { unit: filters.unit }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
      })

      const res = await fetch(`/api/quiz?${params}`)
      if (!res.ok) throw new Error("Failed to fetch quizzes")
      const data = await res.json()
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.quizzes || lastPage.quizzes.length < QUIZ_PAGE_SIZE) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}
