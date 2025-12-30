# Firebase-Native Production System

## Overview
This document outlines the Firebase-native identifier system for QuixPro production deployment.

## Identifier Strategy

### Primary Identifier: `uniqueUserId`
- Format: Firebase-safe string derived from user email
- Example: `user@example.com` → `user_example_com`
- Storage: `sessionStorage` and `localStorage`
- Persistence: Survives page refreshes and reloads

### Conversion Function
```typescript
emailToUniqueId(email: string): string
// user@domain.com → user_domain_com
```

## Firebase Database Paths

### Direct Messages
- Path: `chats/{sortedUserIds}/messages`
- Example: `chats/alice_example_com_bob_example_com/messages`
- Rule: User IDs are always sorted for consistency

### User Conversations
- Path: `user_conversations/{userId}/{otherUserId}`
- Example: `user_conversations/alice_example_com/bob_example_com`
- Contains: lastMessage, lastMessageTime, unreadCount, otherUserInfo

### Group Conversations
- Path: `groups/{groupId}/messages`
- Path: `groups/{groupId}/members`

## Deployment Checklist

- [ ] Remove all MongoDB references from chat system
- [ ] Verify all uniqueUserIds are generated consistently
- [ ] Update Firebase database rules (see below)
- [ ] Test conversations load properly
- [ ] Test message sending/receiving
- [ ] Test typing indicators
- [ ] Test online status

## Firebase Database Rules

```json
{
  "rules": {
    "chats": {
      "$chatId": {
        ".read": "root.child('messages').exists()",
        ".write": false,
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null",
          "$messageId": {
            ".validate": "newData.hasChildren(['senderId', 'recipientId', 'content', 'createdAt'])"
          }
        }
      }
    },
    "user_conversations": {
      "$userId": {
        ".read": "auth.uid == $userId",
        ".write": "auth.uid == $userId",
        "$otherUserId": {
          ".validate": "newData.hasChildren(['lastMessage', 'lastMessageTime', 'unreadCount'])"
        }
      }
    }
  }
}
```

## Maintenance Guide

### Adding New Users
1. User registers with email
2. System auto-generates uniqueUserId via `emailToUniqueId()`
3. Stored in session/localStorage
4. Used for all Firebase operations

### Testing
- Test with multiple accounts simultaneously
- Verify messages appear for both users
- Check conversation list updates in real-time
- Validate unread counts

### Troubleshooting
- Check browser console for "[v0]" debug logs
- Verify uniqueUserId in localStorage
- Check Firebase Realtime Database rules
- Confirm Firebase credentials in environment variables
