import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { Message, Group, UserGroup, TypingIndicator } from '@/models/Chat';

export class ChatService {
  private static instance: ChatService;
  private db: any;

  private constructor() {
    // Initialize database connection
    getDatabase().then(db => {
      this.db = db;
    });
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
    return { ...newMessage, _id: result.insertedId };
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
}

export const chatService = ChatService.getInstance();
