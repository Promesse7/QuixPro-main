import { ObjectId } from 'mongodb'

export interface Peer {
  _id?: ObjectId
  userId: string                    // The user who owns this peer record
  peerId: string                   // The peer user ID
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  requestedBy: string              // Who initiated the connection
  requestedAt: Date                // When the request was sent
  respondedAt?: Date               // When the request was responded to
  lastInteractionAt?: Date         // Last meaningful interaction
  mutualConnections?: number        // Number of mutual connections
  sharedInterests?: string[]       // Shared courses/subjects
  compatibilityScore?: number      // AI-calculated compatibility (0-100)
  metadata?: {
    requestMessage?: string        // Message sent with friend request
    responseMessage?: string       // Response to friend request
    tags?: string[]             // How they know each other
    notes?: string              // Private notes about this peer
  }
}

export interface PeerActivity {
  _id?: ObjectId
  userId: string                    // User who performed the activity
  activityType: 'quiz_completed' | 'certificate_earned' | 'streak_achieved' | 
                  'group_joined' | 'question_answered' | 'achievement_unlocked' |
                  'course_started' | 'level_completed' | 'peer_connected'
  entityId?: string                 // Related entity ID (quiz, course, etc.)
  entityType?: 'quiz' | 'course' | 'group' | 'certificate' | 'achievement'
  title: string                   // Activity title
  description?: string             // Detailed description
  score?: number                  // Score achieved (if applicable)
  data?: Record<string, any>      // Additional activity-specific data
  isPublic: boolean               // Whether this activity is visible to peers
  createdAt: Date                 // When the activity occurred
  visibility?: {
    peers: boolean              // Visible to peers
    public: boolean             // Visible to everyone
    school: boolean             // Visible to school mates
    level: boolean              // Visible to same level
  }
}

export interface PeerRecommendation {
  _id?: ObjectId
  userId: string                    // User receiving recommendations
  recommendedPeerId: string        // User being recommended
  recommendationType: 'similar_level' | 'shared_course' | 'mutual_friends' | 
                          'high_activity' | 'ai_match' | 'school_mate'
  score: number                   // Recommendation strength (0-100)
  reasons: string[]               // Why this user is recommended
  metadata: {
    sharedCourses?: string[]
    mutualFriends?: string[]
    schoolMatch?: boolean
    levelMatch?: boolean
    interestOverlap?: number
    activityScore?: number
  }
  isViewed: boolean               // Whether user has seen this recommendation
  isActioned: boolean             // Whether user has acted on this recommendation
  createdAt: Date
  expiresAt?: Date               // When recommendation expires
}

export interface PeerStats {
  _id?: ObjectId
  userId: string
  totalConnections: number          // Total peer connections
  activeConnections: number        // Active connections (last 30 days)
  newConnectionsThisMonth: number // New connections this month
  averageResponseTime: number      // Average response time to requests (hours)
  connectionRate: number          // Acceptance rate for requests (0-100)
  activityScore: number           // Overall activity score (0-100)
  influenceScore: number          // Influence based on peer network
  lastUpdated: Date
  breakdown: {
    byLevel: Record<string, number>    // Connections by education level
    byCourse: Record<string, number>    // Connections by course
    bySchool: Record<string, number>    // Connections by school
    byInterest: Record<string, number>  // Connections by interest
  }
}

export interface PeerSettings {
  _id?: ObjectId
  userId: string
  allowFriendRequests: boolean     // Allow others to send friend requests
  showActivityToPeers: boolean    // Show activity to connected peers
  showActivityToPublic: boolean   // Show activity to everyone
  allowRecommendations: boolean    // Allow AI-powered recommendations
  notificationPreferences: {
    newFriendRequest: boolean
    friendAccepted: boolean
    peerActivity: boolean
    newRecommendations: boolean
  }
  privacySettings: {
    profileVisibility: 'public' | 'peers' | 'private'
    activityVisibility: 'public' | 'peers' | 'private'
    allowSearch: boolean
    showOnlineStatus: boolean
  }
  discoverySettings: {
    enableAIRecommendations: boolean
    recommendationTypes: string[]
    maxRecommendations: number
    updateFrequency: 'realtime' | 'daily' | 'weekly'
  }
}
