"use client";

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, set, off, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUserId } from '@/lib/userUtils';

export function useTypingIndicator(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const currentUserId = getCurrentUserId();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Set typing status
  const setTyping = (isTyping: boolean) => {
    if (!conversationId || !database || !currentUserId) return;

    const typingRef = ref(database, `typing/${conversationId}/${currentUserId}`);
    
    if (isTyping) {
      // Set typing to true
      set(typingRef, {
        isTyping: true,
        lastUpdated: serverTimestamp(),
        userName: JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'Unknown'
      });

      // Auto-clear after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        set(typingRef, null);
      }, 3000);
    } else {
      // Clear typing immediately
      set(typingRef, null);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Listen for other users typing
  useEffect(() => {
    if (!conversationId || !database || !currentUserId) return;

    const typingRef = ref(database, `typing/${conversationId}`);
    
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const typingUsers: Record<string, boolean> = {};
        
        Object.entries(data).forEach(([userId, typingData]: [string, any]) => {
          // Don't include current user in typing list
          if (userId !== currentUserId && typingData?.isTyping) {
            // Check if typing is recent (within last 3 seconds)
            const lastUpdated = typingData.lastUpdated;
            const threeSecondsAgo = Date.now() - 3000;
            
            if (lastUpdated > threeSecondsAgo) {
              typingUsers[userId] = true;
            }
          }
        });
        
        setTypingUsers(typingUsers);
      } else {
        setTypingUsers({});
      }
    });

    return () => {
      off(typingRef, 'value', unsubscribe);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, currentUserId, database]);

  // Get typing users as array for display
  const getTypingUsersArray = (): string[] => {
    return Object.keys(typingUsers);
  };

  return { 
    setTyping, 
    typingUsers, 
    getTypingUsersArray,
    isSomeoneTyping: Object.keys(typingUsers).length > 0
  };
}
