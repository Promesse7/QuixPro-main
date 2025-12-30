'use client';

import { ThemeProvider } from 'next-themes';
import { usePresence } from '@/hooks/usePresence';
import { authenticateWithFirebase } from '@/lib/firebaseClient';
import { getCurrentUser } from '@/lib/auth';
import { useEffect } from 'react';
import { getCurrentUserId, getFirebaseId } from '@/lib/userUtils';

export default function Provider({ children }: { children: React.ReactNode }) {
  const userId = getCurrentUserId();
  const firebaseId = userId ? getFirebaseId(userId) : undefined;

  // Temporarily disable Firebase authentication to test basic functionality
  // useEffect(() => {
  //   if (firebaseId) {
  //     authenticateWithFirebase(firebaseId);
  //   }
  // }, [firebaseId]);

  usePresence(firebaseId);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
