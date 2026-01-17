import { useState, useEffect, useCallback } from 'react';
import { Group, GroupRole, Message, UserGroup } from '@/models/Chat';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

interface GroupMember extends Omit<UserGroup, 'groupId'> {
  username: string;
  avatar?: string;
  isOnline?: boolean;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to load groups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchGroup = useCallback(async (groupId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error('Failed to fetch group');
      const group = await response.json();
      setCurrentGroup(group);
      return group;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to load group',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchGroupMembers = useCallback(async (groupId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/members`);
      if (!response.ok) throw new Error('Failed to fetch group members');
      const data = await response.json();
      setMembers(data.members || []);
      return data.members;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to load group members',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createGroup = useCallback(async (groupData: Partial<Group>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create group');
      }
      
      const newGroup = await response.json();
      setGroups(prev => [...prev, newGroup]);
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
      return newGroup;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateGroup = useCallback(async (groupId: string, updates: Partial<Group>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update group');
      }
      
      const updatedGroup = await response.json();
      setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(updatedGroup);
      }
      
      toast({
        title: 'Success',
        description: 'Group updated successfully',
      });
      
      return updatedGroup;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to update group',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup?._id, toast]);

  const deleteGroup = useCallback(async (groupId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete group');
      }
      
      setGroups(prev => prev.filter(g => g._id !== groupId));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(null);
      }
      
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
      });
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup?._id, toast]);

  const addGroupMember = useCallback(async (groupId: string, userId: string, role: GroupRole = 'member') => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add member');
      }
      
      const updatedGroup = await response.json();
      setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(updatedGroup);
      }
      
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
      
      return updatedGroup;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup?._id, toast]);

  const updateMemberRole = useCallback(async (groupId: string, memberId: string, role: GroupRole) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update member role');
      }
      
      const updatedGroup = await response.json();
      setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(updatedGroup);
      }
      
      toast({
        title: 'Success',
        description: 'Member role updated',
      });
      
      return updatedGroup;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup?._id, toast]);

  const removeMember = useCallback(async (groupId: string, memberId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove member');
      }
      
      const updatedGroup = await response.json();
      setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(updatedGroup);
      }
      
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
      
      return updatedGroup;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentGroup?._id, toast]);

  const leaveGroup = useCallback(async (groupId: string) => {
    if (!user) return;
    return removeMember(groupId, user.id);
  }, [user, removeMember]);

  const updateGroupSettings = useCallback(async (groupId: string, settings: Partial<Group['settings']>) => {
    return updateGroup(groupId, { settings } as Partial<Group>);
  }, [updateGroup]);

  const updateNotificationSettings = useCallback(async (groupId: string, notificationSettings: Partial<GroupMember['notificationSettings']>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update notification settings');
      }
      
      const updatedSettings = await response.json();
      
      // Update local state
      setMembers(prev => prev.map(member => 
        member.userId === user?.id 
          ? { ...member, notificationSettings: { ...member.notificationSettings, ...updatedSettings } } 
          : member
      ));
      
      toast({
        title: 'Success',
        description: 'Notification settings updated',
      });
      
      return updatedSettings;
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast, user?.id]);

  // Effect to fetch groups when component mounts
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    // State
    groups,
    currentGroup,
    members,
    isLoading,
    error,
    
    // Actions
    createGroup,
    fetchGroup,
    updateGroup,
    deleteGroup,
    fetchGroupMembers,
    addGroupMember,
    updateMemberRole,
    removeMember,
    leaveGroup,
    updateGroupSettings,
    updateNotificationSettings,
    setCurrentGroup,
    refresh: fetchGroups,
  };
}
