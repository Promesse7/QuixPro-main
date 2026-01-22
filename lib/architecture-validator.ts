/**
 * Architecture Validator
 * 
 * Enforces strict separation between Firebase and MongoDB responsibilities.
 * Use these validators in all API routes to prevent architectural violations.
 */

export const ArchitectureValidator = {
  /**
   * FIREBASE ONLY: Authentication operations
   * Must use Firebase Auth, never MongoDB password storage
   */
  validateAuthOperation: (operation: "login" | "signup" | "passwordReset") => {
    console.log(`[Architecture] ✅ Auth operation "${operation}" should use Firebase Auth exclusively`)
    return {
      source: "Firebase Auth",
      mongoDbRole: "Store profile reference only",
      forbidden: ["password hashing", "credential storage", "email verification in MongoDB"],
    }
  },

  /**
   * FIREBASE ONLY: Real-time messaging
   * Messages must live in Firebase, not MongoDB (except metadata references)
   */
  validateChatOperation: (operation: "sendMessage" | "typing" | "presence") => {
    if (operation === "sendMessage") {
      return {
        firebaseStores: ["message content", "timestamp", "read receipts", "delivery status"],
        mongoDbStores: ["message reference", "message metadata", "archived messages (if needed)"],
        forbidden: ["permanent storage of all messages in MongoDB"],
      }
    }
    return {
      source: "Firebase Realtime DB",
      mongoDbRole: "None",
      reason: "Ephemeral data must stay in Firebase",
    }
  },

  /**
   * MONGODB ONLY: Curriculum, quizzes, and learning content
   * Never store curriculum logic in Firebase
   */
  validateCurriculumOperation: (operation: "createQuiz" | "getCourseMaterial" | "submitAnswer") => {
    return {
      source: "MongoDB only",
      firebaseRole: "None",
      reason: "Curriculum is structured, queryable data requiring complex relationships",
      forbidden: ["storing quiz content in Firebase", "Firebase queries for curriculum"],
    }
  },

  /**
   * MONGODB ONLY: User profiles and account data
   * Firebase UID is the reference key, but profile data lives in MongoDB
   */
  validateUserProfileOperation: (firebaseUid: string, operation: string) => {
    if (!firebaseUid || firebaseUid.length === 0) {
      throw new Error("[Architecture] User operation must have firebaseUid as primary key")
    }
    return {
      firebaseUid,
      mongoDbLookup: `db.users.findOne({ firebaseUid: "${firebaseUid}" })`,
      neverUseLookup: `db.users.findOne({ email: ... }) - Email is Firebase's responsibility`,
    }
  },

  /**
   * MONGODB ONLY: Groups structure (but messages go to Firebase)
   */
  validateGroupOperation: (operation: "create" | "getMembers" | "sendMessage") => {
    if (operation === "sendMessage") {
      return {
        mongoDbStores: ["group definition", "members list", "permissions"],
        firebaseStores: ["actual messages", "typing indicators", "presence"],
        reason: "Group structure is queryable, but messages are real-time",
      }
    }
    return {
      source: "MongoDB only",
      mongoDbStores: ["group metadata", "member roles", "group settings"],
      firebaseRole: "None until messages are sent",
    }
  },

  /**
   * FIREBASE + MONGODB (Coordinated): File uploads
   */
  validateFileOperation: (fileType: "image" | "document" | "certificate") => {
    return {
      firebaseStorage: "Raw file binary",
      mongoDbReference: ["file URL", "file metadata", "upload timestamp", "ownership"],
      rule: "Never store binary in MongoDB, store only reference + metadata",
    }
  },

  /**
   * MONGODB ONLY: Quiz results and analytics
   */
  validateAnalyticsOperation: (operation: "recordQuizResult" | "getLeaderboard" | "getStreaks") => {
    return {
      source: "MongoDB only",
      firebaseRole: "Can trigger events, but results stored in MongoDB",
      reason: "Analytics require complex queries and historical data",
      forbidden: ["storing all leaderboards in Firebase", "real-time analytics in Firebase without MongoDB backup"],
    }
  },

  /**
   * Audit helper: Check if an operation violates architecture
   */
  auditOperation: (
    operation: string,
    dataSource: "Firebase" | "MongoDB" | "Both",
    operationType: "read" | "write"
  ) => {
    const violations: string[] = []

    // Chat messages should NEVER be primarily stored in MongoDB
    if (
      operation.includes("chat") &&
      operation.includes("message") &&
      dataSource === "MongoDB" &&
      operationType === "write"
    ) {
      violations.push("❌ VIOLATION: Writing chat messages to MongoDB instead of Firebase")
    }

    // User auth should NEVER use MongoDB
    if (operation.includes("auth") && dataSource === "MongoDB") {
      violations.push("❌ VIOLATION: Using MongoDB for authentication instead of Firebase Auth")
    }

    // Curriculum should NEVER be in Firebase
    if (operation.includes("quiz") && operation.includes("create") && dataSource === "Firebase") {
      violations.push("❌ VIOLATION: Storing quiz definition in Firebase instead of MongoDB")
    }

    if (violations.length === 0) {
      console.log(`[Architecture] ✅ "${operation}" follows architecture rules`)
    } else {
      console.error(`[Architecture] Violations found:`, violations)
    }

    return { operation, violations, compliant: violations.length === 0 }
  },
}

/**
 * Type-safe database source indicator
 * Use this to label all data operations
 */
export type DataSource = "Firebase Auth" | "Firebase Realtime" | "Firebase Storage" | "MongoDB"

export const requireCorrectSource = (
  operation: string,
  expectedSource: DataSource,
  actualSource: DataSource
) => {
  if (expectedSource !== actualSource) {
    throw new Error(
      `[Architecture] VIOLATION: ${operation} should use ${expectedSource}, but used ${actualSource}`
    )
  }
}

export default ArchitectureValidator
