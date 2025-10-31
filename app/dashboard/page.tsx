"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth"

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Target,
  Zap,
  Play,
  Trophy,
  Star,
  Award,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProgressStats } from "@/components/dashboard/progress-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecommendedQuizzes } from "@/components/dashboard/recommended-quizzes";
import { Leaderboard } from "@/components/dashboard/leaderboard";

import { CourseProgressCard } from "@/components/progress/CourseProgressCard";
import { BadgeShowcase } from "@/components/gamification/BadgeShowcase";
import { StreakTracker } from "@/components/gamification/StreakTracker";
import { XPProgressBar } from "@/components/gamification/XPProgressBar";
import  { getBaseUrl }  from "@/lib/getBaseUrl"; // optional helper for API base URL

// Mock user data
const mockUser = {
  id: "1",
  name: "Aline Uwimana",
  email: "aline.uwimana@student.rw",
  role: "student",
  level: "S3",
  avatar: "/student-avatar.png",
  joinedDate: "2024-09-01",
  stats: {
    totalQuizzes: 24,
    completedQuizzes: 18,
    averageScore: 85,
    totalPoints: 1420,
    certificates: 3,
    streak: 7,
  },
  recentActivity: [
    {
      id: "1",
      type: "quiz_completed",
      title: "Rwanda History & Culture",
      score: 92,
      date: "2024-01-15",
      subject: "Social Studies",
    },
    {
      id: "2",
      type: "certificate_earned",
      title: "Mathematics Fundamentals",
      date: "2024-01-14",
      subject: "Mathematics",
    },
    {
      id: "3",
      type: "quiz_completed",
      title: "English Grammar Essentials",
      score: 78,
      date: "2024-01-13",
      subject: "English",
    },
  ],
  currentGoals: [
    {
      id: "1",
      title: "Complete 5 Science quizzes",
      progress: 60,
      target: 5,
      current: 3,
    },
    {
      id: "2",
      title: "Achieve 90% average score",
      progress: 85,
      target: 90,
      current: 85,
    },
  ],
};

export default function StudentDashboard() {
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const baseUrl = getBaseUrl ? getBaseUrl() : "";
 // Add at the top of component
useEffect(() => {
  const user = getCurrentUser()
  if (!user) {
    router.push('/auth')
  } else if (user.role === 'admin') {
    router.push('/admin')
  } else if (user.role === 'teacher') {
    router.push('/teacher')
  }
}, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const progressRes = await fetch(`${baseUrl}/api/user/progress?userId=${mockUser.id}`);
        const progressData = await progressRes.json();
        setUserProgress(progressData.progress || []);

        const badgesRes = await fetch(`${baseUrl}/api/badges?userId=${mockUser.id}`);
        const badgesData = await badgesRes.json();
        setUserBadges(badgesData.badges || []);

        // Check for new badges
        await fetch(`${baseUrl}/api/badges/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: mockUser.id }),
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchUserData();
  }, []);

  const handleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) setTimeout(() => setIsVoiceActive(false), 3000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">
                  Welcome back, {mockUser.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">
                  Ready to continue your learning journey? You're on a{" "}
                  {mockUser.stats.streak}-day streak!
                </p>
              </div>
              <Button
                onClick={handleVoiceCommand}
                className={`glow-effect ${isVoiceActive ? "voice-wave" : ""}`}
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                {isVoiceActive ? "Listening..." : "Voice Command"}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Progress + Gamification */}
          <ProgressStats stats={mockUser.stats} />
          <StreakTracker streak={mockUser.stats.streak} />
          <XPProgressBar progress={userProgress} />
          <BadgeShowcase badges={userBadges} />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Goals Section */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 glow-text">
                    <Target className="h-5 w-5" />
                    <span>Current Goals</span>
                  </CardTitle>
                  <CardDescription>Track your learning objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUser.currentGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2 glow-effect" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Explore Features */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Explore New Features</CardTitle>
                  <CardDescription>Enhance your learning experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        href: "/peer-tutoring",
                        icon: <Users className="h-8 w-8 mb-2 text-primary" />,
                        title: "Peer Tutoring",
                        desc: "Connect with student tutors",
                      },
                      {
                        href: "/exam-simulation",
                        icon: <FileText className="h-8 w-8 mb-2 text-primary" />,
                        title: "Exam Simulation",
                        desc: "Practice with mock exams",
                      },
                      {
                        href: "/career-explorer",
                        icon: <Briefcase className="h-8 w-8 mb-2 text-primary" />,
                        title: "Career Explorer",
                        desc: "Discover career paths",
                      },
                      {
                        href: "/feedback",
                        icon: <MessageSquare className="h-8 w-8 mb-2 text-primary" />,
                        title: "Give Feedback",
                        desc: "Help improve content",
                      },
                    ].map((feature) => (
                      <Link key={feature.href} href={feature.href}>
                        <div className="feature-card p-4 cursor-pointer hover:bg-accent/10 rounded-xl">
                          {feature.icon}
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Quizzes + Leaderboard */}
              <RecommendedQuizzes />
              <Leaderboard />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <RecentActivity activities={mockUser.recentActivity} />

              {/* Learning Streak */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 glow-text">
                    <Zap className="h-5 w-5" />
                    <span>Learning Streak</span>
                  </CardTitle>
                  <CardDescription>Keep your momentum going!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary glow-text">
                        {mockUser.stats.streak}
                      </div>
                      <div className="text-sm text-muted-foreground">Days</div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i < mockUser.stats.streak
                              ? "bg-primary text-primary-foreground glow-effect"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Complete a quiz today to maintain your streak!
                    </p>
                    <Button asChild size="sm" className="glow-effect">
                      <Link href="/quiz">
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 glow-text">
                    <Trophy className="h-5 w-5" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: <Star className="h-5 w-5 text-white" />, title: "Quiz Master", desc: "Completed 20+ quizzes" },
                    { icon: <Award className="h-5 w-5 text-white" />, title: "High Achiever", desc: "85%+ average score" },
                    { icon: <Zap className="h-5 w-5 text-white" />, title: "Streak Champion", desc: "7-day learning streak" },
                  ].map((achv, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        {achv.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achv.title}</p>
                        <p className="text-xs text-muted-foreground">{achv.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">5 quizzes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Subject</span>
                    <Badge variant="secondary">Mathematics</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Spent</span>
                    <span className="font-medium">12h 30m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Level Rank</span>
                    <span className="font-medium text-primary glow-text">#1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Rank</span>
                    <span className="font-medium text-primary glow-text">#23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
