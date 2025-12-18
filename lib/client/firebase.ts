import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

let firebaseApp: any = null
export function initFirebaseClient() {
  if (getApps().length) return getApps()[0]
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  }
  if (!config.apiKey) return null
  firebaseApp = initializeApp(config)
  return firebaseApp
}

export function getClientAuth() {
  const app = initFirebaseClient()
  if (!app) return null
  return getAuth(app)
}
