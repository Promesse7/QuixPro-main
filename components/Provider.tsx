'use client';

import { ThemeProvider } from 'next-themes';
import { usePresence } from '@/hooks/usePresence';
import { getCurrentUser } from '@/lib/auth';
import { useEffect } from 'react';
import { getCurrentUserId } from '@/lib/userUtils';

export default function Provider({ children }: { children: React.ReactNode }) {
  const userId = getCurrentUserId();

  // Skip Firebase authentication for now - using public rules
  // useEffect(() => {
  //   if (userId) {
  //     authenticateWithFirebase(userId);
  //   }
  // }, [userId]);

  usePresence(userId || undefined);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
