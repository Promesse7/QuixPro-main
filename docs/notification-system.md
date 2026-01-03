# Quix Notification System Documentation

## Overview

The Quix notification system is a comprehensive, event-driven notification platform designed to handle real-time user engagement across academic, social, and system events. It follows a hybrid architecture with MongoDB as the source of truth and Firebase for real-time badge count synchronization.

## Architecture

### Data Layer
- **MongoDB**: Primary storage for all notifications with full query capabilities
- **Firebase Realtime Database**: Lightweight real-time badge count synchronization
- **Event-driven**: Notifications are created as side effects of user actions

### Frontend Layer
- **React Components**: Modular notification UI components
- **Real-time Updates**: Firebase listeners for instant badge count updates
- **TypeScript**: Full type safety throughout the system

## Core Components

### 1. Data Models (`models/Notification.ts`)

#### Notification Interface
```typescript
interface INotification {
  _id?: ObjectId
  userId: string                    // Target user
  type: NotificationType            // Category: chat, quiz, group, site, system
  event: NotificationEvent          // Specific event type
  title: string                     // Notification title
  message: string                   // Notification message
  entityType?: EntityType           // Referenced entity type
  entityId?: string                 // Referenced entity ID
  isRead: boolean                   // Read status
  priority: NotificationPriority     // Priority: low, normal, high
  metadata?: Record<string, any>    // Event-specific data
  createdAt: Date                   // Creation time
  readAt?: Date                     // When marked as read
  expiresAt?: Date                 // Optional expiration
}
```

#### Notification Categories
- **Academic**: Quiz assignments, results, certificates, site Q&A
- **Social**: Chat messages, group invites, member updates
- **System**: Account updates, announcements

### 2. Firebase Service (`lib/notificationFirebase.ts`)

Handles real-time badge count synchronization:

```typescript
class NotificationFirebaseService {
  async updateBadgeCount(userId: string, counts: BadgeCounts)
  async setBadgeCount(userId: string, counts: BadgeCounts)
  onBadgeCountChange(userId: string, callback: Function)
  async incrementCategoryCount(userId: string, category: string)
}
```

### 3. Notification Creator (`services/notificationService.ts`)

Event-driven notification creation service:

```typescript
class NotificationCreatorService {
  async createNewMessageNotification(...)
  async createQuizAssignedNotification(...)
  async createQuizDeadlineNotification(...)
  async createCertificateNotification(...)
  async createGroupInviteNotification(...)
  // ... more methods
}
```

### 4. API Endpoints (`app/api/notifications/`)

#### GET `/api/notifications`
- Fetch paginated notifications for current user
- Supports filtering by type
- Returns formatted notifications with metadata

#### POST `/api/notifications`
- Create new notifications (admin/testing)
- Validates required fields
- Returns created notification

#### PATCH `/api/notifications`
- Mark notifications as read
- Support single or bulk operations
- Updates Firebase counts automatically

#### DELETE `/api/notifications`
- Delete specific notifications
- Validates ownership
- Updates Firebase counts

### 5. Frontend Components

#### NotificationBell (`components/notifications/NotificationBell.tsx`)
- Displays unread count badge
- Animated icon for unread notifications
- Hover tooltip showing category breakdown
- Responsive sizing options

#### NotificationDropdown (`components/notifications/NotificationDropdown.tsx`)
- Full notification list with pagination
- Individual notification actions (read, delete)
- Priority-based visual indicators
- Click-to-navigate functionality

#### Notifications Container (`components/notifications/Notifications.tsx`)
- Combines bell and dropdown
- Handles user authentication
- Manages component state

### 6. React Hooks (`hooks/useNotifications.ts`)

#### `useNotifications(userId)`
- Complete notification management
- Real-time badge count integration
- CRUD operations with optimistic updates

#### `useNotificationCreator()`
- Admin/testing notification creation
- Loading states and error handling

#### `useRealtimeNotifications(userId)`
- Placeholder for future WebSocket/Firebase integration
- Real-time notification delivery

## Integration Guide

### 1. Basic Setup

Add the notification bell to your header:

```tsx
import { Notifications } from '@/components/notifications/Notifications'

function Header() {
  return (
    <header>
      <div>Logo</div>
      <Notifications userId={user.id} />
    </header>
  )
}
```

### 2. Triggering Notifications

#### New Message Notification
```tsx
// After sending a message
await fetch('/api/notifications/create-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    senderId: currentUser.id,
    recipientId: message.recipientId,
    messageId: message.id,
    messageContent: message.content,
    senderName: currentUser.name,
    isGroupMessage: false
  })
})
```

#### Quiz Assignment Notification
```tsx
// After assigning a quiz
await fetch('/api/notifications/create-quiz-assignment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    teacherId: currentUser.id,
    studentIds: selectedStudents,
    quizId: quiz.id,
    quizTitle: quiz.title,
    dueDate: quiz.dueDate
  })
})
```

