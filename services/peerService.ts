import { Db, Collection, ObjectId } from 'mongodb'
import { Peer, PeerActivity, PeerRecommendation, PeerStats, PeerSettings } from '@/models/Peer'
import { User } from '@/models/User'

export class PeerService {
  private db: Db

  constructor(db: Db) {
    this.db = db
  }

  // Initialize collections and indexes
  async initializeCollections() {
    // Peers collection
    const peersCollection = this.db.collection('peers')
    await peersCollection.createIndex({ userId: 1, peerId: 1 }, { unique: true })
    await peersCollection.createIndex({ userId: 1, status: 1 })
    await peersCollection.createIndex({ peerId: 1, status: 1 })
    await peersCollection.createIndex({ requestedBy: 1, status: 1 })
    await peersCollection.createIndex({ requestedAt: -1 })
    await peersCollection.createIndex({ compatibilityScore: -1 })

    // Peer activities collection
    const activitiesCollection = this.db.collection('peerActivities')
    await activitiesCollection.createIndex({ userId: 1, createdAt: -1 })
    await activitiesCollection.createIndex({ activityType: 1, createdAt: -1 })
    await activitiesCollection.createIndex({ isPublic: 1, createdAt: -1 })
    await activitiesCollection.createIndex({ 'visibility.peers': 1, createdAt: -1 })

    // Peer recommendations collection
    const recommendationsCollection = this.db.collection('peerRecommendations')
    await recommendationsCollection.createIndex({ userId: 1, score: -1 })
    await recommendationsCollection.createIndex({ userId: 1, isViewed: 1 })
    await recommendationsCollection.createIndex({ userId: 1, isActioned: 1 })
    await recommendationsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    // Peer stats collection
    const statsCollection = this.db.collection('peerStats')
    await statsCollection.createIndex({ userId: 1 }, { unique: true })
    await statsCollection.createIndex({ activityScore: -1 })
    await statsCollection.createIndex({ influenceScore: -1 })

    // Peer settings collection
    const settingsCollection = this.db.collection('peerSettings')
    await settingsCollection.createIndex({ userId: 1 }, { unique: true })
  }

  // Peer Connection Management
  async sendFriendRequest(
    userId: string,
    peerId: string,
    message?: string
  ): Promise<Peer> {
    // Check if connection already exists
    const existingConnection = await this.db.collection('peers').findOne({
      $or: [
        { userId, peerId },
        { userId: peerId, peerId: userId }
      ]
    })

    if (existingConnection) {
      throw new Error('Connection already exists')
    }

    const peerConnection: Omit<Peer, '_id'> = {
      userId,
      peerId,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date(),
      metadata: {
        requestMessage: message
      }
    }

    const result = await this.db.collection('peers').insertOne(peerConnection)
    return {
      ...peerConnection,
      _id: result.insertedId
    }
  }

  async respondToFriendRequest(
    userId: string,
    requesterId: string,
    response: 'accepted' | 'declined',
    message?: string
  ): Promise<Peer | null> {
    const peerConnection = await this.db.collection('peers').findOne({
      userId: requesterId,
      peerId: userId,
      status: 'pending'
    })

    if (!peerConnection) {
      throw new Error('Friend request not found')
    }

    const updateData: any = {
      status: response,
      respondedAt: new Date(),
      lastInteractionAt: new Date()
    }

    if (message) {
      updateData.metadata = {
        ...peerConnection.metadata,
        responseMessage: message
      }
    }

    await this.db.collection('peers').updateOne(
      { _id: peerConnection._id },
      { $set: updateData }
    )

    // Create reciprocal connection if accepted
    if (response === 'accepted') {
      const reciprocalConnection: Omit<Peer, '_id'> = {
        userId,
        peerId: requesterId,
        status: 'accepted',
        requestedBy: requesterId,
        requestedAt: peerConnection.requestedAt,
        respondedAt: new Date(),
        lastInteractionAt: new Date()
      }

      await this.db.collection('peers').insertOne(reciprocalConnection)
      
      // Update stats for both users
      await this.updatePeerStats(userId)
      await this.updatePeerStats(requesterId)
    }

    return {
      ...peerConnection,
      ...updateData
    } as Peer
  }

