import { ObjectId } from "mongodb";

export interface LeaderboardEntry {
  _id?: ObjectId;
  userId: ObjectId;
  userName?: string;
  school?: string;
  country?: string;
  level?: string;
  totalXP?: number;
  totalScore?: number; // aggregate percentage or points
  attempts?: number;
  lastUpdatedAt?: Date;
}


