import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, CheckCircle, Download } from 'lucide-react';

const ShareAchievementModal = ({ 
  isOpen, 
  onClose, 
  achievement 
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(achievement?.shareUrl || 'https://qouta.rw/share/example123');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🎉 ${achievement?.message || "Check out my achievement on Qouta!"}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(achievement?.message || "Just achieved something amazing on Qouta!");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Share Your Achievement! 🎉
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-white/80">
                Let your friends know about your success!
              </p>
            </div>

            {/* Achievement Preview */}
            <div className="p-6 bg-white/5">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center text-2xl">
                    {achievement?.icon || '🏆'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{achievement?.title || 'Amazing Achievement!'}</h3>
                    <p className="text-white/70 text-sm">{achievement?.subtitle || 'Scored 95% on Expert Quiz'}</p>
                  </div>
                </div>
                {achievement?.details && (
                  <div className="text-white/80 text-sm">
                    {achievement.details}
                  </div>
                )}
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 text-white font-medium"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-3">
                <p className="text-white/70 text-sm font-medium mb-3">
                  Share on Social Media
                </p>
                
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
                >
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-white font-medium group-hover:text-green-300">Share on WhatsApp</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="w-full bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-white font-medium group-hover:text-blue-300">Share on X (Twitter)</span>
                </button>

                <button
                  onClick={handleShareLinkedIn}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-white font-medium group-hover:text-blue-400">Share on LinkedIn</span>
                </button>
              </div>

              {/* Download Option */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors text-white"
                >
                  <Download className="w-5 h-5" />
                  Download as Image
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/20 border-t border-white/10">
              <p className="text-white/60 text-xs text-center">
                Share your success and inspire others to learn! 🚀
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Demo Component
const ShareDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleAchievement = {
    icon: '🏆',
    title: 'Quiz Master Achievement',
    subtitle: 'Scored 95% on Expert Mode',
    details: 'Biology S1 - Unit 2: Introduction to Classification',
    message: 'I just scored 95% on Expert Mode in Biology! Join Qouta to challenge yourself too! 🎓',
    shareUrl: 'https://qouta.rw/share/quiz-master-95-bio-s1'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Congratulations!
          </h1>
          <p className="text-white/80 mb-6">
            You've earned the Quiz Master badge!
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Share Your Achievement
          </button>
        </div>
      </div>

      <ShareAchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievement={exampleAchievement}
      />
    </div>
  );
};

export default ShareDemo;




// ===================================
// MongoDB Model: SharedContent
// File: models/SharedContent.ts
// ===================================

import { ObjectId } from "mongodb";

export interface SharedContent {
  _id?: ObjectId;
  shareId: string; // Unique identifier for the share URL
  userId: string; // User who created the share
  type: "quiz" | "badge" | "certificate" | "story";
  data: {
    // For quiz results
    quizTitle?: string;
    courseName?: string;
    level?: string;
    score?: number;
    difficulty?: string;
    completedAt?: Date;
    
    // For badges
    badgeName?: string;
    badgeIcon?: string;
    badgeColor?: string;
    badgeDescription?: string;
    earnedAt?: Date;
    
    // For certificates
    certificateTitle?: string;
    certificateCourse?: string;
    certificateLevel?: string;
    certificateDate?: Date;
    
    // Common
    userName?: string;
    userAvatar?: string;
    customMessage?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
  views: number;
  clicks: number; // Track "Join Now" button clicks
}

// ===================================
// API Route: Create Share Link
// File: app/api/share/route.ts
// ===================================

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const sharedContentCol = db.collection("shared_content");

    // Generate unique share ID
    const shareId = uuidv4();

    // Create shared content document
    const sharedContent: SharedContent = {
      shareId,
      userId,
      type,
      data,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      views: 0,
      clicks: 0,
    };

    const result = await sharedContentCol.insertOne(sharedContent);

    // Generate share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareId}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("shareId");

    if (!shareId) {
      return NextResponse.json(
        { error: "shareId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const sharedContentCol = db.collection("shared_content");

    const sharedContent = await sharedContentCol.findOne({ shareId });

    if (!sharedContent) {
      return NextResponse.json(
        { error: "Shared content not found" },
        { status: 404 }
      );
    }

    // Check if expired
    if (sharedContent.expiresAt && new Date() > new Date(sharedContent.expiresAt)) {
      return NextResponse.json(
        { error: "This share link has expired" },
        { status: 410 }
      );
    }

    // Increment view count
    await sharedContentCol.updateOne(
      { shareId },
      {
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      content: sharedContent,
    });
  } catch (error) {
    console.error("Share retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve shared content" },
      { status: 500 }
    );
  }
}

// ===================================
// API Route: Track Click
// File: app/api/share/track/route.ts
// ===================================

export async function POST(request: NextRequest) {
  try {
    const { shareId } = await request.json();

    if (!shareId) {
      return NextResponse.json(
        { error: "shareId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const sharedContentCol = db.collection("shared_content");

    await sharedContentCol.updateOne(
      { shareId },
      { $inc: { clicks: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}

// ===================================
// Helper Functions
// File: lib/share-helpers.ts
// ===================================

export async function createQuizShare(userId: string, quizResult: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const response = await fetch(`${baseUrl}/api/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      type: "quiz",
      data: {
        quizTitle: quizResult.quizTitle,
        courseName: quizResult.courseName,
        level: quizResult.level,
        score: quizResult.score,
        difficulty: quizResult.difficulty,
        completedAt: quizResult.completedAt,
        userName: quizResult.userName,
        userAvatar: quizResult.userAvatar,
        customMessage: `I just scored ${quizResult.score}% on ${quizResult.quizTitle}! 🎯`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create share link");
  }

  return await response.json();
}

export async function createBadgeShare(userId: string, badge: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const response = await fetch(`${baseUrl}/api/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      type: "badge",
      data: {
        badgeName: badge.name,
        badgeIcon: badge.icon,
        badgeColor: badge.color,
        badgeDescription: badge.description,
        earnedAt: badge.earnedAt,
        userName: badge.userName,
        userAvatar: badge.userAvatar,
        customMessage: `I just earned the ${badge.name} badge on Qouta! 🏆`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create share link");
  }

  return await response.json();
}

// ===================================
// Usage Example in Quiz Results
// File: app/quiz/results/[resultId]/page.tsx
// ===================================

import { useState } from "react";
import { createQuizShare } from "@/lib/share-helpers";
import ShareAchievementModal from "@/components/ShareAchievementModal";

export default function QuizResultsPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  const handleShare = async () => {
    try {
      const quizResult = {
        quizTitle: "Biology S1 - Unit 2",
        courseName: "Biology",
        level: "S1",
        score: 95,
        difficulty: "Expert",
        completedAt: new Date(),
        userName: "Promesse Rukundo",
        userAvatar: "/avatar.jpg",
      };

      const share = await createQuizShare(userId, quizResult);
      
      setShareData({
        icon: "🏆",
        title: "Quiz Completed!",
        subtitle: `Scored ${quizResult.score}% on ${quizResult.difficulty} Mode`,
        details: quizResult.quizTitle,
        message: `I just scored ${quizResult.score}% on Expert Mode in ${quizResult.courseName}! Join Qouta to challenge yourself too! 🎓`,
        shareUrl: share.shareUrl,
      });
      
      setShareModalOpen(true);
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  return (
    <div>
      {/* Results display */}
      <button onClick={handleShare}>
        Share Your Achievement
      </button>

      <ShareAchievementModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        achievement={shareData}
      />
    </div>
  );
}

// ===================================
// Public Share Page
// File: app/share/[shareId]/page.tsx
// ===================================

export default async function SharePage({ params }: { params: { shareId: string } }) {
  const { shareId } = params;
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/share?shareId=${shareId}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Share Not Found</h1>
          <p className="text-white/70 mb-6">This share link may have expired or been removed.</p>
          <a href="/" className="text-blue-400 hover:underline">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const { content } = await response.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Achievement Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{content.data.badgeIcon || "🏆"}</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {content.data.userName} achieved something amazing!
            </h1>
            <p className="text-white/80">
              {content.data.customMessage}
            </p>
          </div>

          {/* Achievement Details */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            {content.type === "quiz" && (
              <div className="space-y-2 text-white">
                <p><strong>Course:</strong> {content.data.courseName}</p>
                <p><strong>Quiz:</strong> {content.data.quizTitle}</p>
                <p><strong>Score:</strong> {content.data.score}%</p>
                <p><strong>Difficulty:</strong> {content.data.difficulty}</p>
              </div>
            )}
            {content.type === "badge" && (
              <div className="space-y-2 text-white">
                <p><strong>Badge:</strong> {content.data.badgeName}</p>
                <p className="text-sm text-white/70">{content.data.badgeDescription}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/auth"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
              onClick={() => {
                // Track click
                fetch("/api/share/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ shareId }),
                });
              }}
            >
              Join Qouta & Start Learning
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          Powered by Qouta Learning Platform
        </div>
      </div>
    </div>
  );
}
