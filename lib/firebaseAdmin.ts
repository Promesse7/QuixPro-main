import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Firebase Admin configuration for server-side use
const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

let adminApp: any = null
let adminAuth: any = null

export function getFirebaseAdminApp() {
  if (!adminApp) {
    // Check if Firebase Admin is already initialized
    if (getApps().length > 0) {
      adminApp = getApp()
    } else {
      // Initialize with service account if available, otherwise skip auth features
      if (firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
        adminApp = initializeApp({
          credential: cert({
            projectId: firebaseAdminConfig.projectId,
            clientEmail: firebaseAdminConfig.clientEmail,
            privateKey: firebaseAdminConfig.privateKey,
          }),
          databaseURL: firebaseAdminConfig.databaseURL,
        })
      } else {
        // Initialize without auth for development/testing
        adminApp = initializeApp({
          projectId: firebaseAdminConfig.projectId,
          databaseURL: firebaseAdminConfig.databaseURL,
        })
      }
    }
  }
  return adminApp
}

export function getFirebaseAdminAuth() {
  if (!adminAuth) {
    const app = getFirebaseAdminApp()
    try {
      adminAuth = getAuth(app)
    } catch (error) {
      console.warn('Firebase Admin Auth not available:', error)
      adminAuth = null
    }
  }
  return adminAuth
}
