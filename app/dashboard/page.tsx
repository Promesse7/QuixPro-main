// app/dashboard/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Trophy, TrendingUp, Users, Award, Clock, Target, Zap, Star,
  ChevronRight, Play, BookOpen, MessageSquare, Settings, Activity,
  Brain, Bell, Menu, X, BarChart3, Calendar, Home, Crown, Medal,
  CheckCircle, ArrowUp, Sparkles, Video, FileText, Globe, LogOut
} from 'lucide-react';

import { ProgressStats } from '@/components/dashboard/progress-stats';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { RecommendedQuizzes } from '@/components/dashboard/recommended-quizzes';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Achievements } from '@/components/dashboard/Achievements';
import { SocialSignals } from '@/components/dashboard/SocialSignals';
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb';
import { QuickStartCTA } from '@/components/app/QuickStartCTA';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Ultimate2025Dashboard() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mounted, setMounted] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const analyticsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fetch real data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user first
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // If no user, use fallback data immediately and don't make API calls
        if (!currentUser) {
          console.log('No current user found, using fallback data');
          setDashboardData(getFallbackData());
          setLoading(false);
          return;
        }

        // Only try API if we have a user
        try {
          const response = await fetch('/api/dashboard-data');

          if (!response.ok) {
            if (response.status === 401) {
              console.log('User not authenticated, using fallback data');
              setDashboardData(getFallbackData());
              setLoading(false);
              return;
            }
            if (response.status === 404) {
              console.log('Dashboard API not found, using fallback data');
              throw new Error('Dashboard API not available');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setDashboardData(data);
        } catch (apiError) {
          console.error('API call failed, using fallback data:', apiError);
          setDashboardData(getFallbackData());
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError((error as Error).message);
        setDashboardData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data function
  const getFallbackData = () => ({
    progressStats: {
      totalQuizzes: 10,
      completedQuizzes: 0,
      averageScore: 0,
      totalPoints: 0,
      certificates: 0,
      streak: 0
    },
    analytics: {
      weeklyActivity: [],
      subjectDistribution: [],
      difficultyBreakdown: [],
      chatActivity: []
    },
    recommendedQuizzes: [
      { id: 1, title: 'Getting Started Quiz', difficulty: 'Easy', time: '10 min', enrolled: 0, completion: 0 },
      { id: 2, title: 'Math Basics', difficulty: 'Easy', time: '15 min', enrolled: 0, completion: 0 },
      { id: 3, title: 'Science Introduction', difficulty: 'Medium', time: '20 min', enrolled: 0, completion: 0 }
    ],
    activities: [
      { id: 1, type: 'welcome', title: 'Welcome to Quix! Start your first quiz to see your progress.', time: 'Just now', icon: Star, color: '#3b82f6' }
    ],
    leaderboard: [
      { rank: 1, name: 'You', score: 0, avatar: 'YU', isUser: true }
    ],
    achievements: [],
    socialSignals: {
      unreadMessages: 0,
      groupUpdates: 0,
      newMessages: 0
    }
  });

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnalyticsVisible(true), 300);
        }
      },
      { threshold: 0.2 }
    );

    if (analyticsRef.current) {
      observer.observe(analyticsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Transform database data to UI format for existing components
  const getTransformedData = () => {
    if (!dashboardData) return getFallbackData();

    const { stats, analytics, activities, recommendedQuizzes, leaderboard, achievements, socialSignals } = dashboardData;

    return {
      // Progress stats component format
      progressStats: {
        totalQuizzes: stats?.totalQuizzes || 10,
        completedQuizzes: stats?.completedQuizzes || 0,
        averageScore: stats?.averageScore || 0,
        totalPoints: stats?.totalPoints || 0,
        certificates: stats?.certificates || 0,
        streak: stats?.streak || 0
      },
      // Analytics component format
      analytics: analytics || {
        weeklyActivity: [],
        subjectDistribution: [],
        difficultyBreakdown: [],
        chatActivity: []
      },
      // Recommended quizzes component format (component handles its own data fetching)
      recommendedQuizzes: recommendedQuizzes || [],
      // Activity feed component format
      activities: activities?.map((activity: any) => ({
        type: activity.type || 'general',
        description: activity.title || activity.description || 'Activity',
        time: activity.time || new Date().toISOString(),
        link: activity.link
      })) || [],
      // Leaderboard component format (component handles its own data fetching)
      leaderboard: leaderboard || [],
      // Achievements component format
      achievements: achievements?.map((achievement: any) => ({
        id: achievement.id || '1',
        title: achievement.title || 'Achievement',
        description: achievement.description || 'Description',
        type: 'certificate' as const
      })) || [],
      // Social signals component format
      socialSignals: socialSignals || {
        unreadMessages: 0,
        groupUpdates: 0,
        newMessages: 0
      }
    };
  };

  const transformedData = getTransformedData();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, href: '/explore' },
    { id: 'quix-sites', label: 'Quix Sites', icon: Globe, href: '/quix-sites' },
    { id: 'quix-chat', label: 'Quix Chat', icon: MessageSquare, href: '/chat' },
    { id: 'quix-groups', label: 'Quix Groups', icon: Users, href: '/groups' },
    { id: 'quix-insights', label: 'Quix Insights', icon: BarChart3, href: '/leaderboard' },
    { id: 'quizzes', label: 'Quizzes', icon: Target, href: '/quiz-selection' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/profile' }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-[22px] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:rotate-6">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Quix</h1>
            <p className="text-xs text-muted-foreground font-medium">Learning Dashboard</p>
          </div>
        </Link>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-card to-muted border border-border/50 shadow-inner group/user relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/user:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <Avatar className="h-10 w-10 border-2 border-background shadow-md">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-muted-foreground">Level {user?.level || 1}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading experience...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Quix</span>
          </Link>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Button>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back! 👋</h2>
            <p className="text-muted-foreground">Here's your learning progress today</p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="hidden md:block">
              <QuickStartCTA />
            </div>
            <Button variant="outline" size="icon" className="rounded-2xl hidden md:flex relative shadow-sm border-border/50">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
            </Button>
          </div>
        </header>

        {/* Mobile-only CTA */}
        <div className="md:hidden">
          <QuickStartCTA />
        </div>

        <div className="space-y-8">
          {/* Stats Grid */}
          <section>
            <ProgressStats stats={transformedData.progressStats} />
          </section>

          {/* Recommended Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Recommended for you
              </h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <RecommendedQuizzes />
          </section>

          {/* Analytics & Activity Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <section ref={analyticsRef}>
                <AnalyticsSection analytics={transformedData.analytics} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Leaderboard />
                <ActivityFeed activities={transformedData.activities} />
              </div>
            </div>

            <div className="space-y-8">
              <Achievements achievements={transformedData.achievements} />
              <SocialSignals data={transformedData.socialSignals} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