  async getPeerConnections(
    userId: string,
    status?: Peer['status'],
    limit = 20,
    offset = 0
  ): Promise<Peer[]> {
    const query: any = {
      $or: [
        { userId, status: status || { $ne: 'blocked' } },
        { peerId: userId, status: status || { $ne: 'blocked' } }
      ]
    }

    const result = await this.db.collection('peers')
      .find(query)
      .sort({ lastInteractionAt: -1, requestedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()

    return result as Peer[]
  }

  async getPendingRequests(userId: string): Promise<{
    sent: Peer[]
    received: Peer[]
  }> {
    const sentResult = await this.db.collection('peers')
      .find({
        userId,
        status: 'pending'
      })
      .sort({ requestedAt: -1 })
      .toArray()

    const receivedResult = await this.db.collection('peers')
      .find({
        peerId: userId,
        status: 'pending'
      })
      .sort({ requestedAt: -1 })
      .toArray()

    return { 
      sent: sentResult as Peer[],
      received: receivedResult as Peer[]
    }
  }

  async blockPeer(userId: string, peerId: string): Promise<void> {
    const session = this.db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Block existing connection
        await this.db.collection('peers').updateMany(
          {
            $or: [
              { userId, peerId },
              { userId: peerId, peerId: userId }
            ]
          },
          {
            $set: {
              status: 'blocked',
              lastInteractionAt: new Date()
            }
          }
        )
      })
    } finally {
      await session.endSession()
    }
  }

  async removePeerConnection(userId: string, peerId: string): Promise<void> {
    await this.db.collection('peers').deleteMany({
      $or: [
        { userId, peerId },
        { userId: peerId, peerId: userId }
      ]
    })

    // Update stats
    await this.updatePeerStats(userId)
    await this.updatePeerStats(peerId)
  }

  // Peer Activity Management
  async logPeerActivity(activity: Omit<PeerActivity, '_id' | 'createdAt'>): Promise<PeerActivity> {
    const peerActivity: Omit<PeerActivity, '_id'> = {
      ...activity,
      createdAt: new Date()
    }

    const result = await this.db.collection('peerActivities').insertOne(peerActivity)
    
    // Update user's activity score
    await this.updateActivityScore(activity.userId)

    return {
      ...peerActivity,
      _id: result.insertedId
    }
  }

  async getPeerActivityFeed(
    userId: string,
    limit = 20,
    before?: Date
  ): Promise<PeerActivity[]> {
    // Get user's peer connections
    const connections = await this.getPeerConnections(userId, 'accepted')
    const connectedUserIds = [
      ...connections.map(c => c.peerId),
      ...connections.map(c => c.userId)
    ]

    const query: any = {
      $or: [
        { userId: { $in: connectedUserIds } }, // Peers' activities
        { userId } // User's own activities
      ],
      isPublic: true
    }

    if (before) {
      query.createdAt = { $lt: before }
    }

    const result = await this.db.collection('peerActivities')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return result as PeerActivity[]
  }

  async getUserActivities(
    userId: string,
    limit = 20,
    before?: Date
  ): Promise<PeerActivity[]> {
    const query: any = { userId }

    if (before) {
      query.createdAt = { $lt: before }
    }

    const result = await this.db.collection('peerActivities')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return result as PeerActivity[]
  }

  // Peer Recommendations
  async generatePeerRecommendations(
    userId: string,
    limit = 10
  ): Promise<PeerRecommendation[]> {
    const user = await this.db.collection('users').findOne({ id: userId })
    if (!user) {
      throw new Error('User not found')
    }

    const recommendations: PeerRecommendation[] = []

    // 1. Similar level recommendations
    const levelMatches = await this.findSimilarLevelPeers(userId, user.level, Math.floor(limit / 4))
    recommendations.push(...levelMatches)

    // 2. Shared course recommendations
    const courseMatches = await this.findSharedCoursePeers(userId, Math.floor(limit / 4))
    recommendations.push(...courseMatches)

    // 3. School mates recommendations
    const schoolMatches = await this.findSchoolMates(userId, user.school, Math.floor(limit / 4))
    recommendations.push(...schoolMatches)

    // 4. High activity users
    const activityMatches = await this.findHighActivityPeers(userId, Math.floor(limit / 4))
    recommendations.push(...activityMatches)

    // Sort by score and limit
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  private async findSimilarLevelPeers(
    userId: string,
    userLevel: string,
    limit: number
  ): Promise<PeerRecommendation[]> {
    const similarLevelUsers = await this.db.collection('users')
      .find({
        id: { $ne: userId },
        level: userLevel
      })
      .limit(limit * 2) // Get more to filter out existing connections
      .toArray()

    return await this.createRecommendations(
      userId,
      similarLevelUsers,
      'similar_level',
      ['Same education level', 'Similar curriculum']
    )
  }

  private async findSharedCoursePeers(
    userId: string,
    limit: number
  ): Promise<PeerRecommendation[]> {
    // This would require analyzing user's course history
    // For now, return empty array
    return []
  }

  private async findSchoolMates(
    userId: string,
    school: string,
    limit: number
  ): Promise<PeerRecommendation[]> {
    if (!school) return []

    const schoolMates = await this.db.collection('users')
      .find({
        id: { $ne: userId },
        school
      })
      .limit(limit * 2)
      .toArray()

    return await this.createRecommendations(
      userId,
      schoolMates,
      'school_mate',
      ['Same school', 'Local connection']
    )
  }

  private async findHighActivityPeers(
    userId: string,
    limit: number
  ): Promise<PeerRecommendation[]> {
    const activeUsers = await this.db.collection('peerStats')
      .find({
        userId: { $ne: userId },
        activityScore: { $gte: 70 } // High activity threshold
      })
      .sort({ activityScore: -1 })
      .limit(limit * 2)
      .toArray()

    const userIds = activeUsers.map((stat: any) => stat.userId)
    const users = await this.db.collection('users')
      .find({ id: { $in: userIds } })
      .toArray()

    return await this.createRecommendations(
      userId,
      users,
      'high_activity',
      ['Very active user', 'Engaged learner']
    )
  }

  private async createRecommendations(
    userId: string,
    users: any[],
    type: PeerRecommendation['recommendationType'],
    reasons: string[]
  ): Promise<PeerRecommendation[]> {
    // Filter out existing connections
    const existingConnections = await this.getPeerConnections(userId)
    const connectedUserIds = new Set([
      ...existingConnections.map(c => c.peerId),
      ...existingConnections.map(c => c.userId)
    ])

    const recommendations: PeerRecommendation[] = []

    for (const user of users) {
      if (connectedUserIds.has(user.id)) continue

      const score = this.calculateRecommendationScore(type, user)
      
      recommendations.push({
        userId,
        recommendedPeerId: user.id,
        recommendationType: type,
        score,
        reasons,
        metadata: {
          schoolMatch: user.school,
          levelMatch: user.level
        },
        isViewed: false,
        isActioned: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      })
    }

    // Save to database
    if (recommendations.length > 0) {
      await this.db.collection('peerRecommendations').insertMany(recommendations)
    }

    return recommendations
  }

  private calculateRecommendationScore(
    type: PeerRecommendation['recommendationType'],
    user: any
  ): number {
    let score = 50 // Base score

    switch (type) {
      case 'similar_level':
        score += 20
        break
      case 'school_mate':
        score += 25
        break
      case 'high_activity':
        score += 15
        break
      case 'shared_course':
        score += 30
        break
    }

    // Add randomness to prevent same recommendations
    score += Math.random() * 10

    return Math.min(100, Math.round(score))
  }

  // Peer Statistics
  async updatePeerStats(userId: string): Promise<void> {
    const connections = await this.getPeerConnections(userId, 'accepted')
    const activities = await this.getUserActivities(userId, 100) // Last 100 activities

    const stats: Omit<PeerStats, '_id' | 'lastUpdated'> = {
      userId,
      totalConnections: connections.length,
      activeConnections: connections.filter(c => 
        c.lastInteractionAt && 
        (Date.now() - c.lastInteractionAt.getTime()) < 30 * 24 * 60 * 60 * 1000 // 30 days
      ).length,
      newConnectionsThisMonth: connections.filter(c =>
        c.respondedAt && 
        c.respondedAt.getMonth() === new Date().getMonth() &&
        c.respondedAt.getFullYear() === new Date().getFullYear()
      ).length,
      averageResponseTime: this.calculateAverageResponseTime(connections),
      connectionRate: this.calculateConnectionRate(userId),
      activityScore: this.calculateActivityScore(activities),
      influenceScore: this.calculateInfluenceScore(connections),
      breakdown: {
        byLevel: {},
        byCourse: {},
        bySchool: {},
        byInterest: {}
      }
    }

    await this.db.collection('peerStats').updateOne(
      { userId },
      { $set: { ...stats, lastUpdated: new Date() } },
      { upsert: true }
    )
  }

  private calculateAverageResponseTime(connections: Peer[]): number {
    const responseTimes = connections
      .filter(c => c.requestedAt && c.respondedAt)
      .map(c => (c.respondedAt!.getTime() - c.requestedAt.getTime()) / (1000 * 60 * 60)) // hours

    return responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0
  }

  private calculateConnectionRate(userId: string): number {
    // This would require more complex query to get sent vs accepted requests
    // For now, return a default rate
    return 75 // 75% acceptance rate
  }

  private calculateActivityScore(activities: PeerActivity[]): number {
    if (activities.length === 0) return 0

    const now = Date.now()
    const recentActivities = activities.filter(a => 
      (now - a.createdAt.getTime()) < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    )

    // Score based on frequency and recency
    const frequencyScore = Math.min(50, recentActivities.length * 2)
    const recencyScore = recentActivities.length > 0 ? 30 : 0
    const diversityScore = this.calculateActivityDiversity(activities)

    return Math.min(100, frequencyScore + recencyScore + diversityScore)
  }

  private calculateActivityDiversity(activities: PeerActivity[]): number {
    const types = new Set(activities.map(a => a.activityType))
    return Math.min(20, types.size * 4) // Max 20 points for diversity
  }

  private calculateInfluenceScore(connections: Peer[]): number {
    // Simple influence calculation based on network size
    return Math.min(100, connections.length * 5)
  }

  private async updateActivityScore(userId: string): Promise<void> {
    // This would be called when new activities are logged
    // For now, trigger full stats update
    await this.updatePeerStats(userId)
  }

  async getPeerStats(userId: string): Promise<PeerStats | null> {
    const result = await this.db.collection('peerStats').findOne({ userId })
    return result as PeerStats | null
  }

  // Peer Settings
  async updatePeerSettings(
    userId: string,
    settings: Partial<PeerSettings>
  ): Promise<void> {
    await this.db.collection('peerSettings').updateOne(
      { userId },
      { $set: settings },
      { upsert: true }
    )
  }

  async getPeerSettings(userId: string): Promise<PeerSettings | null> {
    const result = await this.db.collection('peerSettings').findOne({ userId })
    return result as PeerSettings | null
  }

  // Search and Discovery
  async searchPeers(
    userId: string,
    query: string,
    filters: {
      level?: string
      school?: string
      course?: string
      onlyAvailable?: boolean
    } = {},
    limit = 20
  ): Promise<User[]> {
    const searchQuery: any = {
      id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }

    if (filters.level) {
      searchQuery.level = filters.level
    }

    if (filters.school) {
      searchQuery.school = filters.school
    }

    const result = await this.db.collection('users')
      .find(searchQuery)
      .limit(limit)
      .toArray()

    return result as User[]
  }

  // Additional helper methods for API endpoints
  async markRecommendationAsViewed(userId: string, recommendationId: string): Promise<void> {
    await this.db.collection('peerRecommendations').updateOne(
      { 
        userId, 
        _id: new ObjectId(recommendationId) 
      },
      { $set: { isViewed: true } }
    )
  }

  async markRecommendationAsActioned(userId: string, recommendationId: string): Promise<void> {
    await this.db.collection('peerRecommendations').updateOne(
      { 
        userId, 
        _id: new ObjectId(recommendationId) 
      },
      { $set: { isActioned: true } }
    )
  }

  async deleteRecommendation(userId: string, recommendationId: string): Promise<void> {
    await this.db.collection('peerRecommendations').deleteOne({
      userId,
      _id: new ObjectId(recommendationId)
    })
  }

  async getRecommendations(userId: string, limit = 10): Promise<PeerRecommendation[]> {
    const result = await this.db.collection('peerRecommendations')
      .find({ 
        userId,
        isViewed: false,
        expiresAt: { $gt: new Date() }
      })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .toArray()

    return result as PeerRecommendation[]
  }
}
