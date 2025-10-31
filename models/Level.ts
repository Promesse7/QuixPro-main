import { ObjectId } from "mongodb";

export interface Level {
  _id?: ObjectId;
  name: string; // e.g., "P6", "S3", "S6"
  stage?: "Primary" | "Lower Secondary" | "Upper Secondary" | string;
  code?: string; // e.g., "primary", "secondary-o"
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


