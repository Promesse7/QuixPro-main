import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { Message, Group, UserGroup, TypingIndicator } from '@/models/Chat';
import { firebaseAdmin } from './firebase';

export class ChatService {
  private static instance: ChatService;
  private db: any;

  private async retryOperation<T>(op: () => Promise<T>, attempts = 3, backoffMs = 200): Promise<T> {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
      try {
        return await op();
      } catch (err) {
        lastErr = err;
        const wait = backoffMs * Math.pow(2, i);
        // small delay before retrying
        await new Promise((res) => setTimeout(res, wait));
      }
    }
    throw lastErr;
  }

  private constructor() {
    // Delayed DB initialization: `ensureDbConnection` will initialize when needed.
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Group Management
  async createGroup(groupData: Omit<Group, '_id' | 'createdAt' | 'updatedAt' | 'members'>) {
    await this.ensureDbConnection();
    const now = new Date();
    
    const group: Group = {
      ...groupData,
      createdAt: now,
      updatedAt: now,
      members: [{
        userId: groupData.createdBy,
        role: 'admin',
        joinedAt: now
      }],
      settings: groupData.settings || {
        allowMemberInvites: true,
        readReceipts: true,
        messageEditWindow: 5 // 5 minutes
      }
    };

    const result = await this.db.collection('groups').insertOne(group);
    return { ...group, _id: result.insertedId };
  }

  async getGroup(groupId: string) {
    await this.ensureDbConnection();
    return this.db.collection('groups').findOne({ _id: new ObjectId(groupId) });
  }

  async addGroupMember(groupId: string, userId: string, role: 'admin' | 'member' = 'member') {
    await this.ensureDbConnection();
    
    // Check if user is already a member
    const existingMember = await this.db.collection('groups').findOne({
      _id: new ObjectId(groupId),
      'members.userId': userId
    });

    if (existingMember) {
      return { success: false, message: 'User is already a member of this group' };
    }

    const result = await this.db.collection('groups').updateOne(
      { _id: new ObjectId(groupId) },
      {
        $push: {
          members: {
            userId,
            role,
            joinedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );

    return { success: result.modifiedCount > 0 };
  }

  async removeGroupMember(groupId: string, userId: string) {
    await this.ensureDbConnection();
    
    const result = await this.db.collection('groups').updateOne(
      { _id: new ObjectId(groupId) },
      {
        $pull: { members: { userId } },
        $set: { updatedAt: new Date() }
      }
    );

    return { success: result.modifiedCount > 0 };
  }

  // Message Management
  async createMessage(message: Omit<Message, '_id' | 'createdAt' | 'updatedAt' | 'readBy'>) {
    await this.ensureDbConnection();
    
    const newMessage: Message = {
      ...message,
      readBy: [message.senderId],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.db.collection('messages').insertOne(newMessage);
    const stored = { ...newMessage, _id: result.insertedId };

    // Publish message to Firebase for real-time subscribers with retries.
    try {
      await this.retryOperation(() =>
        firebaseAdmin.publishMessage({
          content: newMessage.content,
          senderId: newMessage.senderId,
          groupId: newMessage.groupId,
          type: newMessage.type,
          metadata: newMessage.metadata,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
        }),
        3,
        200
      );
    } catch (err) {
      console.warn('Firebase publishMessage failed after retries:', err?.message || err);
    }

    return stored;
  }

  async getMessages(groupId: string, limit = 50, before?: Date) {
    await this.ensureDbConnection();
    
    const query: any = { groupId };
    if (before) {
      query.createdAt = { $lt: before };
    }

    return this.db.collection('messages')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async markMessageAsRead(messageId: string, userId: string) {
    await this.ensureDbConnection();
    
    const result = await this.db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { $addToSet: { readBy: userId } }
    );

    return { success: result.modifiedCount > 0 };
  }

  // User Group Management
  async getUserGroups(userId: string) {
    await this.ensureDbConnection();
    
    return this.db.collection('groups')
      .find({
        'members.userId': userId,
        'members.leftAt': { $exists: false }
      })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  // Typing Indicators
  async setTypingIndicator(userId: string, groupId: string, isTyping: boolean) {
    await this.ensureDbConnection();
    
    const now = new Date();
    await this.db.collection('typingIndicators').updateOne(
      { userId, groupId },
      {
        $set: {
          isTyping,
          lastUpdated: now
        },
        $setOnInsert: {
          userId,
          groupId,
          createdAt: now
        }
      },
      { upsert: true }
    );

    // Auto-clear typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        this.db.collection('typingIndicators').updateOne(
          { userId, groupId, isTyping: true },
          { $set: { isTyping: false, lastUpdated: new Date() } }
        );
      }, 3000);
    }

    // Also set typing indicator in Firebase for low-latency updates (with retries)
    try {
      await this.retryOperation(() => firebaseAdmin.setUserTyping(userId, groupId, isTyping), 3, 150);
    } catch (err) {
      console.warn('Firebase setUserTyping failed after retries:', err?.message || err);
    }

    return { success: true };
  }

  async getTypingUsers(groupId: string) {
    await this.ensureDbConnection();
    
    // Only return users who have been typing in the last 3 seconds
    const threeSecondsAgo = new Date(Date.now() - 3000);
    
    return this.db.collection('typingIndicators')
      .find({
        groupId,
        isTyping: true,
        lastUpdated: { $gte: threeSecondsAgo }
      })
      .toArray();
  }

  private async ensureDbConnection() {
    if (!this.db) {
      this.db = await getDatabase();
    }
  }

  // Direct Message Methods
  async createDirectMessage(messageData: {
    senderId: string;
    recipientId: string;
    content: string;
    type?: string;
    metadata?: any;
  }) {
    await this.ensureDbConnection();
    const now = new Date();
    
    const message = {
      ...messageData,
      type: messageData.type || 'text',
      metadata: messageData.metadata || {},
      createdAt: now,
      read: false
    };

    const result = await this.db.collection('directMessages').insertOne(message);
    return { ...message, _id: result.insertedId };
  }

  async getDirectMessages(userId1: string, userId2: string, before?: Date) {
    await this.ensureDbConnection();
    
    const query: any = {
      $or: [
        { senderId: userId1, recipientId: userId2 },
        { senderId: userId2, recipientId: userId1 }
      ]
    };

    if (before) {
      query.createdAt = { $lt: before };
    }

    return await this.db
      .collection('directMessages')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
  }

  async getDirectConversations(userId: string) {
    await this.ensureDbConnection();
    
    const pipeline = [
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }]
        }
      },
      {
        $project: {
          otherUserId: {
            $cond: {
              if: { $eq: ['$senderId', userId] },
              then: '$recipientId',
              else: '$senderId'
            }
          },
          lastMessage: '$content',
          lastMessageTime: '$createdAt',
          unreadCount: {
            $cond: {
              if: { $and: [{ $eq: ['$recipientId', userId] }, { $eq: ['$read', false] }] },
              then: 1,
              else: 0
            }
          }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      },
      {
        $group: {
          _id: '$otherUserId',
          lastMessage: { $first: '$lastMessage' },
          lastMessageTime: { $first: '$lastMessageTime' },
          unreadCount: { $sum: '$unreadCount' }
        }
      }
    ];

    return await this.db.collection('directMessages').aggregate(pipeline).toArray();
  }
}

export const chatService = ChatService.getInstance();
