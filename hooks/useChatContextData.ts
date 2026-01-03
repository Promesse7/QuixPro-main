"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getCurrentUser } from '@/lib/auth'

// Types for ChatContextState
export interface Member {
    _id: string
    name: string
    email: string
    role: 'teacher' | 'student' | 'admin' | 'member'
    isOnline?: boolean
    joinedAt?: Date
    avatar?: string
}

export interface PinnedMessage {
    _id: string
    content: string
    senderId: string
    senderName: string
    pinnedAt: Date
    pinnedBy: string
    messageType: 'text' | 'image' | 'file' | 'math'
}

export interface SharedResource {
    _id: string
    name: string
    type: 'image' | 'file' | 'link' | 'math'
    url: string
    uploadedBy: string
    uploadedByName?: string
    uploadedAt: string
    size?: number
    preview?: string
}

export interface RelatedQuiz {
    _id: string
    id: string
    title: string
    subject: string
    difficulty: string
    questions: number
    duration: number
    unit?: string
    unitId?: string
}

export interface ActivitySummary {
    lastActivityAt: Date | null
    messageFrequency: 'low' | 'medium' | 'high'
    upcomingDeadlines: Array<{
        quizId: string
        title: string
        dueDate: Date
    }>
}

export interface GroupRules {
    purpose?: string
    postingGuidelines?: string
    academicIntegrity?: string
}

export interface GroupMetadata {
    _id: string
    name: string
    description?: string
    subject?: string
    isPublic: boolean
    createdBy: string
    createdAt: Date
    updatedAt: Date
    teacher?: {
        _id: string
        name: string
        email: string
    }
    settings?: {
        allowMemberInvites: boolean
        readReceipts: boolean
        messageEditWindow: number
    }
}

export interface UserMetadata {
    _id: string
    name: string
    email: string
    role: 'student' | 'teacher' | 'admin'
    school?: string
    level?: string
    lastActive?: string
    avatar?: string
}

export interface ChatContextState {
    chatId: string | null
    chatType: 'direct' | 'group' | null
    groupMeta: GroupMetadata | null
    userMeta: UserMetadata | null
    members: Member[]
    pins: PinnedMessage[]
    resources: SharedResource[]
    relatedQuizzes: RelatedQuiz[]
    activity: ActivitySummary | null
    rules: GroupRules | null
    isLoading: boolean
    error: string | null
    // Counts for collapsed sections
    membersCount: number
    pinsCount: number
    resourcesCount: number
}

interface CacheEntry {
    data: Partial<ChatContextState>
    timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Simple in-memory cache
const contextCache = new Map<string, CacheEntry>()

function getCachedData(chatId: string): Partial<ChatContextState> | null {
    const entry = contextCache.get(chatId)
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data
    }
    return null
}

function setCachedData(chatId: string, data: Partial<ChatContextState>) {
    contextCache.set(chatId, {
        data,
        timestamp: Date.now()
    })
}

