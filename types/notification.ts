// Notification types (client-safe - no database imports)

export type NotificationType = 'chat' | 'quiz' | 'group' | 'site' | 'system'
export type NotificationEvent = 
  // Chat events
  | 'new_message' 
  | 'message_mention'
  | 'group_invite'
  | 'member_joined'
  // Quiz events  
  | 'quiz_assigned'
  | 'quiz_deadline_approaching'
  | 'quiz_results_published'
  | 'certificate_earned'
  | 'group_quiz_created'
  // Site events
  | 'question_answered'
  | 'answer_accepted'
  | 'answer_challenged'
  // System events
  | 'account_update'
  | 'platform_announcement'
  | 'feature_update'

export type NotificationPriority = 'low' | 'normal' | 'high'
export type EntityType = 'message' | 'quiz' | 'group' | 'post' | 'user' | 'certificate'

// Notification interface
export interface INotification {
  _id: string
  userId: string
  type: NotificationType
  event: NotificationEvent
  title: string
  message: string
  entityType?: EntityType
  entityId?: string
  priority?: NotificationPriority
  read: boolean
  createdAt: Date
  updatedAt?: Date
  metadata?: Record<string, any>
}

// Utility function to format time ago
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Helper function to categorize notification types
export function categorizeNotification(type: string): 'chat' | 'academic' | 'social' | 'system' {
  switch (type) {
    case 'chat':
      return 'chat'
    case 'quiz':
      return 'academic'
    case 'site':
      return 'academic'
    case 'group':
      return 'social'
    case 'system':
      return 'system'
    default:
      return 'system'
  }
}
