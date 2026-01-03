# Peer Discovery System Documentation

## Overview

The Peer Discovery System enables users to find, connect with, and interact with other learners in the Quix platform. It provides intelligent recommendations, activity feeds, and comprehensive peer management features.

## Architecture

### Data Models

#### Peer
Represents a connection between two users:
- `userId`: Current user ID
- `peerId`: Connected user ID  
- `status`: `pending` | `accepted` | `declined` | `blocked`
- `requestedBy`: Who initiated the connection
- `requestedAt`: When request was sent
- `respondedAt`: When request was responded to
- `lastInteractionAt`: Last activity timestamp
- `metadata`: Additional data (messages, etc.)

#### PeerActivity
Tracks user activities visible to peers:
- `userId`: User who performed the activity
- `activityType`: Type of activity
- `description`: Human-readable description
- `isPublic`: Visibility setting
- `metadata`: Activity-specific data

#### PeerRecommendation
AI-generated peer suggestions:
- `userId`: Target user
- `recommendedPeerId`: Suggested peer
- `recommendationType`: How they were suggested
- `score`: Confidence score (0-100)
- `reasons`: Why they were suggested
- `expiresAt`: When recommendation expires

#### PeerStats
User's peer network statistics:
- `totalConnections`: Number of connections
- `activeConnections`: Recently active connections
- `activityScore`: User's activity level
- `influenceScore`: Network influence metric

#### PeerSettings
User preferences for peer discovery:
- `profileVisibility`: Who can see profile
- `allowRecommendations`: Enable/disable suggestions
- `showActivityStatus`: Display activity status

### Service Layer

The `PeerService` class provides all peer-related operations:

#### Connection Management
- `sendFriendRequest()` - Send connection request
- `respondToFriendRequest()` - Accept/decline requests
- `getPeerConnections()` - Get user's connections
- `getPendingRequests()` - Get pending requests
- `blockPeer()` - Block a user
- `removePeerConnection()` - Remove connection

#### Activity Management
- `logPeerActivity()` - Record user activity
- `getPeerActivityFeed()` - Get activity feed
- `getUserActivities()` - Get user's activities

#### Recommendations
- `generatePeerRecommendations()` - Create suggestions
- `getRecommendations()` - Get user's recommendations
- `markRecommendationAsViewed()` - Mark as seen
- `markRecommendationAsActioned()` - Mark as acted upon

#### Search & Discovery
- `searchPeers()` - Search for users
- `updatePeerSettings()` - Update preferences
- `getPeerStats()` - Get statistics

## API Endpoints

### GET /api/peers
Retrieve peer data based on query parameters.

**Query Parameters:**
- `type`: `connections` | `recommendations` | `search` | `pending` | `stats`
- `query`: Search query (for search type)
- `limit`: Number of results (default: 20)
- `level`: Filter by education level
- `school`: Filter by school
- `course`: Filter by course

**Examples:**
```typescript
// Get user's connections
GET /api/peers?type=connections&limit=10

// Get recommendations
GET /api/peers?type=recommendations

// Search for peers
GET /api/peers?type=search&query=john&level=undergraduate

// Get pending requests
GET /api/peers?type=pending

// Get peer statistics
GET /api/peers?type=stats
```

### POST /api/peers
Manage peer connections and interactions.

**Request Body:**
```typescript
{
  action: 'send_request' | 'accept_request' | 'decline_request' | 'block_peer' | 'remove_connection',
  peerId: string,
  message?: string,
  requesterId?: string // for accept/decline
}
```

**Examples:**
```typescript
// Send friend request
POST /api/peers
{
  "action": "send_request",
  "peerId": "user123",
  "message": "Hi! I'd like to connect."
}

// Accept request
POST /api/peers
{
  "action": "accept_request",
  "peerId": "user456",
  "requesterId": "user123",
  "message": "Great to connect!"
}
```

### PATCH /api/peers
Update peer settings and recommendation status.

**Request Body:**
```typescript
{
  action: 'mark_recommendation_viewed' | 'mark_recommendation_actioned' | 'update_settings',
  recommendationId?: string,
  settings?: PeerSettings
}
```

**Examples:**
```typescript
// Mark recommendation as viewed
PATCH /api/peers
{
  "action": "mark_recommendation_viewed",
  "recommendationId": "rec123"
}

// Update settings
PATCH /api/peers
{
  "action": "update_settings",
  "settings": {
    "profileVisibility": "public",
    "allowRecommendations": true
  }
}
```

### DELETE /api/peers
Remove peer connections or recommendations.

**Query Parameters:**
- `peerId`: Remove connection with this peer
- `recommendationId`: Remove this recommendation

**Examples:**
```typescript
// Remove connection
DELETE /api/peers?peerId=user123

// Remove recommendation
DELETE /api/peers?recommendationId=rec456
```

## Recommendation Algorithm

The system generates recommendations using multiple strategies:

### 1. Similar Level Matching
- Users at same education level
- Similar curriculum and courses
- Weight: +20 points

### 2. School Mates
- Users from same school
- Geographic proximity
- Weight: +25 points

### 3. Shared Courses
- Users with common course history
- Academic interests alignment
- Weight: +30 points

