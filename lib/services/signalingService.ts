import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export class SignalingService {
  private static instance: SignalingService;
  private db: any;

  private constructor() {}

  public static getInstance(): SignalingService {
    if (!SignalingService.instance) {
      SignalingService.instance = new SignalingService();
    }
    return SignalingService.instance;
  }

  private async ensureDb() {
    if (!this.db) this.db = await getDatabase();
  }

  async createRoom(creatorId: string, metadata: any = {}) {
    await this.ensureDb();
    const now = new Date();
    const room = {
      creatorId,
      participants: [creatorId],
      metadata,
      createdAt: now,
      updatedAt: now,
      offers: [],
      answers: [],
      ices: []
    };
    const res = await this.db.collection('webrtcRooms').insertOne(room);
    return { ...room, _id: res.insertedId };
  }

  async joinRoom(roomId: string, userId: string) {
    await this.ensureDb();
    await this.db.collection('webrtcRooms').updateOne(
      { _id: new ObjectId(roomId) },
      { $addToSet: { participants: userId }, $set: { updatedAt: new Date() } }
    );
    return { success: true };
  }

  async postSignal(roomId: string, type: 'offer'|'answer'|'ice', payload: any, senderId: string) {
    await this.ensureDb();
    const entry = { senderId, payload, createdAt: new Date() };
    const field = type === 'offer' ? 'offers' : type === 'answer' ? 'answers' : 'ices';
    await this.db.collection('webrtcRooms').updateOne(
      { _id: new ObjectId(roomId) },
      { $push: { [field]: entry }, $set: { updatedAt: new Date() } }
    );
    return entry;
  }

  async getSignals(roomId: string, since?: Date) {
    await this.ensureDb();
    const room = await this.db.collection('webrtcRooms').findOne({ _id: new ObjectId(roomId) });
    if (!room) return null;
    const filterSince = (arr: any[]) => arr.filter((e) => !since || new Date(e.createdAt) > since);
    return {
      offers: filterSince(room.offers || []),
      answers: filterSince(room.answers || []),
      ices: filterSince(room.ices || [])
    };
  }
}

export const signalingService = SignalingService.getInstance();
