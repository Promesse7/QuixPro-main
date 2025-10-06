import { ObjectId } from "mongodb";

export interface Quiz {
  _id?: ObjectId;
  id: string;
  title: string;
  subject: string;
  level: string;
  description: string;
  questions: number;
  duration: number;
  difficulty: string;
  rating: number;
  reason?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  questionIds: string[];
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