import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "student" | "teacher" | "admin";
  level?: string;
  school?: string;
  progress?: {
    quizzesTaken: number;
    quizzesPassed: number;
    averageScore: number;
    totalPoints: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isDemo?: boolean;
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