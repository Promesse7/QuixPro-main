# Quix Data Flow Patterns

Follow these patterns exactly. Copy-paste if needed. Do NOT invent variations.

---

## Pattern 1: User Login (Firebase Auth → MongoDB Profile)

### Correct Flow:
```typescript
// Client
POST /api/auth/login
Body: { email, password }

// Server
1. Firebase Admin SDK: auth.getUserByEmail(email)
2. Firebase Admin SDK: validatePassword(email, password)
3. MongoDB: db.users.findOne({ firebaseUid })
4. Return: { firebaseUid, user profile from MongoDB }
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Validating password against MongoDB
db.users.findOne({ email, password: hash(password) })

// WRONG: Creating user in MongoDB without Firebase
db.users.insertOne({ email, password })

// WRONG: Using email as primary identifier
GET /api/user/email/:email  // ❌ Email is mutable, firebaseUid is not
```

---

## Pattern 2: Send Chat Message (Firebase Primary)

### Correct Flow:
```typescript
// Client sends message
POST /api/groups/:groupId/message
Body: { firebaseUid, content, timestamp }

// Server
1. Verify user is member of group (MongoDB)
2. Write to Firebase Realtime DB:
   /groups/:groupId/messages/:messageId
   { 
     senderId: firebaseUid,
     content,
     timestamp,
     readBy: {}
   }
3. Optionally write metadata to MongoDB for archiving:
   db.messages_metadata.insertOne({
     messageId,
     groupId,
     senderUid,
     archivedAt: null
   })
4. Return: Firebase message ID + timestamp

// Firebase triggers notification event
onMessage() → send push notification
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Storing all messages in MongoDB
db.messages.insertOne({ groupId, content, senderId })

// WRONG: Using email as sender identifier
firebase.database().messages.push({ senderEmail })

// WRONG: Storing message content in MongoDB and Firebase both
// (causes sync issues, duplication, scalability problems)
```

---

## Pattern 3: Get Quiz Results (MongoDB Only)

### Correct Flow:
```typescript
// Client
GET /api/quizzes/:quizId/results
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify Firebase token → get firebaseUid
2. MongoDB query:
   db.quiz_attempts.find({
     firebaseUid,
     quizId,
     completedAt: { $exists: true }
   })
3. Return: Quiz results array
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Storing quiz results in Firebase
firebase.database().quizResults.push({ ... })

// WRONG: Real-time updates of quiz results
// (Quiz results are permanent, not ephemeral)
```

---

## Pattern 4: Create Group (MongoDB Only)

### Correct Flow:
```typescript
// Client
POST /api/groups
Body: { name, description, privacy }
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify Firebase token → get firebaseUid
2. MongoDB: Insert group document
   db.groups.insertOne({
     creatorFirebaseUid: firebaseUid,
     name,
     description,
     privacy,
     members: [firebaseUid],
     roles: { [firebaseUid]: "admin" },
     createdAt: now
   })
3. Firebase: No write needed (messages will come later)
4. Return: { groupId, groupName }
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Storing group data in Firebase
firebase.database().groups[groupId] = { ... }

// This duplicates data and makes group queries slow
```

---

## Pattern 5: Get Leaderboard (MongoDB Computed)

### Correct Flow:
```typescript
// Client
GET /api/courses/:courseId/leaderboard
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify Firebase token → get firebaseUid
2. MongoDB aggregation pipeline:
   db.quiz_attempts.aggregate([
     { $match: { courseId, completedAt: { $exists: true } } },
     { $group: { _id: "$firebaseUid", avgScore: { $avg: "$score" } } },
     { $sort: { avgScore: -1 } },
     { $limit: 100 }
   ])
3. Join with user profiles:
   For each result, get userName from db.users by firebaseUid
4. Cache result in Redis (optional)
5. Return: Leaderboard array
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Real-time leaderboard in Firebase
// (Leaderboards need historical computation, not real-time updates)

// WRONG: Storing entire leaderboard in MongoDB without aggregation
// (Inefficient, not computed on-the-fly)
```

---

## Pattern 6: Upload Profile Image (Firebase Storage + MongoDB Reference)

### Correct Flow:
```typescript
// Client
POST /api/users/upload-image
Body: FormData { file, firebaseUid }
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify Firebase token → get firebaseUid
2. Firebase Storage: Upload image
   const bucket = admin.storage().bucket()
   await bucket.file(`users/${firebaseUid}/avatar.jpg`).save(buffer)
3. Get public URL:
   const url = `https://storage.googleapis.com/bucket/users/${firebaseUid}/avatar.jpg`
