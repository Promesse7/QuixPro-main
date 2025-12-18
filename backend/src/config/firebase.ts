import admin from 'firebase-admin'
import { getEnv } from './env'

let app: admin.app.App | null = null

export function initFirebase() {
  if (app) return app
  const { FIREBASE_SERVICE_ACCOUNT } = getEnv()
  if (!FIREBASE_SERVICE_ACCOUNT) {
    // Not configured in this environment; skip initialization
    return null
  }
  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT)
  app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  return app
}

export function getFirebaseAdmin() {
  initFirebase()
  return admin
}
