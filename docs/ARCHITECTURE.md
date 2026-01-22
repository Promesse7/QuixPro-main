# Quix Backend Architecture - Firebase vs MongoDB

## 🧠 Mental Model

- **Firebase = Nervous System** (real-time, auth, events, presence)
- **MongoDB = Brain + Memory** (persistent state, logic, relationships)

## 🔥 FIREBASE RESPONSIBILITIES (Real-Time & Auth Layer)

### 1. Authentication (Firebase Auth)
- User signup / login
- Email + password auth
- OAuth (Google, etc.)
- Password reset / email verification
- Auth state persistence
- **User UID generation** (primary global identifier)

**Rule**: MongoDB references Firebase UID, never replaces it.

### 2. Real-Time Chat System (Firebase Realtime DB)
- 1-to-1 student ↔ student chat
- Student ↔ teacher chat
- Group chat messages
- Typing indicators
- Online/offline presence
- Message read receipts
- Message timestamps
- **Temporary message storage only**

**Rule**: MongoDB does NOT store live messages.

### 3. Notifications & Events
- Push notifications
- In-app alerts
- Quiz completed events
- New group message alerts
- Peer request alerts
- Teacher announcements

### 4. Presence & Activity Signals
- User online status
- Last active time
- Currently typing
- Live quiz participation signals

**Rule**: Ephemeral data stays in Firebase only.

### 5. File Upload Gateway (Firebase Storage)
- Chat attachments
- Group shared files
- Profile images
- Certificate PDFs

**Rule**: MongoDB stores only file metadata + URL, never binary.

---

## 🍃 MONGODB RESPONSIBILITIES (Source of Truth)

### 1. User Profiles (Extended)
- Firebase UID (foreign key to auth)
- Role (student / teacher / parent)
- School
- Level (Primary, O-Level, A-Level, Higher)
- Avatar
- XP
- Badges
- Preferences
- Account status

**Rule**: Firebase Auth ≠ user profile. MongoDB owns profile logic.

### 2. Curriculum & Learning Content
- Countries
- Schools
- Levels
- Courses
- Units
- Quizzes
- Questions
- Difficulty tiers
- AI-generated content

**Rule**: All curriculum data lives in MongoDB only.

### 3. Quiz Engine & Results
- Quiz attempts
- Answers submitted
- Scores
- Time taken
- Streaks
- Performance analytics
- Leaderboards (computed + cached)

**Rule**: Firebase triggers events; MongoDB stores results.

### 4. Certificates & Achievements
- Certificate records
- Completion criteria
- Certificate verification IDs
- Shareable public links
- Badge definitions
- XP logic

**Rule**: Files → Firebase Storage, Records → MongoDB

### 5. Social Graph (Non-Real-Time)
- Peer/friend requests
- Peer lists
- Group membership
- Group roles (admin, member, teacher)
- Group metadata
- Permissions

**Rule**: Messages are Firebase. Structure and rules are MongoDB.

### 6. Groups System (Structural Data)
- Group creation
- Group description
- Group owner
- Group visibility
- Allowed actions
- Linked courses or quizzes

**Rule**: MongoDB defines the group. Firebase moves messages.

### 7. Insights Pane / Social Feed
- Posts
- Questions
- Answers
- Likes
- Comments
- Saves
- Moderation flags

**Rule**: Not real-time chat → MongoDB owns it.

### 8. AI Systems & Logs
- AI-generated quizzes
- AI-generated courses
- PDF → quiz extraction results
- AI recommendations history
- Editor versioning

**Rule**: MongoDB only. Never Firebase.

### 9. Analytics & Platform Metrics
- Daily active users
- Quiz completion rates
- Popular courses
- Engagement metrics
- Growth stats

**Rule**: Computed via backend → stored in MongoDB.

---

## 🚫 STRICT RULES (NON-NEGOTIABLE)

1. **Firebase is NOT a general database**
2. **MongoDB is the source of truth**
3. **No curriculum, quiz, or profile logic in Firebase**
4. **No live messages stored permanently in MongoDB**
5. **Firebase UID is the global user ID**
6. **Binary files never go to MongoDB**
7. **Every Firebase event must map to a MongoDB entity**
8. **Never duplicate the same data across both**

---

## 📊 Data Flow Pattern

```
User Action (Client)
    ↓
Firebase Auth (if login/signup)
    ↓
Server validates Firebase UID
    ↓
Server reads/writes MongoDB (normalized state)
    ↓
Server writes Firebase (if real-time needed)
    ↓
Response to client with both sources
```

---

## API Contract Template

```typescript
// ✅ CORRECT: Get user profile
GET /api/user/:firebaseUid
Response: MongoDB user document + Firebase UID

// ❌ WRONG: Looking up by email (Firebase owns email)
GET /api/user/email/:email

// ✅ CORRECT: Send message (writes to both)
POST /api/chat/:groupId/message
Body: { firebaseUid, content, timestamp }
Firebase: Stores message (real-time)
MongoDB: Stores message reference + metadata

// ❌ WRONG: Storing all messages in MongoDB
POST /api/chat/save-all-messages

// ✅ CORRECT: Create group (MongoDB)
POST /api/groups
Body: { creatorFirebaseUid, name, description }
MongoDB: Stores group definition
Firebase: No write needed yet

// ✅ CORRECT: Get leaderboard (MongoDB)
GET /api/leaderboard/:courseId
MongoDB: Computed rankings
Firebase: No read needed

// ❌ WRONG: Storing leaderboard in Firebase
```

---

## Implementation Checklist

- [ ] All auth routes use Firebase Auth only
- [ ] All chat routes use Firebase Realtime DB for messages
- [ ] All profile routes reference firebaseUid from MongoDB
- [ ] No passwords stored in MongoDB
- [ ] No duplicate user data between Firebase and MongoDB
- [ ] No curriculum stored in Firebase
- [ ] No permanent messages stored in MongoDB
- [ ] All APIs return firebaseUid as user identifier
- [ ] Migration scripts link Firebase UIDs to MongoDB profiles
- [ ] Error handling distinguishes Firebase vs MongoDB failures
