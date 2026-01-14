'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, BarChart2Icon, CheckCircleIcon, UsersIcon, SettingsIcon, LogOutIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', view: 'dashboard', icon: HomeIcon },
  { name: 'Courses', view: 'courses', icon: BarChart2Icon },
  { name: 'Quizzes', view: 'quizzes', icon: CheckCircleIcon },
  { name: 'Community', view: 'community', icon: UsersIcon },
  { name: 'Settings', view: 'settings', icon: SettingsIcon },
];

const NavItem = ({ item, isCollapsed, onNavigate, activeView }: { item: any, isCollapsed: boolean, onNavigate: (view: string) => void, activeView: string }) => {
  const isActive = activeView === item.view;

  return (
    <button onClick={() => onNavigate(item.view)} className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50'}`}>
      <item.icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
    </button>
  );
};

export const Sidebar = ({ onNavigate, activeView, isCollapsed }: { onNavigate: (view: string) => void, activeView: string, isCollapsed: boolean }) => {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border/50 p-4">
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
        {!isCollapsed && <span className="text-xl font-bold">Quix</span>}
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map(item => <NavItem key={item.name} item={item} isCollapsed={isCollapsed} onNavigate={onNavigate} activeView={activeView} />)}
      </nav>

      <div>
        <NavItem item={{ name: 'Logout', view: 'logout', icon: LogOutIcon }} isCollapsed={isCollapsed} onNavigate={() => { window.location.href = '/auth/logout'; }} activeView={activeView} />
      </div>
    </div>
  );
};

export const CollapsibleSidebar = ({ onNavigate, isCollapsed, onCollapse }: { onNavigate: (view: string) => void, isCollapsed: boolean, onCollapse: (isCollapsed: boolean) => void }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const handleNavigate = (view: string) => {
    setActiveView(view);
    onNavigate(view);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative bg-card h-screen z-20"
    >
      <Sidebar onNavigate={handleNavigate} activeView={activeView} isCollapsed={isCollapsed} />
      <button onClick={() => onCollapse(!isCollapsed)} className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-primary-focus">
        {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
      </button>
    </motion.div>
  );
};
