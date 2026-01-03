import { ObjectId } from "mongodb";

export interface Quiz {
  _id?: ObjectId;
  id: string;
  title: string;
  subject: string;
  level: string;
  description: string;
  questionCount: number;
  duration: number;
  difficulty: string;
  rating: number;
  reason?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  questionIds: string[];
  unitId?: ObjectId;
  courseId?: ObjectId;
  levelId?: ObjectId;
  // Embedded questions for quiz attempts
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  _id?: ObjectId;
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  _id?: ObjectId;
  userId: ObjectId;
  quizId: ObjectId;
  answers: QuizAnswer[];
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  timeSpent: number; // seconds
  status: "in_progress" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Additional metadata
  difficulty?: string;
  subject?: string;
  level?: string;
  // Certificate eligibility
  certificateEarned?: boolean;
  certificateId?: ObjectId;
}

export interface QuizAnswer {
  questionId: string | ObjectId;
  selectedAnswer: number | string;
  isCorrect: boolean;
  timeSpent?: number; // seconds on this question
  answeredAt?: Date;
}
