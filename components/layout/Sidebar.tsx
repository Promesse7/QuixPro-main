// components/layout/Sidebar.tsx
'use client'; // Mark as Client Component if it uses hooks like useState or useEffect

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link highlighting
import { useState } from 'react';
import {
  HomeIcon, BookOpenIcon, AcademicCapIcon, ChatBubbleBottomCenterTextIcon,
  UsersIcon, GlobeAltIcon, TrophyIcon, UserCircleIcon, Bars3Icon, XMarkIcon, Cog8ToothIcon
} from '@heroicons/react/24/outline'; // Example icons, added Cog8ToothIcon for settings

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for mobile/foldable behavior

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Courses', href: '/courses', icon: BookOpenIcon },
    { name: 'Quizzes', href: '/quizzes', icon: AcademicCapIcon },
    { name: 'Quix Chat', href: '/quix-chat', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Groups', href: '/groups', icon: UsersIcon },
    { name: 'Quix Sites', href: '/quix-sites', icon: GlobeAltIcon },
    { name: 'Certificates', href: '/certificates', icon: TrophyIcon },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile / Small Screen Toggle Button and Header */}
      <div className="md:hidden p-4 bg-card border-b border-border fixed top-0 left-0 w-full z-50 flex justify-between items-center h-[60px]"> {/* Set explicit height for mobile header */}
        <button onClick={toggleSidebar} className="text-foreground">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <h1 className="text-lg font-bold text-primary">Quix Studio</h1>
        <div></div> {/* Placeholder for consistent spacing if needed */}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - positioned fixed for desktop, conditional for mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 md:z-auto
          w-64 bg-card border-r border-border
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:static md:flex-shrink-0 md:w-64
          pt-[60px] md:pt-0 {/* Adjust padding-top for mobile header */}
        `}
      >
        <div className="p-6 border-b border-border hidden md:block"> {/* Hide on mobile, shown on desktop */}
          <h2 className="text-2xl font-bold text-primary">Quix Studio</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                  transition-colors duration-200
                `}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after navigation
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        {/* Profile/Settings section */}
        <div className="p-4 border-t border-border mt-auto">
          <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200" onClick={() => setIsOpen(false)}>
            <UserCircleIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200" onClick={() => setIsOpen(false)}>
            <Cog8ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
