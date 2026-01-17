import type { ObjectId } from "mongodb"

export type MessageType = 'text' | 'image' | 'file' | 'math' | 'system' | 'announcement';

export interface Mention {
  userId: string;
  username: string;
  position: [number, number]; // [start, end] indices in content
}

export interface Message {
  _id?: ObjectId;
  content: string;
  senderId: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: string[]; // Array of user IDs who have read the message
  type: MessageType;
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    thumbnails?: {
      small?: string;
      medium?: string;
    };
  };
  mentions?: Mention[];
  replyTo?: string; // Message ID this message is replying to
  isPinned?: boolean;
  pinnedBy?: string; // User ID who pinned the message
  pinnedAt?: Date;
  isEdited?: boolean;
  reactions?: Record<string, string[]>; // { 'emoji': [userIds] }
  systemAction?: {
    type: 'member_joined' | 'member_left' | 'group_created' | 'name_changed' | 'avatar_changed' | 'member_role_changed';
    data?: Record<string, any>;
  };
}

export interface Conversation {
  _id?: ObjectId
  groupId: string
  participants: string[] // Array of user IDs
  lastMessage?: {
    content: string
    senderId: string
    timestamp: Date
  }
  unreadCount?: {
    [userId: string]: number // Unread message count per user
  }
  createdAt: Date
  updatedAt: Date
}

export type GroupRole = 'admin' | 'moderator' | 'member';

export interface Group {
  _id?: ObjectId;
  name: string;
  description: string;
  avatar?: string;
  createdBy: string; // User ID of the creator
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  members: Array<{
    userId: string;
    role: GroupRole;
    joinedAt: Date;
    lastSeen?: Date;
  }>;
  settings: {
    allowMemberInvites: boolean;
    allowMessageDeletion: boolean;
    allowMessageEditing: boolean;
    allowFileSharing: boolean;
    allowMentions: boolean;
    readReceipts: boolean;
    notifications: {
      enabled: boolean;
      mentionsOnly: boolean;
      customTone?: string;
    };
    moderation: {
      adminOnlyMessages: boolean;
      memberApproval: boolean;
      contentFilter: boolean;
    };
    readReceipts: boolean
    messageEditWindow: number // in minutes
  }
}

export interface UserGroup {
  _id?: ObjectId;
  userId: string;
  groupId: string;
  lastReadMessage?: ObjectId; // Last message ID read by the user
  lastSeen?: Date; // Last time user was active in the group
  notificationSettings: {
    // Global mute for all notifications
    mute: boolean;
    // Whether to notify for mentions
    mentions: boolean;
    // Whether to notify for all messages
    allMessages: boolean;
    // Whether to notify only for replies to user's messages
    replies: boolean;
    // Custom notification sound (URL or identifier)
    sound?: string;
    // Whether to show message preview in notifications
    preview: boolean;
    // Whether to receive notifications when offline
    offline: boolean;
  };
  // User's role in the group (cached from Group.members for quick access)
  role: GroupRole;
  // When the user joined the group
  joinedAt: Date;
  // When the user left the group (if they left)
  leftAt?: Date;
  // Whether the user is currently active in the group
  isActive: boolean;
  // Whether the user has been approved to join (for private groups with approval)
  isApproved: boolean;
  // Custom display name for this group (if user set one)
  customName?: string;
  // Whether the user has notifications muted
  isMuted: boolean;
  // Whether the user has been banned from the group
  isBanned: boolean;
  // When the user was banned (if banned)
  bannedAt?: Date;
  // Reason for ban (if banned)
  banReason?: string;
  // Whether the user has admin privileges (cached for quick access)
  isAdmin: boolean;
  // Whether the user has moderator privileges (cached for quick access)
  isModerator: boolean;
  // Custom color for the user in this group
  color?: string;
  // Whether the user has read the group rules
  hasReadRules: boolean;
  // When the user last read the group rules
  rulesReadAt?: Date;
}

export interface TypingIndicator {
  _id?: ObjectId
  groupId: string
  userId: string
  isTyping: boolean
  lastUpdated: Date
}

export type Chat = Message | Conversation | Group | UserGroup | TypingIndicator
