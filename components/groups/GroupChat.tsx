// components/group/GroupChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Users, Settings, Plus, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGroupChat } from "@/hooks/useGroupChat";
import { GroupSettingsDialog } from "./GroupSettingsDialog";
import { AddMembersDialog } from "./AddMembersDialog";
import {getCurrentUserId} from "@/lib/userUtils";
export function GroupChat() {
  const { id: groupId } = useParams();
  const [message, setMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    group,
    loading,
    error,
    typingUsers,
    sendMessage,
    setTyping,
    addMember,
    removeMember,
    updateMemberRole,
    updateGroupSettings,
  } = useGroupChat({ groupId: groupId as string });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const success = await sendMessage(message);
    if (success) {
      setMessage("");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(true);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        Group not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={group.avatar} />
            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{group.name}</h2>
            <p className="text-sm text-muted-foreground">
              {Object.keys(typingUsers).length > 0
                ? `${Object.keys(typingUsers).join(", ")} is typing...`
                : `${group.members?.length || 0} members`}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddMembersOpen(true)}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === getCurrentUserId() ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === getCurrentUserId()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {msg.senderId === getCurrentUserId() ? "You" : msg.senderName}
                </div>
                <div>{msg.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyDown={() => setTyping(true)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Dialogs */}
      <GroupSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        group={group}
        onSave={updateGroupSettings}
      />
      
      <AddMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        groupId={groupId as string}
        onAddMember={addMember}
      />
    </div>
  );
}

// Helper function to get current user ID
