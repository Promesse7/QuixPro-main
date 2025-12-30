// components/dashboard/views/MainDashboard.tsx
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RecommendedQuizzes } from '@/components/dashboard/recommended-quizzes';
import { Leaderboard } from '@/components/dashboard/leaderboard';
import { Achievements } from '@/components/dashboard/Achievements';
import { SocialSignals } from '@/components/dashboard/SocialSignals';

export function MainDashboard({ data }: { data: any }) {
  if (!data) {
    return <div>Loading dashboard data...</div>;
  }

  const { stats, analytics, activities, recommendedQuizzes, leaderboard, achievements, socialSignals } = data;

  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      <RecommendedQuizzes />
      <AnalyticsSection analytics={analytics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div className="space-y-8">
          <SocialSignals data={socialSignals} />
          <Leaderboard />
          <Achievements achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
