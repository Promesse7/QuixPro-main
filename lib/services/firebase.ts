import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { Message, TypingIndicator } from '@/models/Chat';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

let firebaseApp: App;

if (!getApps().length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  }
  
  firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
} else {
  firebaseApp = getApps()[0];
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Firestore collections
export const messagesCollection = db.collection('messages');
export const groupsCollection = db.collection('groups');
export const typingIndicatorsCollection = db.collection('typingIndicators');

export const firebaseAdmin = {
  // Generate custom token for Firebase Auth
  async createCustomToken(uid: string, additionalClaims = {}) {
    return auth.createCustomToken(uid, additionalClaims);
  },

  // Verify Firebase ID token
  async verifyIdToken(token: string) {
    return auth.verifyIdToken(token);
  },

  // Real-time message listeners
  onMessage(groupId: string, callback: (message: Message) => void) {
    return messagesCollection
      .where('groupId', '==', groupId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(change.doc.data() as Message);
          }
        });
      });
  },

  // Typing indicators
  async setUserTyping(userId: string, groupId: string, isTyping: boolean) {
    const docRef = typingIndicatorsCollection.doc(`${userId}_${groupId}`);
    
    if (isTyping) {
      await docRef.set({
        userId,
        groupId,
        isTyping: true,
        lastUpdated: new Date()
      });
      // Auto-clear typing indicator after 3 seconds
      setTimeout(() => {
        docRef.update({ isTyping: false });
      }, 3000);
    } else {
      await docRef.update({ isTyping: false });
    }
  },

  onTypingUpdate(groupId: string, callback: (typingData: TypingIndicator) => void) {
    return typingIndicatorsCollection
      .where('groupId', '==', groupId)
      .where('isTyping', '==', true)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            callback(change.doc.data() as TypingIndicator);
          }
        });
      });
  },

  // Mark message as read
  async markAsRead(messageId: string, userId: string) {
    const messageRef = messagesCollection.doc(messageId);
    await messageRef.update({
      readBy: getFirestore.FieldValue.arrayUnion(userId)
    });
  },

  // Get recent messages for a group
  async getRecentMessages(groupId: string, limit = 50): Promise<Message[]> {
    const snapshot = await messagesCollection
      .where('groupId', '==', groupId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  }
};

export default firebaseAdmin;
