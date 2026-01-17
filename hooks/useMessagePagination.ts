"use client"

import { useState, useCallback } from "react"

interface PaginationState {
  page: number
  limit: number
  hasMore: boolean
  isLoading: boolean
}

export function useMessagePagination(initialLimit = 50) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    limit: initialLimit,
    hasMore: true,
    isLoading: false,
  })

  const loadMore = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
      isLoading: true,
    }))
  }, [])

  const resetPagination = useCallback(() => {
    setPagination({
      page: 0,
      limit: initialLimit,
      hasMore: true,
      isLoading: false,
    })
  }, [initialLimit])

  const setHasMore = useCallback((hasMore: boolean) => {
    setPagination((prev) => ({
      ...prev,
      hasMore,
      isLoading: false,
    }))
  }, [])

  return {
    ...pagination,
    loadMore,
    resetPagination,
    setHasMore,
  }
}
