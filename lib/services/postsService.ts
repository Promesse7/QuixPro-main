import { getDatabase } from '@/lib/mongodb';
import { Post, Answer } from '@/models/Post';
import { ObjectId } from 'mongodb';

export class PostsService {
  private static instance: PostsService;
  private db: any;

  private constructor() {}

  public static getInstance(): PostsService {
    if (!PostsService.instance) PostsService.instance = new PostsService();
    return PostsService.instance;
  }

  private async ensureDb() {
    if (!this.db) this.db = await getDatabase();
  }

  async createPost(post: Omit<Post, '_id' | 'createdAt' | 'updatedAt' | 'answers' | 'votes'>) {
    await this.ensureDb();
    const now = new Date();
    const doc = { ...post, createdAt: now, updatedAt: now, answers: [], votes: 0 };
    const res = await this.db.collection('posts').insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  async getPost(id: string) {
    await this.ensureDb();
    return this.db.collection('posts').findOne({ _id: new ObjectId(id) });
  }

  async listPosts(filter: any = {}, limit = 50) {
    await this.ensureDb();
    return this.db.collection('posts').find(filter).sort({ createdAt: -1 }).limit(limit).toArray();
  }

  async addAnswer(postId: string, answer: Omit<Answer, '_id' | 'createdAt' | 'updatedAt' | 'votes'>) {
    await this.ensureDb();
    const ans = { ...answer, _id: new ObjectId(), createdAt: new Date(), votes: 0 };
    await this.db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $push: { answers: ans }, $set: { updatedAt: new Date() } });
    return ans;
  }

  async votePost(postId: string, delta = 1) {
    await this.ensureDb();
    await this.db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $inc: { votes: delta } });
    return { success: true };
  }

  async acceptAnswer(postId: string, answerId: string, accepter: string) {
    await this.ensureDb();
    await this.db.collection('posts').updateOne({ _id: new ObjectId(postId), 'answers._id': new ObjectId(answerId) }, { $set: { 'answers.$.accepted': true, updatedAt: new Date(), solved: true } });
    return { success: true };
  }
}

export const postsService = PostsService.getInstance();
