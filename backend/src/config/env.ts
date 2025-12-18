export const getEnv = () => ({
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/quix',
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT || '',
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret',
})
