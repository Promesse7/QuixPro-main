// components/groups/AddMembersDialog.tsx (updated)
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onAddMember: (userId: string, role: string) => Promise<boolean>;
}

export function AddMembersDialog({ open, onOpenChange, groupId, onAddMember }: AddMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    
    setIsAdding(true);
    let allSucceeded = true;
    
    for (const user of selectedUsers) {
      const success = await onAddMember(user.id, "member");
      if (!success) {
        allSucceeded = false;
      }
    }
    
    setIsAdding(false);
    
    if (allSucceeded) {
      setSelectedUsers([]);
      setSearchQuery("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isAdding}
            />
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="ml-1 rounded-full hover:bg-accent"
                    disabled={isAdding}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-4 text-muted-foreground">
                Searching...
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            ) : (
              searchResults
                .filter(user => !selectedUsers.some(selected => selected.id === user.id))
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleAddUser(user)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isAdding}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0 || isAdding}
          >
            {isAdding ? "Adding..." : `Add ${selectedUsers.length} Member${selectedUsers.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}