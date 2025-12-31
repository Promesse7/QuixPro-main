"use client";

import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUserId } from '@/lib/userUtils';
import { normalizeId, getDisplayName } from '@/lib/identifiers';

export interface Conversation {
  _id: string;
  otherUserId: string;
  otherUserEmail: string;
  lastMessage: string;
  lastMessageTime: string | number;
  unreadCount: number;
  otherUser?: {
    name: string;
    email: string;
    image?: string;
    isOnline?: boolean;
  };
}

export function useConversationsNative() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!currentUserId || !database) {
      setLoading(false);
      return;
    }

    console.log('Setting up Firebase native conversations listener for:', currentUserId);

    // Listen to conversations where current user is a participant
    const conversationsRef = ref(database, 'conversations');

    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const conversationList: Conversation[] = [];

        const normalizedCurrentUserId = normalizeId(currentUserId);

        Object.entries(data).forEach(([conversationId, convData]: [string, any]) => {
          // Check if current user is a participant using fuzzy matching
          const participantIds = Object.keys(convData.participants || {});
          const isParticipant = participantIds.some(id => normalizeId(id) === normalizedCurrentUserId);

          console.log(`Checking conversation ${conversationId}: isParticipant=${isParticipant}`, convData.participants);

          if (isParticipant) {
            // Find the other participant
            const otherParticipantId = participantIds.find(
              id => normalizeId(id) !== normalizedCurrentUserId
            );

            if (otherParticipantId) {
              // Get other user info from participant data or fallback
              const otherUserData = convData.participants[otherParticipantId];
              const cleanDisplayName = getDisplayName(otherParticipantId);

              conversationList.push({
                _id: conversationId,
                otherUserId: otherParticipantId,
                otherUserEmail: otherUserData?.email || normalizeId(otherParticipantId),
                lastMessage: convData.lastMessage || "No messages yet",
                lastMessageTime: convData.lastMessageTime || convData.createdAt || Date.now(),
                unreadCount: 0, // TODO: Calculate unread count
                otherUser: {
                  name: otherUserData?.name || cleanDisplayName || "User",
                  email: otherUserData?.email || normalizeId(otherParticipantId),
                  image: otherUserData?.image,
                  isOnline: otherUserData?.isOnline || false
                }
              });
            }
          }
        });

        // Sort by last message time
        conversationList.sort((a, b) => {
          const timeA = typeof a.lastMessageTime === 'object' ? a.lastMessageTime : new Date(a.lastMessageTime).getTime();
          const timeB = typeof b.lastMessageTime === 'object' ? b.lastMessageTime : new Date(b.lastMessageTime).getTime();
          return timeB - timeA;
        });

        console.log('Conversations loaded from Firebase native:', conversationList.length);
        setConversations(conversationList);
      } else {
        console.log('No conversations found');
        setConversations([]);
      }

      setLoading(false);
    }, (error) => {
      console.error('Error loading conversations:', error);
      setLoading(false);
    });

    return () => {
      off(conversationsRef, 'value', unsubscribe);
    };
  }, [currentUserId, database]);

  return {
    conversations,
    loading
  };
}

// Export as useConversations for compatibility
export { useConversationsNative as useConversations };