### 3. Backend Event Handlers

Create API routes for different notification types:

```typescript
// app/api/notifications/create-message/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  const db = await connectToDatabase()
  const service = createNotificationService(db)
  
  await service.createNewMessageNotification(
    body.senderId,
    body.recipientId,
    body.messageId,
    body.messageContent,
    body.senderName,
    body.isGroupMessage,
    body.groupName
  )
  
  return NextResponse.json({ success: true })
}
```

## Database Schema

### MongoDB Indexes

```javascript
// Single field indexes
{ userId: 1 }
{ type: 1 }
{ event: 1 }
{ isRead: 1 }
{ priority: 1 }
{ createdAt: 1 }
{ expiresAt: 1 }

// Compound indexes for performance
{ userId: 1, isRead: 1, createdAt: -1 }
{ userId: 1, type: 1, createdAt: -1 }
{ userId: 1, priority: 1, createdAt: -1 }
{ userId: 1, expiresAt: 1 }
```

### Firebase Structure

```
/notificationCounts/
  {userId}/
    total: 5
    chat: 2
    academic: 3
    social: 0
    system: 0
```

## Performance Considerations

### 1. Pagination
- Notifications fetched in pages of 20
- Client-side caching for recent notifications
- "Load more" functionality for history

### 2. Real-time Updates
- Only badge counts synced in real-time
- Full notification list refreshed on demand
- Optimistic updates for better UX

### 3. Cleanup
- Auto-expiration for time-sensitive notifications
- Cleanup job for old read notifications (30 days)
- Efficient indexing for queries

## Notification Types Reference

### Chat Events
- `new_message`: New direct/group message
- `message_mention`: @mention in chat
- `group_invite`: Invitation to join group
- `member_joined`: New member joined group

### Quiz Events
- `quiz_assigned`: New quiz assigned
- `quiz_deadline_approaching`: Deadline reminder
- `quiz_results_published`: Results available
- `certificate_earned`: Certificate awarded
- `group_quiz_created`: Group quiz created

### Site Events
- `question_answered`: Answer to Quix Sites question
- `answer_accepted`: Answer marked as correct
- `answer_challenged`: Answer disputed

### System Events
- `account_update`: Profile/account changes
- `platform_announcement`: Platform news
- `feature_update`: New features

## Priority Levels

- **High**: Mentions, certificates, urgent deadlines
- **Normal**: Regular messages, quiz assignments
- **Low**: Member joined, system updates

## Security Considerations

1. **User Isolation**: Users can only access their own notifications
2. **Input Validation**: All notification data validated
3. **Rate Limiting**: Prevent notification spam
4. **Authentication**: All endpoints require valid session

## Future Enhancements

### Phase 2 Features
- **Notification Preferences**: User-controlled mute rules
- **Email Notifications**: Digest and immediate email options
- **Push Notifications**: Mobile/PWA push support
- **Analytics**: Notification engagement metrics

### Phase 3 Features
- **Smart Notifications**: AI-powered relevance scoring
- **Notification Batching**: Group similar notifications
- **Scheduled Notifications**: Time-based delivery
- **Rich Notifications**: Images, actions, deep links

## Troubleshooting

### Common Issues

1. **Badge Count Not Updating**
   - Check Firebase configuration
   - Verify user authentication
   - Check network connectivity

2. **Notifications Not Appearing**
   - Verify MongoDB connection
   - Check notification creation logs
   - Validate user ID matching

3. **Performance Issues**
   - Review database indexes
   - Check pagination implementation
   - Monitor Firebase usage

### Debug Tools

```typescript
// Enable debug logging
const DEBUG_NOTIFICATIONS = true

// Check Firebase connection
console.log('Firebase initialized:', !!database)

// Verify notification creation
console.log('Notification created:', notification)
```

## Best Practices

1. **Event-Driven Design**: Always create notifications as side effects
2. **Batch Operations**: Use bulk updates for multiple notifications
3. **Error Handling**: Graceful degradation for notification failures
4. **User Experience**: Provide immediate feedback for actions
5. **Testing**: Mock notification service in unit tests

## Migration Guide

### From Existing System
1. Export existing notification data
2. Transform to new schema format
3. Import to MongoDB with proper indexes
4. Initialize Firebase badge counts
5. Update frontend components

### Data Transformation
```javascript
// Example transformation
const transformedNotification = {
  userId: oldNotification.recipientId,
  type: categorizeNotification(oldNotification.type),
  event: mapToNewEvent(oldNotification.action),
  title: oldNotification.subject,
  message: oldNotification.body,
  // ... map other fields
}
```

This notification system provides a solid foundation for user engagement in Quix, with room for future enhancements and scalability.
