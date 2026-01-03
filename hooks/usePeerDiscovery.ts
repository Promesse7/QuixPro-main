'use client'

import { useState, useEffect, useCallback } from 'react'

interface Peer {
  _id: string
  userId: string
  peerId: string
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  requestedBy: string
  requestedAt: string
  respondedAt?: string
  lastInteractionAt?: string
  metadata?: any
}

interface PeerRecommendation {
  _id: string
  userId: string
  recommendedPeerId: string
  recommendationType: 'similar_level' | 'school_mate' | 'high_activity' | 'shared_course'
  score: number
  reasons: string[]
  metadata: any
  isViewed: boolean
  isActioned: boolean
  createdAt: string
  expiresAt: string
}

interface PeerActivity {
  _id: string
  userId: string
  activityType: string
  description: string
  isPublic: boolean
  metadata: any
  createdAt: string
  visibility: {
    public: boolean
    peers: string[]
    connections: boolean
  }
}

interface User {
  id: string
  name: string
  email: string
  level?: string
  school?: string
  avatar?: string
}

interface PeerStats {
  userId: string
  totalConnections: number
  activeConnections: number
  newConnectionsThisMonth: number
  averageResponseTime: number
  connectionRate: number
  activityScore: number
  influenceScore: number
  breakdown: any
  lastUpdated: string
}

interface PeerSettings {
  userId: string
  profileVisibility: 'public' | 'peers_only' | 'private'
  allowRecommendations: boolean
  showActivityStatus: boolean
  allowFriendRequests: boolean
  emailNotifications: {
    friendRequests: boolean
    recommendations: boolean
    activities: boolean
    messages: boolean
  }
  pushNotifications: {
    friendRequests: boolean
    recommendations: boolean
    activities: boolean
    messages: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    showLastSeen: boolean
    allowProfileSearch: boolean
    shareAcademicInfo: boolean
  }
  discovery: {
    maxRecommendations: number
    recommendationTypes: string[]
    autoAcceptSimilarLevel: boolean
    showMutualConnections: boolean
  }
}

