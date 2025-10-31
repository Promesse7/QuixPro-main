import { ObjectId } from "mongodb";

export interface Unit {
  _id?: ObjectId;
  levelId?: ObjectId;
  courseId: ObjectId;
  name?: string;
  title?: string;
  description?: string;
  quizIds?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}


