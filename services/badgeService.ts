import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';

export interface Badge {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'milestone' | 'special' | 'progress';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  criteria: {
    type: string;
    value: any;
  };
  createdAt: Date;
}

export interface UserBadge {
  badgeId: string;
  name: string;
  earnedAt: Date;
  icon: string;
  description: string;
  category: string;
  rarity: string;
  points: number;
}

class BadgeService {
  async createBadge(badge: Omit<Badge, '_id' | 'createdAt'>): Promise<string> {
    const db = await getDatabase();
    const badgesCol = db.collection('badges');
    
    const result = await badgesCol.insertOne({
      ...badge,
      createdAt: new Date()
    });
    
    return result.insertedId.toString();
  }

  async getBadgeById(badgeId: string): Promise<Badge | null> {
    const db = await getDatabase();
    const badgesCol = db.collection('badges');
    
    const badge = await badgesCol.findOne({ id: badgeId });
    return badge as Badge | null;
  }

  async getAllBadges(): Promise<Badge[]> {
    const db = await getDatabase();
    const badgesCol = db.collection('badges');
    
    const badges = await badgesCol.find({}).toArray();
    return badges as Badge[];
  }

  async awardBadgeToUser(userId: string, badgeId: string): Promise<boolean> {
    const db = await getDatabase();
    const usersCol = db.collection('users');
    
    // Check if user already has this badge
    const user = await usersCol.findOne({ 
      id: userId,
      'gamification.badges.badgeId': badgeId 
    });
    
    if (user) {
      return false; // Badge already awarded
    }

    // Get badge details
    const badge = await this.getBadgeById(badgeId);
    if (!badge) {
      throw new Error(`Badge with ID ${badgeId} not found`);
    }

    // Award badge to user
    const userBadge: UserBadge = {
      badgeId: badge.id,
      name: badge.name,
      earnedAt: new Date(),
      icon: badge.icon,
      description: badge.description,
      category: badge.category,
      rarity: badge.rarity,
      points: badge.points
    };

    await usersCol.updateOne(
      { id: userId },
      { 
        $push: { 'gamification.badges': userBadge as any },
        $inc: { 'gamification.totalXP': badge.points },
        $set: { updatedAt: new Date() }
      }
    );

    return true;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const db = await getDatabase();
    const usersCol = db.collection('users');
    
    const user = await usersCol.findOne(
      { id: userId },
      { projection: { 'gamification.badges': 1 } }
    );
    
    return user?.gamification?.badges || [];
  }

  async initializeDefaultBadges(): Promise<void> {
    const defaultBadges: Omit<Badge, '_id' | 'createdAt'>[] = [
      {
        id: 'account_creator',
        name: 'Account Creator',
        description: 'Welcome to QuixPro! You created your account.',
        icon: '🎯',
        category: 'achievement',
        rarity: 'common',
        points: 10,
        criteria: {
          type: 'account_creation',
          value: true
        }
      },
      {
        id: 'first_quiz',
        name: 'Quiz Beginner',
        description: 'Completed your first quiz.',
        icon: '📝',
        category: 'achievement',
        rarity: 'common',
        points: 15,
        criteria: {
          type: 'quiz_completion',
          value: 1
        }
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Completed 10 quizzes.',
        icon: '🏆',
        category: 'milestone',
        rarity: 'rare',
        points: 50,
        criteria: {
          type: 'quiz_completion',
          value: 10
        }
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Achieved 100% on a quiz.',
        icon: '💯',
        category: 'achievement',
        rarity: 'rare',
        points: 30,
        criteria: {
          type: 'perfect_score',
          value: 1
        }
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintained a 7-day quiz streak.',
        icon: '🔥',
        category: 'milestone',
        rarity: 'epic',
        points: 75,
        criteria: {
          type: 'streak',
          value: 7
        }
      },
      {
        id: 'certificate_earner',
        name: 'Certificate Earner',
        description: 'Earned your first certificate.',
        icon: '🎓',
        category: 'achievement',
        rarity: 'rare',
        points: 40,
        criteria: {
          type: 'certificate',
          value: 1
        }
      },
      {
        id: 'knowledge_seeker',
        name: 'Knowledge Seeker',
        description: 'Completed quizzes in 3 different subjects.',
        icon: '📚',
        category: 'milestone',
        rarity: 'rare',
        points: 45,
        criteria: {
          type: 'subject_diversity',
          value: 3
        }
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Completed a quiz in under 2 minutes.',
        icon: '⚡',
        category: 'achievement',
        rarity: 'epic',
        points: 60,
        criteria: {
          type: 'speed_completion',
          value: 120 // seconds
        }
      }
    ];

    const db = await getDatabase();
    const badgesCol = db.collection('badges');

    for (const badge of defaultBadges) {
      const existing = await badgesCol.findOne({ id: badge.id });
      if (!existing) {
        await badgesCol.insertOne({
          ...badge,
          createdAt: new Date()
        });
      }
    }
  }
}

export const badgeService = new BadgeService();
