import { auth as firebaseAuth } from './firebaseClient';
import { firebaseAdmin } from './services/firebase';
import { UserRole } from '@/models/User';

export interface CreateFirebaseUserParams {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  level?: string;
}

export async function createFirebaseUser({
  email,
  password,
  name,
  role,
  level,
}: CreateFirebaseUserParams) {
  try {
    ensureFirebaseInitialized();
    if (!firebaseAdmin.auth) {
      throw new Error('Firebase Admin not initialized');
    }

    // Create user in Firebase Auth
    const userRecord = await firebaseAdmin.auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Set custom claims for role-based access control
    await firebaseAdmin.auth.setCustomUserClaims(userRecord.uid, { role });

    return {
      success: true,
      firebaseUid: userRecord.uid,
      email,
      name,
      role,
      level,
    };
  } catch (error: any) {
    console.error('Error creating Firebase user:', error);
    throw new Error(`Failed to create Firebase user: ${error.message}`);
  }
}

export async function verifyIdToken(token: string) {
  try {
    ensureFirebaseInitialized();
    if (!firebaseAdmin.auth) {
      throw new Error('Firebase Admin not initialized');
    }
    return await firebaseAdmin.auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
}

// New function to get Firebase token for MongoDB user
export async function getFirebaseTokenForUser(email: string, password: string) {
  try {
    ensureFirebaseInitialized();
    if (!firebaseAdmin.auth) {
      throw new Error('Firebase Admin not initialized');
    }

    // Get existing Firebase user
    const userRecord = await firebaseAdmin.auth.getUserByEmail(email);

    // Create custom token for user
    const customToken = await firebaseAdmin.auth.createCustomToken(userRecord.uid, {
      email: email,
      role: userRecord.customClaims?.role || 'student'
    });

    return customToken;
  } catch (error: any) {
    console.error('Error getting Firebase token:', error);
    throw new Error(`Failed to get Firebase token: ${error.message}`);
  }
}

// Function to sync MongoDB user with Firebase
export async function syncUserWithFirebase(mongoUser: any) {
  try {
    ensureFirebaseInitialized();
    if (!firebaseAdmin.auth) {
      throw new Error('Firebase Admin not initialized');
    }

    let firebaseUser;

    try {
      // Try to get existing Firebase user
      firebaseUser = await firebaseAdmin.auth.getUserByEmail(mongoUser.email);
    } catch (error) {
      // User doesn't exist in Firebase, create them
      firebaseUser = await firebaseAdmin.auth.createUser({
        email: mongoUser.email,
        uid: mongoUser._id.toString(), // Use MongoDB ID as Firebase UID
        displayName: mongoUser.name,
        emailVerified: true,
        password: Math.random().toString(36).slice(-8), // Random password
      });
    }

    // Set custom claims
    await firebaseAdmin.auth.setCustomUserClaims(firebaseUser.uid, {
      email: mongoUser.email,
      role: mongoUser.role || 'student',
      level: mongoUser.level || 'Beginner',
      mongoId: mongoUser._id.toString()
    });

    return firebaseUser;
  } catch (error: any) {
    console.error('Error syncing user with Firebase:', error);
    throw new Error(`Failed to sync user with Firebase: ${error.message}`);
  }
}

// Helper function to ensure Firebase is initialized
function ensureFirebaseInitialized() {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin SDK not initialized. Check environment variables.');
  }
}
