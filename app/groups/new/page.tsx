// app/groups/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getDatabase, ref, push, set } from "firebase/database";
import { getCurrentUserId, getFirebaseId } from "@/lib/userUtils";

export default function NewGroupPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const currentUserId = getCurrentUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    if (!currentUserId) {
      setError("You must be logged in to create a group");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const db = getDatabase();
      const groupsRef = ref(db, "groups");
      const newGroupRef = push(groupsRef);
      
      const newGroup = {
        name: name.trim(),
        description: description.trim(),
        creatorId: currentUserId,
        members: [currentUserId],
        admins: [currentUserId],
        isPrivate,
        settings: {
          allowMemberInvites: true,
          allowMessageDeletion: true,
          allowMessageEditing: true,
          allowFileSharing: true,
          allowMentions: true,
          readReceipts: true,
          notifications: {
            enabled: true,
            mentionsOnly: false,
          },
          moderation: {
            adminOnlyMessages: false,
            memberApproval: false,
            contentFilter: true,
          },
          messageEditWindow: 15, // minutes
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await set(newGroupRef, newGroup);
      router.push(`/groups/${newGroupRef.key}`);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Group</h1>
          <p className="text-muted-foreground">
            Set up your group and invite members to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what this group is about"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="private" className="text-base">
                Private Group
              </Label>
              <p className="text-sm text-muted-foreground">
                Only members can see who's in the group and what they post.
              </p>
            </div>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Group"}
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}