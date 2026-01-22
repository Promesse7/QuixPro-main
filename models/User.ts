import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  firebaseUid: string; // Firebase Auth UID (primary key for auth)
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: "student" | "teacher" | "admin";
  level?: string;
  school?: string;
  authProvider: "firebase" | "legacy"; // Track migration status
  progress?: {
    quizzesTaken: number;
    quizzesPassed: number;
    averageScore: number;
    totalPoints: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isDemo?: boolean;

  gamification?: {
    totalXP: number;
    currentLevel: number;
    streak: number;
    lastActivityDate?: Date;
    badges: Array<{
      badgeId: string;
      name: string;
      earnedAt: Date;
    }>;
  };
  
  preferences?: {
    dailyGoal: number;
    theme: "light" | "dark";
    language: "en" | "rw";
  };
}

export interface UserActivity {
  _id?: ObjectId;
  userId: string;
  activityType: "quiz_completed" | "story_read" | "certificate_earned" | "feedback_given";
  entityId: string;
  score?: number;
  timestamp: Date;
  details?: Record<string, any>;
}
