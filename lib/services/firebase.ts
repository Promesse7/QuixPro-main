import type { Message } from "@/models/Chat"
import { emailToFirebaseId } from "@/lib/userUtils"

let firebaseApp: any = null
let auth: any = null
let firestore: any = null
let realtimeDb: any = null

function ensureFirebaseInitialized() {
  if (firebaseApp) return

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")

  const admin = require("firebase-admin")

  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  } else {
    firebaseApp = admin.apps[0]
  }

  auth = admin.auth()
  firestore = admin.firestore()
  realtimeDb = admin.database()
}

export const firebaseAdmin = {
  async createCustomToken(uid: string, additionalClaims = {}) {
    ensureFirebaseInitialized()
    if (!auth) throw new Error("Firebase not initialized")
    return auth.createCustomToken(uid, additionalClaims)
  },

  async verifyIdToken(token: string) {
    ensureFirebaseInitialized()
    if (!auth) throw new Error("Firebase not initialized")
    return auth.verifyIdToken(token)
  },

  // --- Realtime Database Methods ---

  async syncGroupMembers(groupId: string, memberIds: string[]) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")
    const membersObject = memberIds.reduce(
      (acc, memberId) => {
        acc[memberId] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    const groupMembersRef = realtimeDb.ref(`groups/${groupId}/members`)
    await groupMembersRef.set(membersObject)
  },

  async addUserToGroup(groupId: string, userId: string) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")
    const userMemberRef = realtimeDb.ref(`groups/${groupId}/members/${userId}`)
    await userMemberRef.set(true)
  },

  async removeUserFromGroup(groupId: string, userId: string) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")
    const userMemberRef = realtimeDb.ref(`groups/${groupId}/members/${userId}`)
    await userMemberRef.remove()
  },

  async publishMessage(message: Omit<Message, "_id" | "readBy">) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")
    const { groupId } = message
    if (!groupId) {
      console.error("Cannot publish message without a groupId")
      return
    }
    const messagesRef = realtimeDb.ref(`messages/${groupId}`).push()
    await messagesRef.set(message)
  },

  async publishDirectMessage(senderEmail: string, recipientEmail: string, message: any) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")

    const senderId = emailToFirebaseId(senderEmail)
    const recipientId = emailToFirebaseId(recipientEmail)
    const conversationId = [senderId, recipientId].sort().join("_")

    const signal = {
      type: "message.new",
      payload: {
        _id: message._id.toString(),
        content: message.content,
        senderId: senderId,
        recipientId: recipientId,
        createdAt: message.createdAt.toISOString(),
        type: message.type || "text",
      },
      timestamp: Date.now(),
    }

    const messagesRef = realtimeDb.ref(`conversations/${conversationId}/messages`).push()
    await messagesRef.set({
      ...message,
      senderEmail,
      senderId,
      recipientId,
      senderName: message.senderName || senderEmail.split("@")[0],
      createdAt: message.createdAt.toISOString ? message.createdAt.toISOString() : message.createdAt,
      _id: messagesRef.key,
    })

    const updateConversation = async (uid: string, otherUid: string, unreadInc: number) => {
      const ref = realtimeDb.ref(`user_conversations/${uid}/${otherUid}`)
      await ref.update({
        lastMessage: message.content,
        lastMessageTime: message.createdAt.toISOString ? message.createdAt.toISOString() : message.createdAt,
        unreadCount: firebaseAdmin.increment(unreadInc),
        otherUserId: otherUid,
        otherUserEmail: recipientEmail,
        otherUserName: message.senderName || senderEmail.split("@")[0],
      })
    }

    await updateConversation(senderId, recipientId, 0)
    await updateConversation(recipientId, senderId, 1)
  },

  increment(val: number) {
    const admin = require("firebase-admin")
    return admin.database.ServerValue.increment(val)
  },

  async markConversationAsRead(userEmail: string, otherUserEmail: string) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")

    const userId = emailToFirebaseId(userEmail)
    const otherUserId = emailToFirebaseId(otherUserEmail)

    const ref = realtimeDb.ref(`user_conversations/${userId}/${otherUserId}`)
    await ref.update({
      lastReadAt: Date.now(),
      unreadCount: 0,
    })

    const conversationId = [userId, otherUserId].sort().join("_")
    const messagesRef = realtimeDb.ref(`conversations/${conversationId}/messages`).push()
    await messagesRef.set({
      type: "chat.read",
      payload: {
        readerId: userId,
        readAt: new Date().toISOString(),
      },
      timestamp: Date.now(),
    })
  },

  async setUserTyping(userId: string, groupId: string, isTyping: boolean) {
    ensureFirebaseInitialized()
    if (!realtimeDb) throw new Error("Firebase Realtime DB not initialized")
    const typingRef = realtimeDb.ref(`typingIndicators/${groupId}/${userId}`)
    if (isTyping) {
      await typingRef.set({ isTyping: true, lastUpdated: Date.now() })
    } else {
      await typingRef.remove()
    }
  },
}

export default firebaseAdmin
