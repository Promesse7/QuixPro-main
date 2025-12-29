// app/dashboard/page.tsx
'use client'

import { ProgressStats } from '@/components/dashboard/progress-stats';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import Link from 'next/link';
import { 
  Trophy, TrendingUp, Users, Award, Clock, Target, Zap, Star, 
  ChevronRight, Play, BookOpen, MessageSquare, Settings, Activity,
  Brain, Bell, Menu, X, BarChart3, Calendar, Home, Crown, Medal, 
  CheckCircle, ArrowUp, Sparkles, Video, FileText, Globe
} from 'lucide-react';
import { RecommendedQuizzes } from '@/components/dashboard/recommended-quizzes';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Achievements } from '@/components/dashboard/Achievements';
import { SocialSignals } from '@/components/dashboard/SocialSignals';
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb';
import { QuickStartCTA } from '@/components/app/QuickStartCTA';
import { getCurrentUser } from '@/lib/auth';
import React, { useState, useEffect, useRef } from 'react';

export default function Ultimate2025Dashboard() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

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
          console.log('Dashboard data received:', data);
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-gray-300" />;
    if (rank === 3) return <Award size={20} className="text-orange-400" />;
    return <Trophy size={16} className="text-white/40" />;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.5); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fade-in-left { animation: fadeInLeft 0.5s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-black text-white">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 p-6 z-50 transition-transform duration-500 ease-out ${!sidebarOpen ? '-translate-x-full' : ''}`}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Quix</h1>
            </div>
            <p className="text-sm text-white/60 ml-13">Learning Dashboard</p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item: any, i: number) => (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  item.id === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={{ 
                  animation: `fadeInLeft 0.5s ease-out ${i * 0.05}s forwards`,
                  opacity: 0
                }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold">
                {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'YU'}
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-white/60">Level {user?.level || 1}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-0'} p-8`}>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Welcome back! 👋</h2>
                  <p className="text-white/60">Here's your learning progress today</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                              
                <div className="relative">
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Bell size={20} />
                  </button>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse-slow">
                    3
                  </div>
                </div>
              </div>
              
            </div>
 {/* QuickStartCTA Component */}
                <QuickStartCTA />
            <div className="mt-4">
              <AppBreadcrumb items={[
                { label: 'Home', href: '/' },
                { label: 'Dashboard' }
              ]} />
            </div>
          </header>

          {/* Progress Stats */}
          <ProgressStats stats={transformedData.progressStats} />

          {/* Recommended Quizzes */}
          <div className="mb-8">
            <RecommendedQuizzes />
          </div>

          {/* Analytics & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Analytics Section */}
            <div className="lg:col-span-2">
              <AnalyticsSection analytics={transformedData.analytics} />
            </div>

            {/* Activity Feed */}
            <div>
              <ActivityFeed activities={transformedData.activities} />
            </div>
          </div>

          {/* Bottom Section: Leaderboard, Achievements, Social */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Leaderboard */}
            <div>
              <Leaderboard />
            </div>

            {/* Achievements */}
            <div>
              <Achievements achievements={transformedData.achievements} />
            </div>

            {/* Community/Social Signals */}
            <div>
              <SocialSignals data={transformedData.socialSignals} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}