import { ObjectId } from "mongodb";

export interface Certificate {
  _id?: ObjectId;
  userId: ObjectId;
  quizId?: ObjectId;
  courseId?: ObjectId;
  title: string; // e.g., "Mathematics Level S3 Certificate"
  issuedAt: Date;
  metadata?: Record<string, any>;
}


