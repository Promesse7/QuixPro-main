import { getCurrentUser } from '@/lib/auth';

// Simple email-to-ID mapping (in production, this would come from your database)
const EMAIL_TO_ID_MAP: Record<string, string> = {
  'aline.uwimana@student.rw': 'user_aline_001',
  'promesserukundo@gmail.com': 'user_promesse_002',
  'test@example.com': 'user_test_003',
  // Add more mappings as needed
};

// Generate consistent ID from email
export function emailToId(email: string): string {
  if (EMAIL_TO_ID_MAP[email]) {
    return EMAIL_TO_ID_MAP[email];
  }

  // SANITIZE: Firebase keys cannot contain . # $ [ ]
  // We'll replace all non-alphanumeric with underscores
  return `user_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
}

// Get current user ID (always use emailToId for Firebase consistency)
export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  if (!user) return null;

  return emailToId(user.email);
}

// Enhanced getCurrentUser that ensures ID is available
export function getCurrentUserWithId() {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    ...user,
    id: user.id || emailToId(user.email)
  };
}
