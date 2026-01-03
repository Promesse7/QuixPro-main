import { Db, Collection, ObjectId } from 'mongodb'
import { Message, Conversation, Group, UserGroup, TypingIndicator } from '@/models/Chat'
import { User } from '@/models/User'

export class ChatService {
  private db: Db

  constructor(db: Db) {
    this.db = db
  }

  // Initialize collections and indexes
  async initializeCollections() {
    // Messages collection
    const messagesCollection = this.db.collection('messages')
    await messagesCollection.createIndex({ groupId: 1, createdAt: -1 })
    await messagesCollection.createIndex({ senderId: 1, createdAt: -1 })
    await messagesCollection.createIndex({ groupId: 1, senderId: 1 })

    // Conversations collection
    const conversationsCollection = this.db.collection('conversations')
    await conversationsCollection.createIndex({ groupId: 1 })
    await conversationsCollection.createIndex({ participants: 1 })
    await conversationsCollection.createIndex({ updatedAt: -1 })

    // Groups collection
    const groupsCollection = this.db.collection('groups')
    await groupsCollection.createIndex({ createdBy: 1 })
    await groupsCollection.createIndex({ 'members.userId': 1 })
    await groupsCollection.createIndex({ isPublic: 1 })

    // UserGroups collection
    const userGroupsCollection = this.db.collection('userGroups')
    await userGroupsCollection.createIndex({ userId: 1, groupId: 1 })
    await userGroupsCollection.createIndex({ userId: 1, isActive: 1 })

    // Typing indicators collection
    const typingCollection = this.db.collection('typingIndicators')
    await typingCollection.createIndex({ groupId: 1, userId: 1 })
    await typingCollection.createIndex({ groupId: 1, lastUpdated: 1 }, { expireAfterSeconds: 30 })
  }

