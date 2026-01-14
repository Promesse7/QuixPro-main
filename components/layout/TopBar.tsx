// components/layout/TopBar.tsx
import { MagnifyingGlassIcon, BellIcon, PlusCircleIcon } from '@heroicons/react/24/outline'; // Changed SearchIcon to MagnifyingGlassIcon for consistency
import Link from 'next/link';

export function TopBar() {
  return (
    <header className="flex items-center justify-between p-4 md:px-8 bg-card border-b border-border min-h-[60px] md:min-h-[72px] sticky top-0 z-30">
      {/* Context Selector (e.g., Current School / Level / Course) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:block">Context:</span>
        <select className="bg-input border border-border rounded-md px-3 py-1 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary">
          <option>My School</option>
          <option>Level 101</option>
          <option>Advanced Physics</option>
        </select>
      </div>

      {/* Global Actions: Search, Notifications, Create Button */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search quizzes, posts, users..."
            className="pl-10 pr-4 py-2 rounded-md bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-32 sm:w-48 md:w-64"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground">
          <BellIcon className="h-6 w-6" />
          {/* Example notification count - replace with dynamic data */}
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">3</span>
        </button>

        {/* Primary Action Button */}
        <Link href="/create" className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Create New</span>
        </Link>
        {/* Mobile only create button (icon only) */}
        <Link href="/create" className="sm:hidden p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground">
          <PlusCircleIcon className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
