import { ObjectId } from "mongodb";

export interface Result {
  _id?: ObjectId;
  userId: ObjectId;
  quizId: ObjectId;
  score: number; // 0-100
  accuracy?: number; // percentage 0-100
  timeSpent?: number; // seconds
  difficulty?: string; // Easy | Moderate | Hard | Expert
  createdAt: Date;
}


