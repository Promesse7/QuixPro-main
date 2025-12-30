import { ObjectId } from 'mongodb'

export interface UserAccount {
  _id: ObjectId
  uniqueUserId: string // Generated at account creation - NEVER changes
  email: string // Can change
  name: string
  role: 'student' | 'teacher' | 'admin'
  createdAt: Date
  updatedAt: Date
  profile: {
    avatar?: string
    bio?: string
    school?: string
    level?: string
  }
  settings: {
    emailNotifications: boolean
    pushNotifications: boolean
    theme: 'light' | 'dark' | 'system'
  }
  metadata: {
    lastLoginAt?: Date
    loginCount?: number
    isEmailVerified: boolean
  }
}

export class UserAccountManager {
  static generateUniqueUserId(): string {
    // Generate a unique ID that combines timestamp and random string
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `user_${timestamp}_${random}`
  }

  static createUserAccount(userData: {
    email: string
    name: string
    role: 'student' | 'teacher' | 'admin'
    school?: string
    level?: string
  }): Omit<UserAccount, '_id' | 'createdAt' | 'updatedAt'> {
    const uniqueUserId = this.generateUniqueUserId()
    
    return {
      uniqueUserId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      profile: {
        school: userData.school,
        level: userData.level,
      },
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        theme: 'system' as const,
      },
      metadata: {
        loginCount: 0,
        isEmailVerified: false,
      },
    }
  }

  static updateEmail(uniqueUserId: string, newEmail: string): Partial<UserAccount> {
    return {
      email: newEmail,
      updatedAt: new Date(),
      metadata: {
        isEmailVerified: false, // Require re-verification after email change
      },
    }
  }

  static updateProfile(uniqueUserId: string, profileData: Partial<UserAccount['profile']>): Partial<UserAccount> {
    return {
      profile: profileData,
      updatedAt: new Date(),
    }
  }

  static updateSettings(uniqueUserId: string, settings: Partial<UserAccount['settings']>): Partial<UserAccount> {
    return {
      settings: {
        emailNotifications: settings.emailNotifications ?? true,
        pushNotifications: settings.pushNotifications ?? true,
        theme: settings.theme ?? 'system',
      },
      updatedAt: new Date(),
    }
  }

  static recordLogin(uniqueUserId: string): Partial<UserAccount> {
    return {
      metadata: {
        lastLoginAt: new Date(),
        loginCount: 1, // Will be incremented in the database
        isEmailVerified: true, // Assuming user is verified if they can login
      },
    }
  }

  static verifyEmail(uniqueUserId: string): Partial<UserAccount> {
    return {
      metadata: {
        isEmailVerified: true,
      },
    }
  }
}
