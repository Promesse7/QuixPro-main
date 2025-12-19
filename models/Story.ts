import { ObjectId } from "mongodb";

export interface Story {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  readingLevel: string;
  readingTime: number;
  author?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}
