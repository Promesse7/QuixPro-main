'use client'

import { useState } from 'react';
import { CollapsibleSidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children, onNavigate }: { children: React.ReactNode, onNavigate: (view: string) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <CollapsibleSidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} onNavigate={onNavigate} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          {/* Search, user profile, etc. can go here */}
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
