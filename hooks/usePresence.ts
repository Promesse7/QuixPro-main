"use client";

import { useEffect } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebaseClient';

export function usePresence(userId: string | undefined) {
    useEffect(() => {
        if (!userId || !database) {
            return;
        }

        try {
            // References
            const userStatusRef = ref(database, `/status/${userId}`);
            const connectedRef = ref(database, '.info/connected');

            // Listener for connection state
            const unsubscribe = onValue(connectedRef, (snap) => {
                if (snap.val() === false) {
                    return;
                }

                // We are connected!
                // 1. Set onDisconnect hook: when we go offline, set status to offline and update lastSeen
                onDisconnect(userStatusRef).set({
                    state: 'offline',
                    last_seen: serverTimestamp(),
                }).then(() => {
                    // 2. Since we are currently connected, set status to online
                    set(userStatusRef, {
                        state: 'online',
                        last_seen: serverTimestamp(),
                    });
                }).catch((error) => {
                    console.warn('Failed to set presence status:', error);
                });
            });

            return () => {
                unsubscribe();
            };
        } catch (error) {
            console.warn('Presence system not available:', error);
        }
    }, [userId, database]);
}
