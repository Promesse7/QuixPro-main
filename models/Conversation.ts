import { ObjectId } from 'mongodb';

export interface Conversation {
  _id?: ObjectId;
  // For one-to-one conversations, participants will contain two user IDs.
  // For group conversations, participants may contain many user IDs or reference a Group._id.
  participants: string[];
  isGroup?: boolean;
  groupId?: string; // optional reference to Group._id as string
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
  // optional summary / last message preview
  lastMessage?: {
    messageId?: string;
    content?: string;
    senderId?: string;
    createdAt?: Date;
  };
}

export interface ConversationMember {
  userId: string;
  joinedAt: Date;
  role?: 'admin' | 'member';
}
