'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  UserPlus, 
  MessageCircle, 
  Eye, 
  Users,
  GraduationCap,
  MapPin,
  TrendingUp,
  BookOpen
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  level?: string
  school?: string
  avatar?: string
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

interface PeerCardProps {
  user?: User
  peer?: Peer
  recommendation?: PeerRecommendation
  onConnect?: (userId: string) => void
  onMessage?: (userId: string) => void
  onViewProfile?: (userId: string) => void
  onAcceptRequest?: (userId: string) => void
  onDeclineRequest?: (userId: string) => void
  showActions?: boolean
  compact?: boolean
}

export default function PeerCard({
  user,
  peer,
  recommendation,
  onConnect,
  onMessage,
  onViewProfile,
  onAcceptRequest,
  onDeclineRequest,
  showActions = true,
  compact = false
}: PeerCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'blocked': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Determine the user ID and display name
  const userId = user?.id || peer?.peerId || recommendation?.recommendedPeerId || ''
  const displayName = user?.name || `User ${userId}`
  const avatar = user?.avatar
  const level = user?.level
  const school = user?.school

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{displayName}</p>
          <div className="flex items-center gap-2">
            {level && <Badge variant="secondary" className="text-xs">{level}</Badge>}
            {peer && <Badge className={getStatusColor(peer.status)}>{peer.status}</Badge>}
            {recommendation && (
              <Badge className={getRecommendationTypeColor(recommendation.recommendationType)}>
                {recommendation.recommendationType.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {recommendation && onConnect && (
              <Button size="sm" onClick={() => onConnect(userId)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Connect
              </Button>
            )}
            {peer?.status === 'accepted' && onMessage && (
              <Button variant="outline" size="sm" onClick={() => onMessage(userId)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            )}
            {peer?.status === 'pending' && peer.requestedBy !== userId && (
              <div className="flex gap-1">
                {onAcceptRequest && (
                  <Button size="sm" onClick={() => onAcceptRequest(userId)}>
                    Accept
                  </Button>
                )}
                {onDeclineRequest && (
                  <Button variant="outline" size="sm" onClick={() => onDeclineRequest(userId)}>
                    Decline
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-lg">{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{displayName}</h3>
              {level && <Badge variant="secondary">{level}</Badge>}
              {school && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {school}
                </div>
              )}
            </div>

            {/* Recommendation Details */}
            {recommendation && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
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
            )}

            {/* Peer Connection Details */}
            {peer && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(peer.status)}>
                    {peer.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {peer.requestedBy === userId ? 'You sent' : 'You received'} {formatTimeAgo(peer.requestedAt)}
                  </span>
                </div>
                
                {peer.metadata?.requestMessage && (
                  <p className="text-sm italic text-muted-foreground">
                    "{peer.metadata.requestMessage}"
                  </p>
                )}
                
                {peer.lastInteractionAt && (
                  <p className="text-xs text-muted-foreground">
                    Last interaction: {formatTimeAgo(peer.lastInteractionAt)}
                  </p>
                )}
              </div>
            )}

            {/* User Info */}
            {user && !peer && !recommendation && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {level && <p className="text-sm text-muted-foreground">Level: {level}</p>}
                {school && <p className="text-sm text-muted-foreground">School: {school}</p>}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2 pt-2 border-t">
                {recommendation && onConnect && (
                  <Button onClick={() => onConnect(userId)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
                
                {peer?.status === 'accepted' && (
                  <>
                    {onMessage && (
                      <Button variant="outline" onClick={() => onMessage(userId)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                    {onViewProfile && (
                      <Button variant="outline" onClick={() => onViewProfile(userId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    )}
                  </>
                )}
                
                {peer?.status === 'pending' && peer.requestedBy !== userId && (
                  <div className="flex gap-2">
                    {onAcceptRequest && (
                      <Button onClick={() => onAcceptRequest(userId)}>
                        Accept
                      </Button>
                    )}
                    {onDeclineRequest && (
                      <Button variant="outline" onClick={() => onDeclineRequest(userId)}>
                        Decline
                      </Button>
                    )}
                  </div>
                )}
                
                {peer?.status === 'pending' && peer.requestedBy === userId && (
                  <Badge variant="outline">Request sent</Badge>
                )}
                
                {user && !peer && !recommendation && (
                  <>
                    {onConnect && (
                      <Button onClick={() => onConnect(userId)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    {onViewProfile && (
                      <Button variant="outline" onClick={() => onViewProfile(userId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
