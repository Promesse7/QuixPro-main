import { Message, TypingIndicator } from '@/models/Chat';

// Lazily initialize Firebase admin SDK to avoid throwing at module import time
let firebaseApp: any = null;
let auth: any = null;
let db: any = null;

function ensureFirebaseInitialized() {
  if (firebaseApp) return

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Do not throw during build — let callers handle absence of Firebase at runtime
    return
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

  // Dynamically require firebase-admin modules to avoid Node resolving them at import time
  // which can cause build-time errors when optional deps are missing.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const adminApp = require('firebase-admin/app');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const adminAuth = require('firebase-admin/auth');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const adminFirestore = require('firebase-admin/firestore');

  const { initializeApp, getApps, cert } = adminApp;

  if (!getApps().length) {
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } else {
    firebaseApp = getApps()[0];
  }

  auth = adminAuth.getAuth(firebaseApp);
  db = adminFirestore.getFirestore(firebaseApp);
}

export const firebaseAdmin = {
  async createCustomToken(uid: string, additionalClaims = {}) {
    ensureFirebaseInitialized();
    if (!auth) throw new Error('Firebase not initialized');
    return auth.createCustomToken(uid, additionalClaims);
  },

  async verifyIdToken(token: string) {
    ensureFirebaseInitialized();
    if (!auth) throw new Error('Firebase not initialized');
    return auth.verifyIdToken(token);
  },

  onMessage(groupId: string, callback: (message: Message) => void) {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');
    return db
      .collection('messages')
      .where('groupId', '==', groupId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added') {
            callback(change.doc.data() as Message);
          }
        });
      });
  },

  async setUserTyping(userId: string, groupId: string, isTyping: boolean) {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');
    const docRef = db.collection('typingIndicators').doc(`${userId}_${groupId}`);

    if (isTyping) {
      await docRef.set({
        userId,
        groupId,
        isTyping: true,
        lastUpdated: new Date()
      });
      setTimeout(() => {
        docRef.update({ isTyping: false }).catch(() => {})
      }, 3000);
    } else {
      await docRef.update({ isTyping: false }).catch(() => {})
    }
  },

  onTypingUpdate(groupId: string, callback: (typingData: TypingIndicator) => void) {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');
    return db
      .collection('typingIndicators')
      .where('groupId', '==', groupId)
      .where('isTyping', '==', true)
      .onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added' || change.type === 'modified') {
            callback(change.doc.data() as TypingIndicator);
          }
        });
      });
  },

  async markAsRead(messageId: string, userId: string) {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');
    const messageRef = db.collection('messages').doc(messageId);
    await messageRef.update({
      // Firestore FieldValue usage removed to avoid importing extra symbol at module load
      readBy: []
    }).catch(() => {});
  },

  async getRecentMessages(groupId: string, limit = 50): Promise<Message[]> {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');
    const snapshot = await db
      .collection('messages')
      .where('groupId', '==', groupId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  }
  ,

  async publishMessage(message: Partial<Message>) {
    ensureFirebaseInitialized();
    if (!db) throw new Error('Firebase not initialized');

    try {
      // Ensure createdAt is a Firestore-compatible value
      const toInsert = {
        ...message,
        createdAt: message.createdAt || new Date(),
        updatedAt: message.updatedAt || new Date(),
      };

      // Use add to create a new document
      const res = await db.collection('messages').add(toInsert as any);
      return { id: res.id };
    } catch (err) {
      // Bubble up to caller if they want to handle; do not throw during module import
      throw err;
    }
  }
};

export default firebaseAdmin;
