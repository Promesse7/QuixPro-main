import { auth } from './firebaseClient';
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
    // Create user in Firebase Auth
    const { uid } = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Set custom claims for role-based access control
    await auth.setCustomUserClaims(uid, { role });

    return {
      success: true,
      firebaseUid: uid,
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
    return await firebaseAdmin.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
}
