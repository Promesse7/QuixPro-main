import { ObjectId } from "mongodb";

export interface Course {
  _id?: ObjectId;
  levelId: ObjectId;
  name: string; // e.g., "Mathematics"
  code?: string;
  description?: string;
  units?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}


