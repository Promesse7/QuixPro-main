// Firebase client configuration for chat system
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://your-project-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to authenticate with Firebase using custom token
export async function authenticateWithFirebase(customToken: string) {
  try {
    const result = await signInWithCustomToken(auth, customToken);
    return result.user;
  } catch (error) {
    console.error('Firebase authentication error:', error);
    throw error;
  }
}

// Function to get Firebase auth token for MongoDB user
export async function getFirebaseToken(email: string) {
  try {
    const response = await fetch('/api/auth/sync-firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync with Firebase');
    }
    
    const data = await response.json();
    
    // Get custom token from Firebase Admin SDK
    const tokenResponse = await fetch('/api/auth/get-custom-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get custom token');
    }
    
    const tokenData = await tokenResponse.json();
    return tokenData.token;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    throw error;
  }
}

export { app, auth, database };
