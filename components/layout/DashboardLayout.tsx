'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CollapsibleSidebar } from '@/components/dashboard/Sidebar';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { NotificationProvider as MainNotificationProvider } from '@/lib/contexts/NotificationContext';

export default function DashboardLayout({ children, onNavigate }: { children: React.ReactNode, onNavigate: (view: string) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <MainNotificationProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-gray-900 text-white">
          <CollapsibleSidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} onNavigate={onNavigate} />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Analytics</h1>
              
              <div className="flex items-center space-x-4">
                <NotificationBell />
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                      {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline text-sm font-medium">
                      {session?.user?.name || 'User'}
                    </span>
                  </button>
                </div>
              </div>
            </header>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </NotificationProvider>
    </MainNotificationProvider>
  );
}
