// app/dashboard/page.tsx
import { Fragment } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* 1. Left Sidebar (Primary Navigation) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Top Bar (Context + Actions) */}
        <TopBar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl space-y-8"> {/* Added space-y-8 for vertical spacing */}
            {/* 3. Stat Cards (High-level metrics) */}
            <StatsGrid />

            {/* 4. Charts / Visual Analytics */}
            <AnalyticsSection />

            {/* 5. Activity Feed (Detailed items) */}
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
}
