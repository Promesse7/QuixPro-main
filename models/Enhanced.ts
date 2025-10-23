import { ObjectId } from "mongodb";

// Enhanced User Model with Gamification
export interface EnhancedUser {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  role: "student" | "teacher" | "parent" | "admin";
  
  // Location & School Info
  countryId: ObjectId;
  schoolId: ObjectId;
  levelId: ObjectId;
  
  // Gamification Fields (NEW)
  gamification: {
    totalXP: number;
    currentLevel: number;
    streak: number;
    lastActivityDate: Date;
    badges: Array<{
      badgeId: string;
      name: string;
      earnedAt: Date;
      tier: "bronze" | "silver" | "gold" | "platinum";
    }>;
    achievements: Array<{
      achievementId: string;
      unlockedAt: Date;
      progress: number;
    }>;
  };
  
  // Learning Analytics (NEW)
  analytics: {
    totalQuizzesTaken: number;
    totalQuizzesPassed: number;
    averageScore: number;
    totalTimeSpent: number; // in minutes
    strongSubjects: string[];
    weakSubjects: string[];
    learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  };
  
  // Preferences (NEW)
  preferences: {
    dailyGoal: number; // XP per day
    notifications: {
      email: boolean;
      streak: boolean;
      achievements: boolean;
    };
    theme: "light" | "dark" | "auto";
    language: "en" | "rw" | "fr";
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Unit with Learning Content
export interface EnhancedUnit {
  _id?: ObjectId;
  name: string;
  order: number;
  courseId: ObjectId;
  levelId: ObjectId;
  description: string;
  
  // Learning Content (NEW)
  content: {
    story?: string; // Narrative/storytelling approach
    videoUrl?: string;
    readingMaterial?: string;
    interactiveElements?: Array<{
      type: "simulation" | "diagram" | "quiz_preview";
      data: any;
    }>;
    keyTerms?: Array<{
      term: string;
      definition: string;
      example?: string;
    }>;
  };
  
  // Metadata
  learningObjectives: string[];
  estimatedTime: number; // minutes
  difficulty: "easy" | "moderate" | "hard" | "expert";
  xpReward: number;
  
  // Unlock Logic (NEW)
  unlockConditions: {
    requiredUnits: ObjectId[];
    minScoreRequired?: number;
    prerequisiteBadges?: string[];
  };
  
  quizzes: ObjectId[];
  resources: Array<{
    title: string;
    type: "pdf" | "video" | "article" | "external";
    url: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Quiz with Adaptive Learning
export interface EnhancedQuiz {
  _id?: ObjectId;
  title: string;
  unitId: ObjectId;
  courseId: ObjectId;
  difficulty: "easy" | "moderate" | "hard" | "expert";
  
  // Adaptive Settings (NEW)
  isAdaptive: boolean;
  adaptiveSettings?: {
    startDifficulty: number; // 1-5
    difficultyAdjustmentRate: number;
    maxDifficultyJump: number;
  };
  
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    correctAnswer: number;
    explanation: string;
    points: number;
    difficultyLevel: number; // 1-5 (NEW)
    hints?: string[]; // Progressive hints (NEW)
    tags: string[]; // For topic analysis (NEW)
    timeEstimate?: number; // seconds (NEW)
  }>;
  
  // Quiz Metadata
  timeLimit?: number;
  passingScore: number;
  xpReward: number;
  
  // Analytics (NEW)
  analytics: {
    totalAttempts: number;
    averageScore: number;
    averageTimeSpent: number;
    commonMistakes: Array<{
      questionId: string;
      incorrectOptionId: string;
      count: number;
    }>;
  };
  
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Badge System (NEW)
export interface Badge {
  _id?: ObjectId;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: "completion" | "mastery" | "streak" | "social" | "special";
  
  unlockCriteria: {
    type: "xp" | "quizzes_completed" | "perfect_scores" | "streak" | "course_completion";
    threshold: number;
    specificCourseId?: ObjectId;
  };
  
  xpReward: number;
  createdAt: Date;
}

// User Progress Tracking (NEW)
export interface UserProgress {
  _id?: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  
  // Progress Metrics
  currentUnitId: ObjectId;
  completedUnits: ObjectId[];
  unlockedUnits: ObjectId[];
  
  // Performance Data
  overallProgress: number; // percentage
  averageScore: number;
  totalXPEarned: number;
  timeSpent: number; // minutes
  
  // Quiz History
  quizAttempts: Array<{
    quizId: ObjectId;
    attemptNumber: number;
    score: number;
    timeTaken: number;
    completedAt: Date;
    answeredQuestions: Array<{
      questionId: string;
      selectedAnswer: number;
      isCorrect: boolean;
      timeSpent: number;
    }>;
  }>;
  
  // Learning Insights (NEW)
  strengths: string[]; // Topics user excels at
  weaknesses: string[]; // Topics needing improvement
  recommendedReview: ObjectId[]; // Unit IDs to review
  
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}