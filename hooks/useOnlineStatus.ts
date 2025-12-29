"use client";

import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebaseClient';

export interface UserStatus {
  state: 'online' | 'offline';
  last_seen: number | null;
}

export function useOnlineStatus(userId: string) {
  const [status, setStatus] = useState<UserStatus>({
    state: 'offline',
    last_seen: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !database) {
      setLoading(false);
      return;
    }

    const statusRef = ref(database, `/status/${userId}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStatus({
          state: data.state || 'offline',
          last_seen: data.last_seen || null,
        });
      } else {
        setStatus({
          state: 'offline',
          last_seen: null,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading user status:', error);
      setLoading(false);
    });

    return () => {
      off(statusRef);
      unsubscribe();
    };
  }, [userId, database]);

  const isOnline = status.state === 'online';
  const lastSeenText = status.last_seen 
    ? new Date(status.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return { status, isOnline, lastSeenText, loading };
}
