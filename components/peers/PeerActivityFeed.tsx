'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Clock, 
  Star,
  Award,
  Target,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'

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
  avatar?: string
  level?: string
}

export default function PeerActivityFeed() {
  const [activities, setActivities] = useState<PeerActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async (before?: string) => {
    setLoading(true)
    try {
      let url = '/api/peers?type=activity_feed&limit=20'
      if (before) {
        url += `&before=${before}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (before) {
          setActivities(prev => [...prev, ...data.activities])
        } else {
          setActivities(data.activities || [])
        }
        setHasMore(data.activities?.length === 20)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'quiz_completed':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'course_started':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'assignment_submitted':
        return <Target className="h-4 w-4 text-green-500" />
      case 'study_session':
        return <Clock className="h-4 w-4 text-purple-500" />
      case 'friend_request_sent':
      case 'friend_request_accepted':
        return <Users className="h-4 w-4 text-indigo-500" />
      case 'achievement_unlocked':
        return <Award className="h-4 w-4 text-orange-500" />
      case 'milestone_reached':
        return <Star className="h-4 w-4 text-pink-500" />
      default:
        return <Heart className="h-4 w-4 text-red-500" />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'quiz_completed': return 'bg-yellow-50 border-yellow-200'
      case 'course_started': return 'bg-blue-50 border-blue-200'
      case 'assignment_submitted': return 'bg-green-50 border-green-200'
      case 'study_session': return 'bg-purple-50 border-purple-200'
      case 'friend_request_sent':
      case 'friend_request_accepted': return 'bg-indigo-50 border-indigo-200'
      case 'achievement_unlocked': return 'bg-orange-50 border-orange-200'
      case 'milestone_reached': return 'bg-pink-50 border-pink-200'
      default: return 'bg-gray-50 border-gray-200'
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

  const getActivityDetails = (activity: PeerActivity) => {
    const { activityType, metadata } = activity

    switch (activityType) {
      case 'quiz_completed':
        return (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Score:</span>
              <Badge variant="secondary">{metadata?.score || 0}%</Badge>
            </div>
            {metadata?.quizId && (
              <p className="text-sm text-muted-foreground">Quiz: {metadata.quizId}</p>
            )}
          </div>
        )
      case 'course_started':
        return (
          <div className="mt-2">
            {metadata?.courseName && (
              <p className="text-sm text-muted-foreground">Course: {metadata.courseName}</p>
            )}
          </div>
        )
      case 'assignment_submitted':
        return (
          <div className="mt-2">
            {metadata?.assignmentTitle && (
              <p className="text-sm text-muted-foreground">Assignment: {metadata.assignmentTitle}</p>
            )}
          </div>
        )
      case 'study_session':
        return (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Duration:</span>
              <span>{Math.floor((metadata?.timeSpent || 0) / 60)} minutes</span>
            </div>
            {metadata?.subject && (
              <p className="text-sm text-muted-foreground">Subject: {metadata.subject}</p>
            )}
          </div>
        )
      case 'achievement_unlocked':
        return (
          <div className="mt-2">
            {metadata?.achievementName && (
              <p className="text-sm text-muted-foreground">Achievement: {metadata.achievementName}</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const loadMore = () => {
    if (hasMore && activities.length > 0) {
      const lastActivity = activities[activities.length - 1]
      fetchActivities(lastActivity.createdAt)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Peer Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className={`p-4 rounded-lg border ${getActivityColor(activity.activityType)}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {activity.userId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">User {activity.userId}</span>
                      <div className="flex items-center gap-1">
                        {getActivityIcon(activity.activityType)}
                        <Badge variant="outline" className="text-xs">
                          {activity.activityType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm">{activity.description}</p>
                    
                    {getActivityDetails(activity)}
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && !loading && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Activity Yet</h3>
                <p className="text-muted-foreground">
                  Connect with peers to see their learning activities!
                </p>
              </div>
            )}

            {hasMore && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
