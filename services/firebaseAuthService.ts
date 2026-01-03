import { getAuth } from 'firebase-admin/auth'
import { app } from '@/lib/firebaseClient'
import { User } from '@/models/User'

export class FirebaseAuthService {
  private auth = getAuth(app)

  // Generate custom Firebase token for authenticated user
  async generateCustomToken(user: User): Promise<string> {
    try {
      // Create custom claims with user information
      const customClaims = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        // Add any additional claims needed for Firebase rules
        groups: [], // Will be populated with user's groups
        permissions: this.getUserPermissions(user.role)
      }

      // Generate custom token
      const customToken = await this.auth.createCustomToken(user.id, customClaims)
      
      return customToken
    } catch (error) {
      console.error('Error generating custom token:', error)
      throw new Error('Failed to generate Firebase custom token')
    }
  }

  // Verify Firebase ID token
  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken)
      return decodedToken
    } catch (error) {
      console.error('Error verifying ID token:', error)
      throw new Error('Invalid Firebase ID token')
    }
  }

  // Get user permissions based on role
  private getUserPermissions(role: string): string[] {
    switch (role) {
      case 'admin':
        return ['read:all', 'write:all', 'delete:all', 'manage:groups', 'manage:users']
      case 'teacher':
        return ['read:own_groups', 'write:own_groups', 'create:groups', 'manage:students']
      case 'student':
        return ['read:joined_groups', 'write:joined_groups', 'join:public_groups']
      default:
        return ['read:public']
    }
  }

  // Revoke user's Firebase tokens (useful for logout/security)
  async revokeTokens(uid: string): Promise<void> {
    try {
      await this.auth.revokeRefreshTokens(uid)
    } catch (error) {
      console.error('Error revoking tokens:', error)
      throw new Error('Failed to revoke tokens')
    }
  }

  // Get user by Firebase UID
  async getUser(uid: string): Promise<any> {
    try {
      const userRecord = await this.auth.getUser(uid)
      return userRecord
    } catch (error) {
      console.error('Error getting user:', error)
      throw new Error('User not found')
    }
  }

  // Update user claims
  async updateCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
    try {
      await this.auth.setCustomUserClaims(uid, claims)
    } catch (error) {
      console.error('Error updating custom claims:', error)
      throw new Error('Failed to update custom claims')
    }
  }

  // Create user in Firebase Auth
  async createUser(user: User): Promise<string> {
    try {
      const userRecord = await this.auth.createUser({
        uid: user.id,
        email: user.email,
        displayName: user.name,
        photoURL: user.image,
        emailVerified: true, // Assuming email is verified from your auth system
        disabled: false
      })

      // Set custom claims
      await this.updateCustomClaims(user.id, {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        permissions: this.getUserPermissions(user.role)
      })

      return userRecord.uid
    } catch (error) {
      console.error('Error creating Firebase user:', error)
      throw new Error('Failed to create Firebase user')
    }
  }

  // Delete user from Firebase Auth
  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid)
    } catch (error) {
      console.error('Error deleting Firebase user:', error)
      throw new Error('Failed to delete Firebase user')
    }
  }

  // Disable/Enable user
  async updateUserStatus(uid: string, disabled: boolean): Promise<void> {
    try {
      await this.auth.updateUser(uid, { disabled })
    } catch (error) {
      console.error('Error updating user status:', error)
      throw new Error('Failed to update user status')
    }
  }

  // List users (for admin purposes)
  async listUsers(pageToken?: string, maxResults = 1000): Promise<{
    users: any[]
    nextPageToken?: string
  }> {
    try {
      const listUsersResult = await this.auth.listUsers(maxResults, pageToken)
      
      return {
        users: listUsersResult.users.map(user => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          disabled: user.disabled,
          emailVerified: user.emailVerified,
          customClaims: user.customClaims
        })),
        nextPageToken: listUsersResult.pageToken
      }
    } catch (error) {
      console.error('Error listing users:', error)
      throw new Error('Failed to list users')
    }
  }
}

// Singleton instance
export const firebaseAuthService = new FirebaseAuthService()

// Helper function to sync MongoDB user with Firebase
export async function syncUserWithFirebase(user: User): Promise<void> {
  try {
    // Try to get existing Firebase user
    try {
      await firebaseAuthService.getUser(user.id)
      // User exists, update claims
      await firebaseAuthService.updateCustomClaims(user.id, {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        permissions: firebaseAuthService['getUserPermissions'](user.role)
      })
    } catch (error) {
      // User doesn't exist, create new one
      await firebaseAuthService.createUser(user)
    }
  } catch (error) {
    console.error('Error syncing user with Firebase:', error)
    throw error
  }
}
