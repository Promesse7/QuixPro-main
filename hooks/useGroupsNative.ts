"use client";

import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebaseClient';
import { getCurrentUserId } from '@/lib/userUtils';
import { normalizeId } from '@/lib/identifiers';

export interface Group {
    id: string;
    name: string;
    description: string;
    subject: string;
    level: string;
    memberCount: number;
    lastMessage?: {
        text: string;
        senderName: string;
        timestamp: any;
    };
}

export function useGroupsNative() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = getCurrentUserId();

    useEffect(() => {
        if (!currentUserId || !database) {
            setLoading(false);
            return;
        }

        const groupsRef = ref(database, 'groups');

        const unsubscribe = onValue(groupsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const groupList: Group[] = [];
                const normalizedCurrentUserId = normalizeId(currentUserId);

                Object.entries(data).forEach(([groupId, groupData]: [string, any]) => {
                    const members = groupData.members || {};
                    const isMember = Object.keys(members).some(id => normalizeId(id) === normalizedCurrentUserId);

                    if (isMember) {
                        groupList.push({
                            id: groupId,
                            ...groupData
                        });
                    }
                });

                // Sort by last message timestamp if available
                groupList.sort((a, b) => {
                    const timeA = a.lastMessage?.timestamp || 0;
                    const timeB = b.lastMessage?.timestamp || 0;
                    return (timeB as number) - (timeA as number);
                });

                setGroups(groupList);
            } else {
                setGroups([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error loading groups:', error);
            setLoading(false);
        });

        return () => {
            off(groupsRef, 'value', unsubscribe);
        };
    }, [currentUserId, database]);

    return {
        groups,
        loading
    };
}
