import { ObjectId } from 'mongodb';
import { UserRole } from '@/models/User';
import getDatabase from './mongodb';

export interface UserProfile {
  firebaseUid: string;
  email: string;
  name: string;
  role: UserRole;
  level?: string;
  school?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class MigrationManager {
  static async getUserByEmail(email: string) {
    try {
      const db = await getDatabase();
      return await db.collection('users').findOne({ email });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  static async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
    try {
      const db = await getDatabase();
      const now = new Date();
      
      const userProfile: UserProfile = {
        ...profile,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection('users').insertOne(userProfile);
      
      return {
        ...userProfile,
        _id: result.insertedId,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string | ObjectId, updates: Partial<UserProfile>) {
    try {
      const db = await getDatabase();
      const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
      
      await db.collection('users').updateOne(
        { _id },
        {
          $set: {
            ...updates,
            updatedAt: new Date(),
          },
        }
      );

      return await db.collection('users').findOne({ _id });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}
