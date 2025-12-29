import { getCurrentUser } from '@/lib/auth';

// Get current user ID (use MongoDB ObjectId for consistency)
export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  if (!user) return null;

  // Use MongoDB ObjectId from auth system (primary key)
  return user.id;
}

// Enhanced getCurrentUser that ensures ID is available
export function getCurrentUserWithId() {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    ...user,
    id: user.id // Use MongoDB ObjectId directly
  };
}

// Email-to-ID mapping for Firebase compatibility (keep for existing data)
const EMAIL_TO_ID_MAP: Record<string, string> = {
  'aline.uwimana@student.rw': 'user_aline_001',
  'promesserukundo@gmail.com': 'user_promesse_002',
  'test@example.com': 'user_test_003',
  // Add more mappings as needed
};

// Generate Firebase-safe ID from email (for legacy compatibility)
export function emailToId(email: string): string {
  if (EMAIL_TO_ID_MAP[email]) {
    return EMAIL_TO_ID_MAP[email];
  }

  // SANITIZE: Firebase keys cannot contain . # $ [ ]
  // We'll replace all non-alphanumeric with underscores
  return `user_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
}

// Get Firebase-safe ID for conversation paths
export function getFirebaseId(userId: string): string {
  // If it's already a Firebase-safe ID, return as-is
  if (userId.startsWith('user_')) {
    return userId;
  }
  
  // Otherwise, try to map from email or generate
  const user = getCurrentUser();
  if (user && user.id === userId) {
    return emailToId(user.email);
  }
  
  // Fallback: sanitize the ID
  return userId.replace(/[^a-zA-Z0-9]/g, '_');
}
