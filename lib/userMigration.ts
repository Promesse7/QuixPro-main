import getDatabase from '@/lib/mongodb'
import { UserAccountManager } from './userAccount'
import { ObjectId } from 'mongodb'

export interface LegacyUser {
  _id: ObjectId
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  passwordHash: string
  countryId?: ObjectId
  schoolId?: ObjectId
  levelId?: ObjectId
  stats?: any
  gamification?: any
  preferences?: any
  createdAt: Date
  updatedAt: Date
}

export class UserMigrationManager {
  static async migrateLegacyUsers(): Promise<{
    total: number
    migrated: number
    errors: string[]
  }> {
    const errors: string[] = []
    let migrated = 0

    try {
      const db = await getDatabase()
      const legacyUsersCollection = db.collection('users')
      const newUsersCollection = db.collection('userAccounts')

      // Get all legacy users
      const legacyUsers = await legacyUsersCollection.find({}).toArray()
      const total = legacyUsers.length

      console.log(`Found ${total} legacy users to migrate`)

      // Migrate each user
      for (const legacyUser of legacyUsers) {
        try {
          // Check if already migrated
          const existingNewUser = await newUsersCollection.findOne({
            email: legacyUser.email
          })

          if (existingNewUser) {
            console.log(`User ${legacyUser.email} already migrated, skipping...`)
            continue
          }

          // Create new user account
          const newUserAccount = UserAccountManager.createUserAccount({
            email: legacyUser.email,
            name: legacyUser.name,
            role: legacyUser.role,
            school: legacyUser.schoolId?.toString(), // Convert ObjectId to string for now
            level: legacyUser.levelId?.toString()
          })

          await newUsersCollection.insertOne({
            ...newUserAccount,
            legacyUserId: legacyUser._id.toString(), // Keep reference to old ID
            migratedAt: new Date(),
            migrationData: {
              originalCreatedAt: legacyUser.createdAt,
              originalStats: legacyUser.stats,
              originalGamification: legacyUser.gamification,
              originalPreferences: legacyUser.preferences
            }
          })

          // Mark legacy user as migrated
          await legacyUsersCollection.updateOne(
            { _id: legacyUser._id },
            { 
              $set: { 
                migrated: true,
                migratedTo: newUserAccount.uniqueUserId,
                migratedAt: new Date()
              }
            }
          )

          migrated++
          console.log(`Migrated user: ${legacyUser.email} -> ${newUserAccount.uniqueUserId}`)

        } catch (error) {
          const errorMsg = `Failed to migrate user ${legacyUser.email}: ${error}`
          errors.push(errorMsg)
          console.error(errorMsg)
        }
      }

      console.log(`Migration complete: ${migrated}/${total} users migrated`)

      return {
        total,
        migrated,
        errors
      }

    } catch (error) {
      const errorMsg = `Migration failed: ${error}`
      errors.push(errorMsg)
      console.error(errorMsg)
      
      return {
        total: 0,
        migrated: 0,
        errors
      }
    }
  }

  static async getUserByUniqueId(uniqueUserId: string): Promise<any> {
    try {
      const db = await getDatabase()
      const usersCollection = db.collection('userAccounts')
      
      const user = await usersCollection.findOne({ uniqueUserId })
      
      if (user) {
        return {
          ...user,
          _id: user._id.toString()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching user by unique ID:', error)
      return null
    }
  }

  static async getUserByEmail(email: string): Promise<any> {
    try {
      const db = await getDatabase()
      const usersCollection = db.collection('userAccounts')
      
      const user = await usersCollection.findOne({ email })
      
      if (user) {
        return {
          ...user,
          _id: user._id.toString()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  static async updateUserProfile(uniqueUserId: string, profileData: any): Promise<boolean> {
    try {
      const db = await getDatabase()
      const usersCollection = db.collection('userAccounts')
      
      const result = await usersCollection.updateOne(
        { uniqueUserId },
        { 
          $set: { 
            profile: profileData,
            updatedAt: new Date()
          }
        }
      )
      
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating user profile:', error)
      return false
    }
  }
}
