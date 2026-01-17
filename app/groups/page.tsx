// app/groups/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Group } from "@/models/index";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getCurrentUserId } from "@/lib/userUtils";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!currentUserId) return;

    const db = getDatabase();
    const groupsRef = ref(db, "groups");
    
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {
        const groupsList = Object.entries(groupsData).map(([id, group]: [string, any]) => ({
          _id: id,
          ...group,
          // Convert Firebase timestamp to Date if needed
          createdAt: group.createdAt ? new Date(group.createdAt) : new Date(),
          updatedAt: group.updatedAt ? new Date(group.updatedAt) : new Date(),
        }));
        setGroups(groupsList);
      } else {
        setGroups([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading groups:", error);
      setLoading(false);
    });

    return () => {
      off(groupsRef, "value", unsubscribe);
    };
  }, [currentUserId]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Groups</h1>
          <div className="w-full sm:w-auto">
            <Button onClick={() => router.push("/groups/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No groups found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new group.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/groups/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group) => (
                <div
                  key={group._id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/groups/${group._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-medium">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        <span>{group.members?.length || 0} members</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
