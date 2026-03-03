# Firebase Setup for Chat System

This guide explains how to set up Firebase for the hybrid authentication system (MongoDB + Firebase for chat).

## Overview

The chat system uses a hybrid authentication approach:
- **MongoDB**: Main user authentication and data storage
- **Firebase**: Real-time chat functionality with custom tokens

## Setup Steps

### 1. Firebase Project Configuration

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password method)
3. Enable Realtime Database
4. Enable Firestore (if needed)
5. Get your Firebase configuration from Project Settings

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Service Account Setup

1. Go to Firebase Project Settings > Service Accounts
2. Generate a new private key for the Admin SDK
3. Save the JSON file securely
4. Add the private key content to your environment variables

### 4. Deploy Security Rules

Run the deployment script:

```bash
node scripts/deploy-firebase-rules.js
```

Or manually deploy:

```bash
firebase deploy --only database:rules
```

### 5. Firebase Security Rules

The security rules are defined in `firebase-rules.json`:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || auth.token.email === $uid",
        ".write": "$uid === auth.uid || auth.token.email === $uid"
      }
    },
    "conversations": {
      ".read": "auth != null",
      "$conversationId": {
        ".read": "data.child('participants').val().contains(auth.token.email)",
        ".write": "data.child('participants').val().contains(auth.token.email)"
      }
    },
    "groups": {
      ".read": "auth != null",
      "$groupId": {
        ".read": "data.child('members').val().hasChild(auth.token.email)",
        ".write": "data.child('members').val().hasChild(auth.token.email) || data.child('createdBy').val() === auth.token.email"
      }
    }
  }
}
```

## Authentication Flow

### 1. User Login (MongoDB)
- User logs in via NextAuth with MongoDB
- Session is established

### 2. Firebase Sync
- Call `/api/auth/sync-firebase` to sync MongoDB user with Firebase
- This creates/updates Firebase user with custom claims

### 3. Get Custom Token
- Call `/api/auth/get-custom-token` to get Firebase custom token
- Token includes user role and MongoDB ID

### 4. Firebase Authentication
- Use custom token to authenticate with Firebase client
- Real-time chat functionality is now available

## API Endpoints

### `/api/auth/sync-firebase`
- **Method**: POST
- **Purpose**: Sync MongoDB user with Firebase
- **Authentication**: Required (NextAuth session)

### `/api/auth/get-custom-token`
- **Method**: POST
- **Purpose**: Get Firebase custom token for chat
- **Body**: `{ email: string }`
- **Authentication**: Required (NextAuth session)

### `/api/chat/direct/[userId]`
- **Method**: GET/POST
- **Purpose**: Direct chat conversations
- **Authentication**: Required

### `/api/users/[userId]`
- **Method**: GET/PUT
- **Purpose**: User profile management
- **Authentication**: Required

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check Firebase security rules
   - Ensure user is properly authenticated
   - Verify custom claims are set correctly

2. **User Not Found**
   - Check if user exists in MongoDB
   - Verify Firebase sync completed successfully

3. **Token Generation Failed**
   - Check Firebase Admin SDK configuration
   - Verify service account permissions
   - Check environment variables

### Debug Steps

1. Check browser console for Firebase errors
2. Verify Firebase project configuration
3. Test API endpoints individually
4. Check Firebase console for user creation

## Data Structure

### Firebase Realtime Database Structure

```
{
  "users": {
    "user@example.com": {
      "status": "online",
      "lastSeen": "2026-03-03T18:00:00Z",
      "groups": {
        "groupId1": true,
        "groupId2": true
      }
    }
  },
  "conversations": {
    "conversationId": {
      "type": "direct",
      "participants": ["user1@example.com", "user2@example.com"],
      "createdAt": "2026-03-03T18:00:00Z",
      "lastMessage": { ... }
    }
  },
  "groups": {
    "groupId": {
      "name": "Study Group",
      "createdBy": "creator@example.com",
      "members": ["member1@example.com", "member2@example.com"],
      "createdAt": "2026-03-03T18:00:00Z"
    }
  }
}
```

## Security Considerations

1. **Custom Tokens**: Always validate custom tokens on the server
2. **Security Rules**: Regularly review and update Firebase rules
3. **Environment Variables**: Never expose private keys in client code
4. **User Permissions**: Implement proper role-based access control

## Performance Optimization

1. **Firebase Indexing**: Set up appropriate indexes for queries
2. **Data Structure**: Optimize Firebase data structure for performance
3. **Caching**: Implement client-side caching for frequently accessed data
4. **Connection Pooling**: Reuse Firebase connections where possible

## Monitoring

1. **Firebase Console**: Monitor usage and errors
2. **Application Logs**: Track authentication and sync issues
3. **Performance Metrics**: Monitor chat latency and user experience
4. **Error Tracking**: Implement error reporting for Firebase operations
