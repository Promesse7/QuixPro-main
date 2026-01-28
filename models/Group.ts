import type { ObjectId } from "mongodb"

export type GroupRole = 'admin' | 'moderator' | 'member'

export interface Group {
  _id?: ObjectId
  name: string
  description: string
  avatar?: string
  creatorId: ObjectId
  members: ObjectId[]
  admins: ObjectId[]
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
  settings?: {
    allowMemberInvites: boolean
    allowMessageDeletion: boolean
    allowMessageEditing: boolean
    allowFileSharing: boolean
    allowMentions: boolean
    readReceipts: boolean
    notifications: {
      enabled: boolean
      mentionsOnly: boolean
      customTone?: string
    }
    moderation: {
      adminOnlyMessages: boolean
      memberApproval: boolean
      contentFilter: boolean
    }
    messageEditWindow: number // in minutes
  }
}

export interface GroupMember {
  userId: ObjectId
  role: GroupRole
  joinedAt: Date
  lastSeen?: Date
  isOnline: boolean
}

export interface GroupSettings {
  allowMemberInvites: boolean
  allowMessageDeletion: boolean
  allowMessageEditing: boolean
  allowFileSharing: boolean
  allowMentions: boolean
  readReceipts: boolean
  notifications: {
    enabled: boolean
    mentionsOnly: boolean
    customTone?: string
  }
  moderation: {
    adminOnlyMessages: boolean
    memberApproval: boolean
    contentFilter: boolean
  }
  messageEditWindow: number
}
