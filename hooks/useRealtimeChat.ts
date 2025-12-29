"use client";

import { useEffect, useState, useMemo } from 'react';
import { ref, onChildAdded, off, query, limitToLast } from 'firebase/database';
import { database } from '@/lib/firebaseClient';

interface Message {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
    [key: string]: any;
}

export function useRealtimeChat(senderId: string, recipientId: string, initialMessages: Message[] = []) {
    const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

    // Reset realtime messages if the chat partners change
    useEffect(() => {
        setRealtimeMessages([]);
    }, [senderId, recipientId]);

    useEffect(() => {
        if (!senderId || !recipientId) return;

        // Must match backend logic: unique ID for the pair
        const conversationId = [senderId, recipientId].sort().join('_').replace(/[.#$\[\]]/g, '_');
        const messagesRef = ref(database, `direct_messages/${conversationId}`);

        // Listen for new messages. 
        // We start listening from "now" roughly. Or just limit to last few.
        // Ideally we'd use a timestamp query provided by startAt, but limitToLast(20) is a reasonable approximation for "current activity"
        const q = query(messagesRef, limitToLast(20));

        const handleNewMessage = (snapshot: any) => {
            const event = snapshot.val();
            if (!event) return;

            // Handle based on event type
            if (event.type === 'message.new') {
                const data = event.payload;
                setRealtimeMessages((prev) => {
                    if (prev.some(m => m._id === data._id)) return prev;
                    return [...prev, data];
                });
            } else if (event.type === 'chat.read') {
                const { readerId } = event.payload;
                // If the OTHER person read the chat, mark our sent messages as read
                if (readerId === recipientId) {
                    setRealtimeMessages(prev => prev.map(m =>
                        m.senderId === senderId ? { ...m, read: true } : m
                    ));
                    // Also might need to update initialMessages? 
                    // Since useMemo merges them, we'd need to handle that if we want full consistency.
                }
            }
        };

        const unsubscribe = onChildAdded(q, handleNewMessage);

        return () => {
            off(messagesRef, 'child_added', handleNewMessage);
        };
    }, [senderId, recipientId]);

    // Merge DB messages (history) with Realtime messages (new)
    const messages = useMemo(() => {
        // We need to deduplicate because initialMessages might eventually contain what realtime saw
        // or realtime might fetch something that was just loaded from DB
        const fastLookup = new Set(initialMessages.map(m => m._id));

        // Filter out messages that are ALREADY in initialMessages (legacy)
        const uniqueRealtime = realtimeMessages.filter(m => !fastLookup.has(m._id));

        return [...initialMessages, ...uniqueRealtime];
    }, [initialMessages, realtimeMessages]);

    return { messages };
}
