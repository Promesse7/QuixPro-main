import { ObjectId } from 'mongodb';

export interface Answer {
  _id?: ObjectId;
  author: string; // user id/email
  body: string;
  createdAt: Date;
  updatedAt?: Date;
  accepted?: boolean;
  votes?: number;
}

export interface Post {
  _id?: ObjectId;
  title: string;
  body: string;
  author: string; // user id/email
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
  solved?: boolean;
  answers?: Answer[];
  votes?: number;
}
