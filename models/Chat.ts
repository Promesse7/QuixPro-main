import { ObjectId } from "mongodb";

export interface Message {
  _id?: ObjectId;
  content: string;
  senderId: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: string[]; // Array of user IDs who have read the message
  type: 'text' | 'image' | 'file' | 'math';
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };
}

export interface Group {
  _id?: ObjectId;
  name: string;
  description?: string;
  createdBy: string; // User ID of the creator
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  members: Array<{
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
  }>;
  settings: {
    allowMemberInvites: boolean;
    readReceipts: boolean;
    messageEditWindow: number; // in minutes
  };
}

export interface UserGroup {
  _id?: ObjectId;
  userId: string;
  groupId: string;
  lastReadMessage?: ObjectId; // Last message ID read by the user
  notificationSettings: {
    mute: boolean;
    mentions: boolean;
  };
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
}

export interface TypingIndicator {
  _id?: ObjectId;
  groupId: string;
  userId: string;
  isTyping: boolean;
  lastUpdated: Date;
}
