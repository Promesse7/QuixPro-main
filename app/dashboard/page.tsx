// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MainDashboard } from '@/components/dashboard/views/MainDashboard';
import { CoursesView } from '@/components/dashboard/views/CoursesView';
import { QuizzesView } from '@/components/dashboard/views/QuizzesView';
import { CommunityView } from '@/components/dashboard/views/CommunityView';
import { SettingsView } from '@/components/dashboard/views/SettingsView';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/dashboard-data');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentView === 'dashboard') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentView]);

  const renderView = () => {
    if (loading) {
        return <div>Loading...</div>;
    }

    switch (currentView) {
      case 'dashboard':
        return <MainDashboard data={dashboardData} />;
      case 'courses':
        return <CoursesView />;
      case 'quizzes':
        return <QuizzesView />;
      case 'community':
        return <CommunityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard data={dashboardData} />;
    }
  };

  return (
    <DashboardLayout onNavigate={setCurrentView}>
      {renderView()}
    </DashboardLayout>
  );
}
