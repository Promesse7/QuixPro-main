import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { Message, Conversation as ChatMessageModel } from '@/models/Chat';
import { Conversation } from '@/models/Conversation';

export class ConversationService {
  private static instance: ConversationService;
  private db: any;

  private constructor() {}

  public static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  private async ensureDb() {
    if (!this.db) this.db = await getDatabase();
  }

  async createConversation(participants: string[], createdBy: string, isGroup = false, groupId?: string) {
    await this.ensureDb();
    const now = new Date();
    const conv: Conversation = {
      participants,
      isGroup,
      groupId,
      createdBy,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.db.collection('conversations').insertOne(conv);
    return { ...conv, _id: result.insertedId };
  }

  async listUserConversations(userId: string, limit = 50) {
    await this.ensureDb();
    return this.db
      .collection('conversations')
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async sendMessage(conversationId: string, senderId: string, content: string, type: 'text'|'image'|'file'|'math' = 'text', metadata?: any) {
    await this.ensureDb();
    const now = new Date();
    const msg: any = {
      conversationId,
      content,
      senderId,
      type,
      metadata: metadata || {},
      readBy: [senderId],
      createdAt: now,
      updatedAt: now
    };

    const result = await this.db.collection('messages').insertOne(msg);

    // Update conversation lastMessage
    await this.db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessage: { messageId: result.insertedId.toString(), content, senderId, createdAt: now }, updatedAt: now } }
    );

    return { ...msg, _id: result.insertedId };
  }

  async getMessages(conversationId: string, limit = 50, before?: Date) {
    await this.ensureDb();
    const query: any = { conversationId };
    if (before) query.createdAt = { $lt: before };
    return this.db.collection('messages').find(query).sort({ createdAt: -1 }).limit(limit).toArray();
  }
}

export const conversationService = ConversationService.getInstance();
