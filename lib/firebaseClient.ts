import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithCustomToken, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const validateFirebaseConfig = () => {
    const requiredFields: (keyof typeof firebaseConfig)[] = ['apiKey', 'projectId', 'appId', 'databaseURL'];
    const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);

    if (missingFields.length > 0) {
        return false;
    }
    return true;
};

let app: any = null;
let database: any = null;
let auth: Auth | null = null;

// Initialize Firebase only if config is valid
if (validateFirebaseConfig()) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        database = getDatabase(app);
        auth = getAuth(app);
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.warn('Failed to initialize Firebase:', error);
    }
}

async function authenticateWithFirebase(uid: string) {
    if (!auth || !uid) return;

    if (auth.currentUser && auth.currentUser.uid === uid) {
        return;
    }

    try {
        const response = await fetch('/api/auth/firebase-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Firebase token');
        }

        const { token } = await response.json();
        await signInWithCustomToken(auth, token);
        console.log('Firebase authenticated successfully as:', uid);
    } catch (error) {
        console.warn('Firebase authentication failed:', error);
    }
}

export { app, database, auth, authenticateWithFirebase };
