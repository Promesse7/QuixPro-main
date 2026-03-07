// Firebase client authentication helper
import { getAuth, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebase-client-config'

const auth = getAuth(app)

export async function authenticateWithFirebase() {
  try {
    // Try to get custom token from server
    const response = await fetch('/api/auth/get-custom-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    if (!response.ok) {
      throw new Error('Failed to get custom token')
    }
    
    const data = await response.json()
    const customToken = data.token
    
    // Sign in with custom token
    const result = await signInWithCustomToken(auth, customToken)
    return result.user
  } catch (error) {
    console.error('Firebase authentication error:', error)
    throw error
  }
}

export function onFirebaseAuthStateChanged(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentFirebaseUser() {
  return auth.currentUser
}

export { auth }
