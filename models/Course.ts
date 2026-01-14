import { ObjectId } from "mongodb";

export type BlockType = 'text' | 'image' | 'video' | 'quiz' | 'heading' | 'code' | 'note' | 'math';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: {
    // Text block
    text?: string;
    // Math block (LaTeX)
    latex?: string;
    // Image block
    url?: string;
    caption?: string;
    alt?: string;
    // Video block
    videoUrl?: string;
    title?: string;
    // Quiz block
    questions?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
    // Heading block
    level?: 1 | 2 | 3;
    heading?: string;
    // Code block
    code?: string;
    language?: string;
    // Note block
    note?: string;
    variant?: 'info' | 'warning' | 'success' | 'error';
  };
  order: number;
  metadata?: {
    aiGenerated?: boolean;
    source?: string;
    createdAt?: Date;
  };
}

export interface Course {
  _id?: ObjectId;
  levelId: ObjectId;
  name: string; // e.g., "Mathematics"
  code?: string;
  description?: string;
  // Quix Editor fields
  content?: {
    blocks: ContentBlock[];
    version?: number;
    lastEdited?: Date;
  };
  tags?: string[];
  coverImage?: string;
  ownerId?: string; // creator user id
  status?: "draft" | "pending_review" | "published" | "archived";
  isPublished?: boolean;
  moderation?: {
    reviewerId?: string;
    reviewedAt?: Date;
    notes?: string;
  };
  // Metadata
  gradeLevel?: string;
  subject?: string;
  estimatedDuration?: number; // in minutes
  learningObjectives?: string[];
  prerequisites?: string[];
  // Linking units
  units?: ObjectId[];
  unitIds?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
