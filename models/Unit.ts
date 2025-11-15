import { ObjectId } from "mongodb";

export interface Unit {
  _id?: ObjectId;
  levelId?: ObjectId;
  courseId: ObjectId;
  name?: string;
  title?: string;
  description?: string;
  quizIds?: ObjectId[];
  // New fields for Quix Editor
  blocks?: Array<{
    id: string;
    type: "text" | "image" | "video" | "quiz" | "assignment" | "summary" | "note";
    order: number;
    content?: any;
    metadata?: Record<string, any>;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  version?: number;
  history?: Array<{
    version: number;
    authorId?: string;
    timestamp: Date;
    summary?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}