export function useChatContextData(
    activeChatId: string | null,
    activeChatType: 'direct' | 'group' | null
) {
    const [state, setState] = useState<ChatContextState>({
        chatId: null,
        chatType: null,
        groupMeta: null,
        userMeta: null,
        members: [],
        pins: [],
        resources: [],
        relatedQuizzes: [],
        activity: null,
        rules: null,
        isLoading: false,
        error: null,
        membersCount: 0,
        pinsCount: 0,
        resourcesCount: 0
    })

    const abortControllerRef = useRef<AbortController | null>(null)
    const currentUser = getCurrentUser()

    // Reset state when chat changes
    useEffect(() => {
        if (!activeChatId || !activeChatType) {
            setState(prev => ({
                ...prev,
                chatId: null,
                chatType: null,
                groupMeta: null,
                userMeta: null,
                members: [],
                pins: [],
                resources: [],
                relatedQuizzes: [],
                activity: null,
                rules: null,
                isLoading: false,
                error: null,
                membersCount: 0,
                pinsCount: 0,
                resourcesCount: 0
            }))
            return
        }

        // Check cache first
        const cached = getCachedData(activeChatId)
        if (cached) {
            setState(prev => ({
                ...prev,
                ...cached,
                chatId: activeChatId,
                chatType: activeChatType,
                isLoading: false,
                error: null
            }))
            return
        }

        // Fetch new data
        fetchContextData(activeChatId, activeChatType)
    }, [activeChatId, activeChatType])

    const fetchContextData = useCallback(async (
        chatId: string,
        chatType: 'direct' | 'group'
    ) => {
        // Cancel any pending requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        setState(prev => ({
            ...prev,
            chatId,
            chatType,
            isLoading: true,
            error: null
        }))

        try {
            if (chatType === 'group') {
                await fetchGroupContext(chatId, abortControllerRef.current.signal)
            } else if (chatType === 'direct') {
                await fetchDirectContext(chatId, abortControllerRef.current.signal)
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message || 'Failed to load context data'
                }))
            }
        }
    }, [])

    const fetchGroupContext = async (groupId: string, signal: AbortSignal) => {
        try {
            // Fetch group metadata
            const groupResponse = await fetch(`/api/groups/${groupId}`, { signal })
            if (!groupResponse.ok) {
                throw new Error('Failed to load group info')
            }
            const groupData = await groupResponse.json()

            // Try to fetch related quizzes (non-blocking)
            let relatedQuizzes: RelatedQuiz[] = []
            try {
                const quizzesResponse = await fetch(
                    `/api/groups/${groupId}/related-quizzes`,
                    { signal }
                )
                if (quizzesResponse.ok) {
                    const quizzesData = await quizzesResponse.json()
                    relatedQuizzes = quizzesData.quizzes || []
                }
            } catch {
                // Silently fail - quizzes are optional
            }

            // Try to fetch pins (non-blocking)
            let pins: PinnedMessage[] = []
            try {
                const pinsResponse = await fetch(
                    `/api/groups/${groupId}/pins`,
                    { signal }
                )
                if (pinsResponse.ok) {
                    const pinsData = await pinsResponse.json()
                    pins = pinsData.pins || []
                }
            } catch {
                // Silently fail - pins are optional
            }

            // Try to fetch resources (non-blocking)
            let resources: SharedResource[] = []
            try {
                const resourcesResponse = await fetch(
                    `/api/groups/${groupId}/resources`,
                    { signal }
                )
                if (resourcesResponse.ok) {
                    const resourcesData = await resourcesResponse.json()
                    resources = resourcesData.resources || []
                }
            } catch {
                // Silently fail - resources are optional
            }

            const group = groupData.group
            const newState: Partial<ChatContextState> = {
                groupMeta: {
                    _id: group._id,
                    name: group.name,
                    description: group.description,
                    subject: group.subject || 'General',
                    isPublic: group.isPublic,
                    createdBy: group.createdBy,
                    createdAt: group.createdAt,
                    updatedAt: group.updatedAt,
                    teacher: group.teacher,
                    settings: group.settings
                },
                members: group.members || [],
                pins,
                resources,
                relatedQuizzes,
                rules: group.rules || null,
                activity: {
                    lastActivityAt: group.updatedAt ? new Date(group.updatedAt) : null,
                    messageFrequency: 'medium', // TODO: Calculate from actual data
                    upcomingDeadlines: []
                },
                membersCount: group.members?.length || 0,
                pinsCount: pins.length,
                resourcesCount: resources.length
            }

            // Cache the data
            setCachedData(groupId, newState)

            setState(prev => ({
                ...prev,
                ...newState,
                isLoading: false,
                error: null
            }))
        } catch (error: any) {
            throw error
        }
    }

    const fetchDirectContext = async (userId: string, signal: AbortSignal) => {
        try {
            const response = await fetch(`/api/users/${userId}`, { signal })
            if (!response.ok) {
                throw new Error('Failed to load user info')
            }
            const data = await response.json()

            const newState: Partial<ChatContextState> = {
                userMeta: data.user,
                resources: data.user.sharedFiles || [],
                resourcesCount: data.user.sharedFiles?.length || 0
            }

            // Cache the data
            setCachedData(userId, newState)

            setState(prev => ({
                ...prev,
                ...newState,
                isLoading: false,
                error: null
            }))
        } catch (error: any) {
            throw error
        }
    }

    // Refresh function for manual refresh
    const refresh = useCallback(() => {
        if (state.chatId && state.chatType) {
            // Clear cache for this chat
            contextCache.delete(state.chatId)
            fetchContextData(state.chatId, state.chatType)
        }
    }, [state.chatId, state.chatType, fetchContextData])

    // Check if current user is a teacher/admin
    const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin'
    const isGroupAdmin = state.members.some(
        m => m._id === currentUser?.id && (m.role === 'admin' || m.role === 'teacher')
    )

    return {
        ...state,
        refresh,
        isTeacher,
        isGroupAdmin,
        currentUserId: currentUser?.id
    }
}
