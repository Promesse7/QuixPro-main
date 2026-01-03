import type { ObjectId } from "mongodb"

export interface Message {
  _id?: ObjectId
  content: string
  senderId: string
  groupId: string
  createdAt: Date
  updatedAt: Date
  readBy: string[] // Array of user IDs who have read the message
  type: "text" | "image" | "file" | "math"
  metadata?: {
    fileUrl?: string
    fileName?: string
    fileType?: string
    fileSize?: number
  }
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

export interface Group {
  _id?: ObjectId
  name: string
  description?: string
  subject?: string // Subject area (Math, Physics, CS, etc.)
  createdBy: string // User ID of the creator
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  members: Array<{
    userId: string
    role: "admin" | "member"
    joinedAt: Date
  }>
  settings: {
    allowMemberInvites: boolean
    readReceipts: boolean
    messageEditWindow: number // in minutes
  }
  // Enhanced features for ChatContextPanel
  rules?: {
    purpose?: string
    postingGuidelines?: string
    academicIntegrity?: string
  }
  pinnedMessageIds?: string[] // IDs of pinned messages
}

export interface UserGroup {
  _id?: ObjectId
  userId: string
  groupId: string
  lastReadMessage?: ObjectId // Last message ID read by the user
  notificationSettings: {
    mute: boolean
    mentions: boolean
  }
  joinedAt: Date
  leftAt?: Date
  isActive: boolean
}

export interface TypingIndicator {
  _id?: ObjectId
  groupId: string
  userId: string
  isTyping: boolean
  lastUpdated: Date
}

export type Chat = Message | Conversation | Group | UserGroup | TypingIndicator
