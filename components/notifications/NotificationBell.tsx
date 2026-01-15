'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationContext';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900">
            <span className="sr-only">Unread notifications</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No notifications</div>
            ) : (
              <ul className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-700 ${!notification.read ? 'bg-gray-800' : 'bg-gray-900'}`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 bg-gray-800 text-center">
              <button
                onClick={() => {
                  // Add clear all functionality
                  // clearAll();
                  // Or navigate to notifications page
                }}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
