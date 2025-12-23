import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, Auth } from 'firebase/auth';
import { getDatabase, ref, onChildAdded, off, Database } from 'firebase/database';
import { Chat } from '@/models';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

function initializeFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  auth = getAuth(firebaseApp);
  db = getDatabase(firebaseApp);
}

async function getFirebaseToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/firebase-token');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase token');
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function authenticateWithFirebase() {
  if (!auth) throw new Error('Firebase not initialized.');
  if (auth.currentUser) return;

  const token = await getFirebaseToken();
  if (token) {
    await signInWithCustomToken(auth, token);
  }
}

export const firebaseClient = {
  async initialize() {
    initializeFirebase();
    await authenticateWithFirebase();
  },

  onMessage(groupId: string, callback: (message: Chat) => void) {
    if (!db) throw new Error('Firebase not initialized.');
    const messagesRef = ref(db, `messages/${groupId}`);
    const listener = onChildAdded(messagesRef, (snapshot) => {
      callback(snapshot.val() as Chat);
    });
    return () => off(messagesRef, 'child_added', listener);
  },

  onTyping(groupId: string, callback: (typingData: { [userId: string]: any }) => void) {
    if (!db) throw new Error('Firebase not initialized.');
    const typingRef = ref(db, `typingIndicators/${groupId}`);
    const listener = onChildAdded(typingRef, (snapshot) => {
      callback({ [snapshot.key as string]: snapshot.val() });
    });
    return () => off(typingRef, 'child_added', listener);
  },

  async setTyping(groupId: string, isTyping: boolean) {
    // Note: This requires a corresponding API route to be created
    await fetch(`/api/groups/${groupId}/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isTyping }),
    });
  },
};
