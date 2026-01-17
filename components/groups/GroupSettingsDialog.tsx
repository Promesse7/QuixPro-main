// components/group/GroupSettingsDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Group } from "@/models/index";

interface GroupSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  onSave: (updates: Partial<Group["settings"]>) => Promise<boolean>;
}

export function GroupSettingsDialog({ open, onOpenChange, group, onSave }: GroupSettingsDialogProps) {
  const [settings, setSettings] = useState(group.settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(settings);
    setIsSaving(false);
    
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Group Name</h3>
            <Input
              value={group.name}
              disabled
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Permissions</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow Member Invites</Label>
                <p className="text-sm text-muted-foreground">
                  Allow members to invite others
                </p>
              </div>
              <Switch
                checked={settings.allowMemberInvites}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowMemberInvites: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow Message Deletion</Label>
                <p className="text-sm text-muted-foreground">
                  Allow members to delete their messages
                </p>
              </div>
              <Switch
                checked={settings.allowMessageDeletion}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowMessageDeletion: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow File Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow members to share files
                </p>
              </div>
              <Switch
                checked={settings.allowFileSharing}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowFileSharing: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Read Receipts</Label>
                <p className="text-sm text-muted-foreground">
                  Show read receipts for messages
                </p>
              </div>
              <Switch
                checked={settings.readReceipts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, readReceipts: checked })
                }
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Moderation</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Admin-Only Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Only admins can send messages
                </p>
              </div>
              <Switch
                checked={settings.moderation.adminOnlyMessages}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    moderation: { ...settings.moderation, adminOnlyMessages: checked },
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Member Approval</Label>
                <p className="text-sm text-muted-foreground">
                  New members require admin approval
                </p>
              </div>
              <Switch
                checked={settings.moderation.memberApproval}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    moderation: { ...settings.moderation, memberApproval: checked },
                  })
                }
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}