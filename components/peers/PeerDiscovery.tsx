'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  UserPlus, 
  Clock, 
  TrendingUp, 
  Settings,
  BookOpen,
  GraduationCap,
  MapPin
} from 'lucide-react'

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

export default function PeerDiscovery() {
  const [activeTab, setActiveTab] = useState('connections')
  const [connections, setConnections] = useState<Peer[]>([])
  const [recommendations, setRecommendations] = useState<PeerRecommendation[]>([])
  const [pendingRequests, setPendingRequests] = useState<{ sent: Peer[], received: Peer[] }>({ sent: [], received: [] })
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [stats, setStats] = useState<PeerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    level: '',
    school: '',
    course: '',
    onlyAvailable: false
  })

  // Fetch data based on active tab
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = '/api/peers?'
      
      switch (activeTab) {
        case 'connections':
          url += 'type=connections'
          break
        case 'recommendations':
          url += 'type=recommendations'
          break
        case 'pending':
          url += 'type=pending'
          break
        case 'stats':
          url += 'type=stats'
          break
        default:
          url += 'type=connections'
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        
        switch (activeTab) {
          case 'connections':
            setConnections(data.connections || [])
            break
          case 'recommendations':
            setRecommendations(data.recommendations || [])
            break
          case 'pending':
            setPendingRequests(data.pending || { sent: [], received: [] })
            break
          case 'stats':
            setStats(data.stats)
            break
        }
      }
    } catch (error) {
      console.error('Error fetching peer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'search',
        query: searchQuery,
        ...(searchFilters.level && { level: searchFilters.level }),
        ...(searchFilters.school && { school: searchFilters.school }),
        ...(searchFilters.course && { course: searchFilters.course }),
        ...(searchFilters.onlyAvailable && { onlyAvailable: 'true' })
      })

      const response = await fetch(`/api/peers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.peers || [])
      }
    } catch (error) {
      console.error('Error searching peers:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async (peerId: string, message?: string) => {
    try {
      const response = await fetch('/api/peers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_request',
          peerId,
          message: message || 'Hi! I\'d like to connect with you.'
        })
      })

      if (response.ok) {
        fetchData() // Refresh data
        // Show success message
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const respondToRequest = async (requesterId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/peers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: `${action}_request`,
          peerId: requesterId,
          requesterId
        })
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error responding to request:', error)
    }
  }

  const markRecommendationAsViewed = async (recommendationId: string) => {
    try {
      await fetch('/api/peers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_recommendation_viewed',
          recommendationId
        })
      })
    } catch (error) {
      console.error('Error marking recommendation as viewed:', error)
    }
  }

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'similar_level': return 'bg-blue-100 text-blue-800'
      case 'school_mate': return 'bg-green-100 text-green-800'
      case 'high_activity': return 'bg-purple-100 text-purple-800'
      case 'shared_course': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'similar_level': return <GraduationCap className="h-4 w-4" />
      case 'school_mate': return <MapPin className="h-4 w-4" />
      case 'high_activity': return <TrendingUp className="h-4 w-4" />
      case 'shared_course': return <BookOpen className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Peer Discovery</h1>
          <p className="text-muted-foreground">Connect with other learners and expand your network</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Peers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={searchFilters.level} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, level: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Education Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            <Select value={searchFilters.school} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, school: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Schools</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="online">Online Learning</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Search Results</h3>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.level && <Badge variant="secondary" className="text-xs">{user.level}</Badge>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => sendFriendRequest(user.id)}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection._id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {connection.peerId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">User {connection.peerId}</p>
                        <p className="text-sm text-muted-foreground">
                          Connected {new Date(connection.respondedAt || connection.requestedAt).toLocaleDateString()}
                        </p>
                        <Badge variant={connection.status === 'accepted' ? 'default' : 'secondary'}>
                          {connection.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Message</Button>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {connections.length === 0 && !loading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Connections Yet</h3>
                  <p className="text-muted-foreground">Start connecting with peers to build your learning network!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation._id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {recommendation.recommendedPeerId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">User {recommendation.recommendedPeerId}</p>
                          <Badge className={getRecommendationTypeColor(recommendation.recommendationType)}>
                            <div className="flex items-center gap-1">
                              {getRecommendationTypeIcon(recommendation.recommendationType)}
                              {recommendation.recommendationType.replace('_', ' ')}
                            </div>
                          </Badge>
                          <Badge variant="outline">Score: {recommendation.score}</Badge>
                        </div>
                        <div className="space-y-1">
                          {recommendation.reasons.map((reason, index) => (
                            <p key={index} className="text-sm text-muted-foreground">• {reason}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => sendFriendRequest(recommendation.recommendedPeerId)}
                        onMouseEnter={() => markRecommendationAsViewed(recommendation._id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recommendations.length === 0 && !loading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Recommendations Available</h3>
                  <p className="text-muted-foreground">Complete your profile and engage in activities to get personalized recommendations!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-6">
            {/* Sent Requests */}
            <div>
              <h3 className="font-semibold mb-3">Sent Requests</h3>
              <div className="grid gap-3">
                {pendingRequests.sent.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.peerId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User {request.peerId}</p>
                            <p className="text-sm text-muted-foreground">
                              Sent {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingRequests.sent.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No sent requests</p>
                )}
              </div>
            </div>

            {/* Received Requests */}
            <div>
              <h3 className="font-semibold mb-3">Received Requests</h3>
              <div className="grid gap-3">
                {pendingRequests.received.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User {request.userId}</p>
                            <p className="text-sm text-muted-foreground">
                              Received {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                            {request.metadata?.requestMessage && (
                              <p className="text-sm mt-1">"{request.metadata.requestMessage}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => respondToRequest(request.userId, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => respondToRequest(request.userId, 'decline')}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingRequests.received.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No received requests</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          {stats ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Connections</p>
                      <p className="text-2xl font-bold">{stats.totalConnections}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                      <p className="text-2xl font-bold">{stats.activeConnections}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                      <p className="text-2xl font-bold">{stats.newConnectionsThisMonth}</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Activity Score</p>
                      <p className="text-2xl font-bold">{stats.activityScore}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Influence Score</p>
                      <p className="text-2xl font-bold">{stats.influenceScore}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Connection Rate</p>
                      <p className="text-2xl font-bold">{stats.connectionRate}%</p>
                    </div>
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Statistics Available</h3>
                <p className="text-muted-foreground">Start connecting with peers to see your network statistics!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