  // Group Management
  async createGroup(groupData: Omit<Group, '_id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
    const group: Omit<Group, '_id'> = {
      ...groupData,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await this.db.collection('groups').insertOne(group)
    return {
      ...group,
      _id: result.insertedId
    }
  }

  async getGroupById(groupId: string): Promise<Group | null> {
    const result = await this.db.collection('groups').findOne({ _id: new ObjectId(groupId) })
    return result as Group | null
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userGroups = await this.db.collection('userGroups')
      .find({ userId, isActive: true })
      .toArray()

    const groupIds = userGroups.map(ug => ug.groupId)
    const result = await this.db.collection('groups')
      .find({ _id: { $in: groupIds.map(id => new ObjectId(id)) } })
      .toArray()
    return result as Group[]
  }

  async joinGroup(userId: string, groupId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
    const session = this.db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Add user to group members
        await this.db.collection('groups').updateOne(
          { _id: new ObjectId(groupId) },
          {
            $push: { members: { userId, role, joinedAt: new Date() } } as any,
            $set: { updatedAt: new Date() }
          }
        )

        // Create user group record
        await this.db.collection('userGroups').insertOne({
          userId,
          groupId,
          notificationSettings: {
            mute: false,
            mentions: true
          },
          joinedAt: new Date(),
          isActive: true
        })

        // Create or update conversation
        await this.updateConversation(groupId, [userId])
      })
    } finally {
      await session.endSession()
    }
  }

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    const session = this.db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Remove user from group members
        await this.db.collection('groups').updateOne(
          { _id: new ObjectId(groupId) },
          {
            $pull: { members: { userId } } as any,
            $set: { updatedAt: new Date() }
          }
        )

        // Deactivate user group record
        await this.db.collection('userGroups').updateOne(
          { userId, groupId, isActive: true },
          {
            $set: {
              isActive: false,
              leftAt: new Date()
            }
          }
        )
      })
    } finally {
      await session.endSession()
    }
  }

  // Message Management
  async sendMessage(messageData: Omit<Message, '_id' | 'createdAt' | 'updatedAt' | 'readBy'>): Promise<Message> {
    const message: Omit<Message, '_id'> = {
      ...messageData,
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [messageData.senderId] // Sender has read their own message
    }

    const result = await this.db.collection('messages').insertOne(message)

    // Update conversation
    await this.updateConversation(messageData.groupId, [messageData.senderId], {
      content: messageData.content,
      senderId: messageData.senderId,
      timestamp: message.createdAt
    })

    return {
      ...message,
      _id: result.insertedId
    }
  }

  async getGroupMessages(
    groupId: string,
    page = 1,
    limit = 50,
    before?: Date
  ): Promise<Message[]> {
    const query: any = { groupId }
    
    if (before) {
      query.createdAt = { $lt: before }
    }

    return this.db.collection('messages')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as Promise<Message[]>
  }

  async markMessageAsRead(userId: string, messageId: string): Promise<void> {
    await this.db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      {
        $addToSet: { readBy: userId },
        $set: { updatedAt: new Date() }
      }
    )
  }

  async markAllMessagesAsRead(userId: string, groupId: string): Promise<void> {
    await this.db.collection('messages').updateMany(
      { 
        groupId, 
        senderId: { $ne: userId }, // Don't mark own messages
        readBy: { $ne: userId } // Only mark unread messages
      },
      {
        $addToSet: { readBy: userId },
        $set: { updatedAt: new Date() }
      }
    )
  }

  // Conversation Management
  private async updateConversation(
    groupId: string,
    participants: string[],
    lastMessage?: {
      content: string
      senderId: string
      timestamp: Date
    }
  ): Promise<void> {
    const conversation = await this.db.collection('conversations').findOne({ groupId })

    if (conversation) {
      // Update existing conversation
      const updateData: any = {
        updatedAt: new Date()
      }

      if (lastMessage) {
        updateData.lastMessage = lastMessage
      }

      // Add new participants
      const newParticipants = participants.filter(p => !conversation.participants.includes(p))
      if (newParticipants.length > 0) {
        updateData.$push = { participants: { $each: newParticipants } }
      }

      await this.db.collection('conversations').updateOne(
        { groupId },
        updateData
      )
    } else {
      // Create new conversation
      await this.db.collection('conversations').insertOne({
        groupId,
        participants,
        lastMessage,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.db.collection('conversations')
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .toArray() as Promise<Conversation[]>
  }

  // Typing Indicators
  async setTypingIndicator(userId: string, groupId: string, isTyping: boolean): Promise<void> {
    await this.db.collection('typingIndicators').updateOne(
      { groupId, userId },
      {
        $set: {
          isTyping,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    )
  }

  async getTypingUsers(groupId: string): Promise<string[]> {
    const typingIndicators = await this.db.collection('typingIndicators')
      .find({ 
        groupId, 
        isTyping: true,
        lastUpdated: { $gt: new Date(Date.now() - 30000) } // Only active in last 30 seconds
      })
      .toArray()

    return typingIndicators.map(t => t.userId)
  }

  // File Upload Support
  async uploadFileToGroup(
    groupId: string,
    senderId: string,
    fileUrl: string,
    fileName: string,
    fileType: string,
    fileSize: number
  ): Promise<Message> {
    return this.sendMessage({
      content: `📎 ${fileName}`,
      senderId,
      groupId,
      type: 'file',
      metadata: {
        fileUrl,
        fileName,
        fileType,
        fileSize
      }
    })
  }

  async uploadImageToGroup(
    groupId: string,
    senderId: string,
    imageUrl: string,
    fileName: string
  ): Promise<Message> {
    return this.sendMessage({
      content: `🖼️ ${fileName}`,
      senderId,
      groupId,
      type: 'image',
      metadata: {
        fileUrl: imageUrl,
        fileName,
        fileType: 'image'
      }
    })
  }

  // Search and Filtering
  async searchMessages(groupId: string, query: string, limit = 20): Promise<Message[]> {
    return this.db.collection('messages')
      .find({
        groupId,
        content: { $regex: query, $options: 'i' }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray() as Promise<Message[]>
  }

  async getUnreadCount(userId: string, groupId: string): Promise<number> {
    return this.db.collection('messages').countDocuments({
      groupId,
      senderId: { $ne: userId },
      readBy: { $ne: userId }
    })
  }

  async getTotalUnreadCount(userId: string): Promise<number> {
    const userGroups = await this.db.collection('userGroups')
      .find({ userId, isActive: true })
      .toArray()

    const groupIds = userGroups.map(ug => ug.groupId)
    
    const unreadCounts = await Promise.all(
      groupIds.map(groupId => this.getUnreadCount(userId, groupId))
    )

    return unreadCounts.reduce((total, count) => total + count, 0)
  }
}
