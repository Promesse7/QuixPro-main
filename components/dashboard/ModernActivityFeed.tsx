"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Users, 
  MessageSquare, 
  Star, 
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Zap,
  Flame
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: 'achievement' | 'quiz' | 'course' | 'social' | 'milestone' | 'streak'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar: string
    level: string
  }
  metadata?: {
    score?: number
    points?: number
    duration?: string
    difficulty?: string
    participants?: number
  }
  actions?: {
    likes?: number
    comments?: number
    shares?: number
  }
  isBookmarked?: boolean
}

interface ModernActivityFeedProps {
  activities?: Activity[]
  user?: {
    name: string
    avatar: string
    level: string
  }
}

export function ModernActivityFeed({ 
  activities = [], 
  user = { name: "User", avatar: "", level: "Beginner" }
}: ModernActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'achievements' | 'quizzes' | 'social'>('all')
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set())

  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Quiz Master Achievement Unlocked!',
      description: 'You completed 10 quizzes with an average score of 85%. Keep up the great work!',
      timestamp: '2 hours ago',
      metadata: {
        points: 500,
        score: 85
      },
      actions: {
        likes: 12,
        comments: 3,
        shares: 1
      }
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Completed Advanced Mathematics Quiz',
      description: 'Scored 92% on the Calculus Fundamentals quiz. Excellent performance!',
      timestamp: '5 hours ago',
      metadata: {
        score: 92,
        points: 150,
        duration: '25 min',
        difficulty: 'Advanced'
      },
      actions: {
        likes: 8,
        comments: 2
      }
    },
    {
      id: '3',
      type: 'milestone',
      title: '7-Day Learning Streak! 🔥',
      description: 'You\'ve been learning consistently for a week straight. Your dedication is inspiring!',
      timestamp: '1 day ago',
      metadata: {
        points: 350
      },
      actions: {
        likes: 24,
        comments: 5,
        shares: 3
      }
    },
    {
      id: '4',
      type: 'social',
      title: 'Joined Physics Study Group',
      description: 'Connected with 24 other learners in the Advanced Physics community.',
      timestamp: '2 days ago',
      user: {
        name: 'Dr. Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        level: 'Expert'
      },
      metadata: {
        participants: 24
      },
      actions: {
        likes: 6,
        comments: 1
      }
    },
    {
      id: '5',
      type: 'course',
      title: 'Started Web Development Bootcamp',
      description: 'Beginning your journey into modern web development. First lesson completed!',
      timestamp: '3 days ago',
      metadata: {
        points: 100,
        duration: '45 min'
      },
      actions: {
        likes: 15,
        comments: 4
      }
    }
  ]

  const displayActivities = activities.length > 0 ? activities : defaultActivities

  const filteredActivities = displayActivities.filter(activity => {
    if (filter === 'all') return true
    if (filter === 'achievements') return activity.type === 'achievement' || activity.type === 'milestone'
    if (filter === 'quizzes') return activity.type === 'quiz' || activity.type === 'course'
    if (filter === 'social') return activity.type === 'social'
    return true
  })

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'quiz':
        return <Target className="w-5 h-5 text-blue-500" />
      case 'course':
        return <BookOpen className="w-5 h-5 text-green-500" />
      case 'social':
        return <Users className="w-5 h-5 text-purple-500" />
      case 'milestone':
        return <Award className="w-5 h-5 text-indigo-500" />
      case 'streak':
        return <Flame className="w-5 h-5 text-orange-500" />
      default:
        return <Star className="w-5 h-5 text-gray-500" />
    }
  }

  const getActivityGradient = (type: Activity['type']) => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-200/50'
      case 'quiz':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-200/50'
      case 'course':
        return 'from-green-500/20 to-emerald-500/20 border-green-200/50'
      case 'social':
        return 'from-purple-500/20 to-pink-500/20 border-purple-200/50'
      case 'milestone':
        return 'from-indigo-500/20 to-blue-500/20 border-indigo-200/50'
      case 'streak':
        return 'from-orange-500/20 to-red-500/20 border-orange-200/50'
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-200/50'
    }
  }

  const toggleBookmark = (activityId: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  const ActivityCard = ({ activity, index }: { activity: Activity, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn(
        "group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20",
        bookmarkedItems.has(activity.id) && "ring-2 ring-primary/20"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "p-2.5 rounded-xl bg-gradient-to-br border",
              getActivityGradient(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground leading-tight mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleBookmark(activity.id)}
                >
                  <Bookmark 
                    className={cn(
                      "w-4 h-4 transition-colors",
                      bookmarkedItems.has(activity.id) 
                        ? "text-primary fill-primary" 
                        : "text-muted-foreground hover:text-primary"
                    )} 
                  />
                </Button>
              </div>

              {/* Metadata */}
              {activity.metadata && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {activity.metadata.score && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {activity.metadata.score}% Score
                    </Badge>
                  )}
                  {activity.metadata.points && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {activity.metadata.points} pts
                    </Badge>
                  )}
                  {activity.metadata.duration && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.metadata.duration}
                    </Badge>
                  )}
                  {activity.metadata.difficulty && (
                    <Badge variant="secondary" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {activity.metadata.difficulty}
                    </Badge>
                  )}
                  {activity.metadata.participants && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {activity.metadata.participants} members
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {/* User info or timestamp */}
            <div className="flex items-center gap-2">
              {activity.user ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">{activity.user.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{activity.timestamp}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {activity.actions && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                  <Heart className="w-3 h-3 mr-1" />
                  {activity.actions.likes}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {activity.actions.comments}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                  <Share2 className="w-3 h-3 mr-1" />
                  {activity.actions.shares || 0}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Activity Feed</h2>
          <p className="text-sm text-muted-foreground">Your learning journey in real-time</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <MoreHorizontal className="w-4 h-4" />
          View All
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border/30">
        {[
          { id: 'all', label: 'All Activity', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
          { id: 'quizzes', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "flex-1 gap-2 rounded-lg transition-all duration-200",
              filter === tab.id 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="gap-2">
            Load More Activities
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No activities yet</h3>
          <p className="text-muted-foreground">Start learning to see your activities here</p>
        </div>
      )}
    </div>
  )
}