export function usePeerDiscovery() {
  const [connections, setConnections] = useState<Peer[]>([])
  const [recommendations, setRecommendations] = useState<PeerRecommendation[]>([])
  const [pendingRequests, setPendingRequests] = useState<{ sent: Peer[], received: Peer[] }>({ sent: [], received: [] })
  const [activityFeed, setActivityFeed] = useState<PeerActivity[]>([])
  const [stats, setStats] = useState<PeerStats | null>(null)
  const [settings, setSettings] = useState<PeerSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generic API call function
  const apiCall = useCallback(async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Get connections
  const getConnections = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers?type=connections')
      setConnections(data.connections || [])
    } catch (err) {
      console.error('Error fetching connections:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Get recommendations
  const getRecommendations = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers?type=recommendations')
      setRecommendations(data.recommendations || [])
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Get pending requests
  const getPendingRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers?type=pending')
      setPendingRequests(data.pending || { sent: [], received: [] })
    } catch (err) {
      console.error('Error fetching pending requests:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Get activity feed
  const getActivityFeed = useCallback(async (before?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      let url = '/api/peers?type=activity_feed&limit=20'
      if (before) {
        url += `&before=${before}`
      }
      
      const data = await apiCall(url)
      if (before) {
        setActivityFeed(prev => [...prev, ...(data.activities || [])])
      } else {
        setActivityFeed(data.activities || [])
      }
    } catch (err) {
      console.error('Error fetching activity feed:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Get stats
  const getStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers?type=stats')
      setStats(data.stats)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Get settings
  const getSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers?type=settings')
      setSettings(data.settings)
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Search peers
  const searchPeers = useCallback(async (query: string, filters?: {
    level?: string
    school?: string
    course?: string
    onlyAvailable?: boolean
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        type: 'search',
        query,
        ...(filters?.level && { level: filters.level }),
        ...(filters?.school && { school: filters.school }),
        ...(filters?.course && { course: filters.course }),
        ...(filters?.onlyAvailable && { onlyAvailable: 'true' })
      })

      const data = await apiCall(`/api/peers?${params}`)
      return data.peers || []
    } catch (err) {
      console.error('Error searching peers:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Send friend request
  const sendFriendRequest = useCallback(async (peerId: string, message?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: 'send_request',
          peerId,
          message: message || 'Hi! I\'d like to connect with you.'
        })
      })

      // Refresh relevant data
      await getConnections()
      await getPendingRequests()
      
      return data
    } catch (err) {
      console.error('Error sending friend request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, getConnections, getPendingRequests])

  // Respond to friend request
  const respondToFriendRequest = useCallback(async (requesterId: string, response: 'accept' | 'decline', message?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: `${response}_request`,
          peerId: requesterId,
          requesterId,
          message
        })
      })

      // Refresh relevant data
      await getConnections()
      await getPendingRequests()
      await getStats()
      
      return data
    } catch (err) {
      console.error('Error responding to friend request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, getConnections, getPendingRequests, getStats])

  // Block peer
  const blockPeer = useCallback(async (peerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: 'block_peer',
          peerId
        })
      })

      // Refresh relevant data
      await getConnections()
      
      return data
    } catch (err) {
      console.error('Error blocking peer:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, getConnections])

  // Remove connection
  const removeConnection = useCallback(async (peerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: 'remove_connection',
          peerId
        })
      })

      // Refresh relevant data
      await getConnections()
      await getStats()
      
      return data
    } catch (err) {
      console.error('Error removing connection:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, getConnections, getStats])

  // Mark recommendation as viewed
  const markRecommendationAsViewed = useCallback(async (recommendationId: string) => {
    try {
      await apiCall('/api/peers', {
        method: 'PATCH',
        body: JSON.stringify({
          action: 'mark_recommendation_viewed',
          recommendationId
        })
      })

      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec._id === recommendationId 
            ? { ...rec, isViewed: true }
            : rec
        )
      )
    } catch (err) {
      console.error('Error marking recommendation as viewed:', err)
    }
  }, [apiCall])

  // Mark recommendation as actioned
  const markRecommendationAsActioned = useCallback(async (recommendationId: string) => {
    try {
      await apiCall('/api/peers', {
        method: 'PATCH',
        body: JSON.stringify({
          action: 'mark_recommendation_actioned',
          recommendationId
        })
      })

      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec._id === recommendationId 
            ? { ...rec, isActioned: true }
            : rec
        )
      )
    } catch (err) {
      console.error('Error marking recommendation as actioned:', err)
    }
  }, [apiCall])

  // Delete recommendation
  const deleteRecommendation = useCallback(async (recommendationId: string) => {
    try {
      await apiCall('/api/peers', {
        method: 'DELETE',
        body: JSON.stringify({
          action: 'delete_recommendation',
          recommendationId
        })
      })

      // Update local state
      setRecommendations(prev => 
        prev.filter(rec => rec._id !== recommendationId)
      )
    } catch (err) {
      console.error('Error deleting recommendation:', err)
    }
  }, [apiCall])

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<PeerSettings>) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'PATCH',
        body: JSON.stringify({
          action: 'update_settings',
          settings: newSettings
        })
      })

      // Update local state
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      
      return data
    } catch (err) {
      console.error('Error updating settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  // Log activity (for current user)
  const logActivity = useCallback(async (activity: Omit<PeerActivity, '_id' | 'createdAt'>) => {
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: 'log_activity',
          ...activity
        })
      })

      // Refresh activity feed
      await getActivityFeed()
      
      return data
    } catch (err) {
      console.error('Error logging activity:', err)
      throw err
    }
  }, [apiCall, getActivityFeed])

  // Generate new recommendations
  const generateRecommendations = useCallback(async (limit = 10) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiCall('/api/peers', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_recommendations',
          limit
        })
      })

      // Refresh recommendations
      await getRecommendations()
      
      return data
    } catch (err) {
      console.error('Error generating recommendations:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, getRecommendations])

  return {
    // Data
    connections,
    recommendations,
    pendingRequests,
    activityFeed,
    stats,
    settings,
    loading,
    error,

    // Actions
    getConnections,
    getRecommendations,
    getPendingRequests,
    getActivityFeed,
    getStats,
    getSettings,
    searchPeers,
    sendFriendRequest,
    respondToFriendRequest,
    blockPeer,
    removeConnection,
    markRecommendationAsViewed,
    markRecommendationAsActioned,
    deleteRecommendation,
    updateSettings,
    logActivity,
    generateRecommendations,

    // Utility
    clearError: () => setError(null)
  }
}

// Individual hooks for specific data
export function usePeerConnections() {
  const { connections, loading, error, getConnections, ...rest } = usePeerDiscovery()
  
  useEffect(() => {
    getConnections()
  }, [getConnections])

  return { connections, loading, error, refetch: getConnections, ...rest }
}

export function usePeerRecommendations() {
  const { recommendations, loading, error, getRecommendations, markRecommendationAsViewed, markRecommendationAsActioned, deleteRecommendation, generateRecommendations, ...rest } = usePeerDiscovery()
  
  useEffect(() => {
    getRecommendations()
  }, [getRecommendations])

  return { 
    recommendations, 
    loading, 
    error, 
    refetch: getRecommendations,
    markAsViewed: markRecommendationAsViewed,
    markAsActioned: markRecommendationAsActioned,
    delete: deleteRecommendation,
    generate: generateRecommendations,
    ...rest 
  }
}

export function usePeerActivityFeed() {
  const { activityFeed, loading, error, getActivityFeed, logActivity, ...rest } = usePeerDiscovery()
  
  useEffect(() => {
    getActivityFeed()
  }, [getActivityFeed])

  const loadMore = useCallback((before?: string) => {
    getActivityFeed(before)
  }, [getActivityFeed])

  return { 
    activityFeed, 
    loading, 
    error, 
    refetch: getActivityFeed,
    loadMore,
    logActivity,
    ...rest 
  }
}

export function usePeerStats() {
  const { stats, loading, error, getStats, ...rest } = usePeerDiscovery()
  
  useEffect(() => {
    getStats()
  }, [getStats])

  return { stats, loading, error, refetch: getStats, ...rest }
}

export function usePeerSettings() {
  const { settings, loading, error, getSettings, updateSettings, ...rest } = usePeerDiscovery()
  
  useEffect(() => {
    getSettings()
  }, [getSettings])

  return { settings, loading, error, refetch: getSettings, update: updateSettings, ...rest }
}

export function usePeerSearch() {
  const { searchPeers, loading, error, ...rest } = usePeerDiscovery()
  
  const search = useCallback(async (query: string, filters?: {
    level?: string
    school?: string
    course?: string
    onlyAvailable?: boolean
  }) => {
    return await searchPeers(query, filters)
  }, [searchPeers])

  return { search, loading, error, ...rest }
}
