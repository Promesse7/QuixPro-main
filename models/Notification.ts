import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

// Notification types for different categories
export type NotificationType = 'chat' | 'quiz' | 'group' | 'site' | 'system'
export type NotificationEvent = 
  // Chat events
  | 'new_message' 
  | 'message_mention'
  | 'group_invite'
  | 'member_joined'
  // Quiz events  
  | 'quiz_assigned'
  | 'quiz_deadline_approaching'
  | 'quiz_results_published'
  | 'certificate_earned'
  | 'group_quiz_created'
  // Site events
  | 'question_answered'
  | 'answer_accepted'
  | 'answer_challenged'
  // System events
  | 'account_update'
  | 'platform_announcement'
  | 'feature_update'

export type NotificationPriority = 'low' | 'normal' | 'high'
export type EntityType = 'message' | 'quiz' | 'group' | 'post' | 'user' | 'certificate'

// Notification interface
export interface INotification {
  _id?: ObjectId
  userId: string                    // Mongo user ID
  type: NotificationType            // Category: chat, quiz, group, site, system
  event: NotificationEvent          // Specific event type
  title: string                     // Notification title
  message: string                   // Notification message body
  entityType?: EntityType           // Type of entity this notification references
  entityId?: string                 // ID of the referenced entity
  isRead: boolean                   // Read status
  priority: NotificationPriority     // Priority level
  metadata?: Record<string, any>    // Additional event-specific data
  createdAt: Date                   // Creation timestamp
  readAt?: Date                     // When notification was read
  expiresAt?: Date                 // Optional expiration for time-sensitive notifications
}

// Notification service class
export class NotificationService {
  private collection: Collection<INotification>

  constructor(db: Db) {
    this.collection = db.collection('notifications')
  }

  // Create indexes
  async createIndexes() {
    await this.collection.createIndex({ userId: 1 })
    await this.collection.createIndex({ type: 1 })
    await this.collection.createIndex({ event: 1 })
    await this.collection.createIndex({ entityType: 1 })
    await this.collection.createIndex({ entityId: 1 })
    await this.collection.createIndex({ isRead: 1 })
    await this.collection.createIndex({ priority: 1 })
    await this.collection.createIndex({ createdAt: 1 })
    await this.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    
    // Compound indexes
    await this.collection.createIndex({ userId: 1, isRead: 1, createdAt: -1 })
    await this.collection.createIndex({ userId: 1, type: 1, createdAt: -1 })
    await this.collection.createIndex({ userId: 1, priority: 1, createdAt: -1 })
    await this.collection.createIndex({ userId: 1, expiresAt: 1 })
  }

  // Create a new notification
  async create(notification: Omit<INotification, '_id' | 'createdAt'>): Promise<INotification> {
    const doc = {
      ...notification,
      createdAt: new Date()
    }
    
    const result = await this.collection.insertOne(doc)
    return {
      ...doc,
      _id: result.insertedId
    }
  }

  // Find unread notifications for a user
  async findUnreadByUser(userId: string, limit = 20): Promise<INotification[]> {
    return this.collection.find({ 
      userId, 
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
  }

  // Find notifications for a user with pagination
  async findByUserPaginated(
    userId: string, 
    page = 1, 
    limit = 20,
    type?: NotificationType
  ): Promise<INotification[]> {
    const query: any = { 
      userId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }
    
    if (type) {
      query.type = type
    }

    return this.collection.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
  }

  // Get unread count for a user
  async getUnreadCount(userId: string, type?: NotificationType): Promise<number> {
    const query: any = { 
      userId, 
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }
    
    if (type) {
      query.type = type
    }

    return this.collection.countDocuments(query)
  }

  // Mark notifications as read
  async markAsRead(userId: string, notificationIds?: string[]): Promise<{ modifiedCount: number }> {
    const query: any = { userId, isRead: false }
    if (notificationIds && notificationIds.length > 0) {
      query._id = { $in: notificationIds.map(id => new ObjectId(id)) }
    }

    return this.collection.updateMany(
      query,
      { 
        $set: { isRead: true, readAt: new Date() }
      }
    )
  }

  // Mark a single notification as read
  async markSingleAsRead(notificationId: string): Promise<{ modifiedCount: number }> {
    return this.collection.updateOne(
      { _id: new ObjectId(notificationId) },
      { 
        $set: { isRead: true, readAt: new Date() }
      }
    )
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(daysOld = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    return this.collection.deleteMany({
      isRead: true,
      createdAt: { $lt: cutoffDate }
    })
  }

  // Get notification by ID
  async findById(id: string): Promise<INotification | null> {
    return this.collection.findOne({ _id: new ObjectId(id) })
  }

  // Delete notification
  async delete(id: string): Promise<{ deletedCount: number }> {
    return this.collection.deleteOne({ _id: new ObjectId(id) })
  }
}

// Utility function to format time ago
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
