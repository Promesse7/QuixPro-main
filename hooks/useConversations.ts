"use client";

import { useState, useEffect, useCallback } from 'react';
import { database } from '@/lib/firebaseClient';
import { ref, onValue, off } from 'firebase/database';
import { emailToId } from '@/lib/userUtils';

export interface User {
    _id?: string;
    name: string;
    email: string;
    image?: string;
    school?: string;
    level?: string;
    isOnline?: boolean;
}

export interface Conversation {
    _id: string; // This is otherUserId (email) from aggregation
    otherUserId: string;
    lastMessage: string; // From Mongo or Firebase
    lastMessageTime: string;
    unreadCount: number;
    otherUser?: User;
}

export const useConversations = (userId: string) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        if (!userId) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'getDirectConversations',
                    data: { userId }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }

            const data = await response.json();
            setConversations(data.conversations || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Failed to load conversations');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Initial Fetch
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Real-time Firebase listener for conversation updates
    useEffect(() => {
        if (!userId || !database) return;

        const safeUserId = emailToId(userId);
        const convsRef = ref(database, `user_conversations/${safeUserId}`);

        const handleUpdate = (snapshot: any) => {
            const data = snapshot.val();
            if (!data) return;

            // Convert Firebase data to conversation format
            const firebaseConvs = Object.entries(data).map(([otherUserId, convData]: [string, any]) => ({
                _id: otherUserId,
                otherUserId: otherUserId,
                lastMessage: convData.lastMessage || 'No messages',
                lastMessageTime: convData.lastMessageTime || new Date().toISOString(),
                unreadCount: convData.unreadCount || 0,
                otherUser: {
                    name: otherUserId.replace(/[^a-zA-Z0-9@.]/g, '').split('@')[0] || 'User',
                    email: otherUserId,
                    isOnline: false // Will be updated by online status hook
                }
            }));

            // Merge with existing conversations from MongoDB
            setConversations(prev => {
                const merged = [...prev];
                
                // Update existing conversations
                firebaseConvs.forEach((firebaseConv) => {
                    const existingIndex = merged.findIndex(c => 
                        c.otherUserId === firebaseConv.otherUserId || 
                        emailToId(c.otherUserId) === firebaseConv.otherUserId
                    );
                    
                    if (existingIndex > -1) {
                        merged[existingIndex] = {
                            ...merged[existingIndex],
                            lastMessage: firebaseConv.lastMessage,
                            lastMessageTime: firebaseConv.lastMessageTime,
                            unreadCount: firebaseConv.unreadCount
                        };
                    } else {
                        // Add new Firebase conversation
                        merged.push(firebaseConv);
                    }
                });

                // Sort by last message time (descending)
                return merged.sort((a, b) => 
                    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                );
            });
        };

        const unsubscribe = onValue(convsRef, handleUpdate);

        return () => {
            off(convsRef, 'value', handleUpdate);
        };
    }, [userId, database, fetchConversations]);

    return {
        conversations,
        isLoading,
        error,
        refreshConversations: fetchConversations
    };
};