### 4. High Activity Users
- Users with high activity scores
- Engaged learners
- Weight: +15 points

### Score Calculation
```typescript
baseScore = 50
+ typeWeight (15-30)
+ randomVariation (0-10)
finalScore = min(100, round(baseScore + typeWeight + randomVariation))
```

## Activity Types

The system tracks various user activities:

### Academic Activities
- `quiz_completed` - Finished a quiz
- `course_started` - Began new course
- `assignment_submitted` - Turned in assignment
- `study_session` - Study period completed

### Social Activities
- `friend_request_sent` - Sent connection request
- `friend_request_accepted` - Accepted connection
- `profile_updated` - Updated profile information
- `achievement_unlocked` - Earned badge/achievement

### System Activities
- `login` - User logged in
- `milestone_reached` - Reached learning milestone
- `streak_maintained` - Maintained learning streak

## Privacy & Security

### Visibility Controls
- `public`: Everyone can see
- `peers_only`: Only connected peers
- `private`: Only user can see

### Data Protection
- All recommendations expire after 7 days
- Blocked users cannot interact
- Activity logs respect privacy settings
- Search respects visibility preferences

### Rate Limiting
- Friend requests: 10 per hour
- Search queries: 100 per hour
- Recommendation generation: 1 per hour

## Database Schema

### Collections & Indexes

#### peers
```javascript
{ userId: 1, peerId: 1 } // unique
{ userId: 1, status: 1 }
{ peerId: 1, status: 1 }
{ requestedBy: 1, status: 1 }
{ requestedAt: -1 }
{ compatibilityScore: -1 }
```

#### peerActivities
```javascript
{ userId: 1, createdAt: -1 }
{ activityType: 1, createdAt: -1 }
{ isPublic: 1, createdAt: -1 }
{ 'visibility.peers': 1, createdAt: -1 }
```

#### peerRecommendations
```javascript
{ userId: 1, score: -1 }
{ userId: 1, isViewed: 1 }
{ userId: 1, isActioned: 1 }
{ expiresAt: 1 } // TTL
```

#### peerStats
```javascript
{ userId: 1 } // unique
{ activityScore: -1 }
{ influenceScore: -1 }
```

#### peerSettings
```javascript
{ userId: 1 } // unique
```

## Testing

### Running Tests
```bash
# Test peer service functionality
npx ts-node scripts/test-peer-discovery.ts

# Test API endpoints (requires running server)
npm run dev
# Then run the test script
```

### Test Coverage
- ✅ Friend requests and responses
- ✅ Connection management
- ✅ Activity logging and feeds
- ✅ Recommendation generation
- ✅ Peer search
- ✅ Settings management
- ✅ Statistics tracking
- ✅ API endpoint functionality

## Frontend Integration

### React Components
- `PeerDiscovery` - Main discovery interface
- `PeerList` - Display peer connections
- `Recommendations` - Show suggestions
- `ActivityFeed` - Display peer activities
- `PeerSearch` - Search interface
- `ConnectionRequests` - Manage pending requests

### State Management
```typescript
// Redux slice example
interface PeerState {
  connections: Peer[]
  recommendations: PeerRecommendation[]
  pendingRequests: { sent: Peer[], received: Peer[] }
  activityFeed: PeerActivity[]
  stats: PeerStats | null
  settings: PeerSettings | null
}
```

### Example Usage
```typescript
// Get user's connections
const { data: connections } = useQuery({
  queryKey: ['peer-connections'],
  queryFn: () => fetch('/api/peers?type=connections').then(r => r.json())
})

// Send friend request
const sendRequest = useMutation({
  mutationFn: (peerId: string) => 
    fetch('/api/peers', {
      method: 'POST',
      body: JSON.stringify({
        action: 'send_request',
        peerId,
        message: 'Hi! I\'d like to connect.'
      })
    }).then(r => r.json())
})
```

## Performance Considerations

### Optimization Strategies
- Database indexes for common queries
- Pagination for large result sets
- Caching for recommendation results
- Background job for stats updates
- Lazy loading for activity feeds

### Monitoring
- Track API response times
- Monitor recommendation accuracy
- Watch database query performance
- Log user engagement metrics

## Future Enhancements

### Planned Features
- Machine learning recommendations
- Interest-based matching
- Study group formation
- Mentorship connections
- Collaborative learning tools

### API v2 Considerations
- GraphQL support
- Real-time subscriptions
- Advanced filtering
- Bulk operations
- Analytics endpoints

## Troubleshooting

### Common Issues
1. **Recommendations not showing** - Check user has activity data
2. **Connection requests failing** - Verify user IDs are valid
3. **Search returning empty** - Check search parameters and visibility
4. **Activity feed not updating** - Ensure activities are marked as public

### Debug Commands
```javascript
// Check user's peer stats
db.peerStats.findOne({ userId: "user123" })

// View pending requests
db.peers.find({ status: "pending", userId: "user123" })

// Check recent activities
db.peerActivities.find({ userId: "user123" }).sort({ createdAt: -1 }).limit(10)
```

---

## Summary

The Peer Discovery System provides a comprehensive solution for connecting learners through intelligent recommendations, activity tracking, and robust connection management. The modular architecture allows for easy extension and customization while maintaining high performance and user privacy.
