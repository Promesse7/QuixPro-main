// app/groups/[id]/page.tsx
"use client";

import { GroupChat } from "@/components/groups/GroupChat";
import { getDatabase, ref, get } from "firebase/database";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Group } from "@/models/index";
import { getCurrentUserId } from "@/lib/userUtils";

export default function GroupPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const groupId = params.id;
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!groupId || !currentUserId) return;

    const loadGroup = async () => {
      try {
        const db = getDatabase();
        const groupRef = ref(db, `groups/${groupId}`);
        const snapshot = await get(groupRef);

        if (!snapshot.exists()) {
          setError("Group not found");
          setLoading(false);
          return;
        }

        const groupData = snapshot.val();
        setGroup({
          _id: groupId,
          ...groupData,
        });
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId, currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-destructive">{error || "Group not found"}</div>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/groups"}
        >
          Back to Groups
        </Button>
      </div>
    );
  }

  // Check if user is a member of the group
  const isMember = group.members?.includes(currentUserId);
  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div>You are not a member of this group</div>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/groups"}
        >
          Back to Groups
        </Button>
      </div>
    );
  }

  return <GroupChat />;
}