4. MongoDB: Update user profile
   db.users.updateOne(
     { firebaseUid },
     { $set: { avatarUrl: url, avatarUpdatedAt: now } }
   )
5. Return: { avatarUrl }
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Storing binary image data in MongoDB
db.users.updateOne({ firebaseUid }, { $set: { avatar: Buffer(...) } })

// WRONG: No MongoDB reference
// (If Firebase Storage is deleted, user won't know what avatar they had)
```

---

## Pattern 7: Record Quiz Attempt (MongoDB Only)

### Correct Flow:
```typescript
// Client
POST /api/quizzes/:quizId/submit
Body: { answers, timeSpent }
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify Firebase token → get firebaseUid
2. Validate quiz exists in MongoDB
3. Score the answers
4. MongoDB: Insert attempt record
   db.quiz_attempts.insertOne({
     firebaseUid,
     quizId,
     answers: [ /* encrypted or hashed */ ],
     score,
     timeSpent,
     completedAt: now,
     attemptNumber: count + 1
   })
5. Award XP to user profile:
   db.users.updateOne(
     { firebaseUid },
     { $inc: { "gamification.totalXP": xpReward } }
   )
6. Firebase: Trigger "quiz_completed" event for notifications
   firebase.database().events.push({
     event: "quiz_completed",
     firebaseUid,
     quizId,
     score
   })
7. Return: { score, xpAwarded, nextAction }
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Storing quiz answers in Firebase
firebase.database().attempts[attemptId] = { answers }

// WRONG: Storing XP changes only in Firebase
// (XP is permanent state, must be in MongoDB)
```

---

## Pattern 8: Get Chat History (Firebase for Messages, MongoDB for Metadata)

### Correct Flow:
```typescript
// Client
GET /api/groups/:groupId/messages?limit=50&before=:timestamp
Headers: { Authorization: Firebase ID Token }

// Server
1. Verify user is member of group (MongoDB)
2. Fetch from Firebase Realtime DB:
   const messages = await firebase.database()
     .ref(`/groups/${groupId}/messages`)
     .orderByChild("timestamp")
     .endAt(timestamp)
     .limitToLast(51)
     .once("value")
3. Format and return messages
4. MongoDB (optional): Log that user viewed messages
   db.message_access_logs.insertOne({
     firebaseUid,
     groupId,
     viewedAt: now
   })
5. Return: { messages, hasMore }
```

### ❌ WRONG Patterns to Avoid:
```typescript
// WRONG: Fetching all messages from MongoDB
db.messages.find({ groupId }).sort({ timestamp: -1 }).limit(50)

// This works but doesn't scale. Firebase is optimized for this.
```

---

## Summary Table

| Operation | Firebase | MongoDB | Rule |
|-----------|----------|---------|------|
| User login | ✅ Auth | ✅ Profile lookup | Firebase authenticates, MongoDB stores profile |
| Send message | ✅ Store | ⚠️ Metadata only | Firebase real-time, MongoDB archives/metadata |
| Quiz results | ❌ | ✅ Store | Permanent, queryable data only in MongoDB |
| Create group | ❌ | ✅ Store | Group structure is queryable |
| Leaderboard | ❌ | ✅ Compute | Requires aggregation pipeline |
| Upload image | ✅ Storage | ✅ URL ref | File in Firebase, metadata in MongoDB |
| Quiz submit | ❌ | ✅ Store | Permanent state only in MongoDB |
| Typing indicator | ✅ Real-time | ❌ | Ephemeral data only in Firebase |
| User online status | ✅ Real-time | ❌ | Ephemeral data only in Firebase |
| Certificates | ❌ | ✅ Store | Permanent records in MongoDB |

---

## Implementation Checklist for New Features

Before building ANY new API endpoint:

- [ ] Have I identified if this is real-time or persistent data?
- [ ] Is this user-facing real-time? (Firebase)
- [ ] Is this queryable or historical? (MongoDB)
- [ ] Does this require complex relationships? (MongoDB)
- [ ] Is binary data involved? (Firebase Storage + MongoDB ref)
- [ ] Am I using firebaseUid as the user identifier? (Not email)
- [ ] Have I avoided duplicating data between Firebase and MongoDB?
- [ ] Have I validated that this follows the ARCHITECTURE.md rules?
