"use client";

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface OnlineStatusIndicatorProps {
  userId: string;
  showText?: boolean;
}

export function OnlineStatusIndicator({ userId, showText = false }: OnlineStatusIndicatorProps) {
  const { isOnline, lastSeenText, loading } = useOnlineStatus(userId);

  if (loading) {
    return showText ? (
      <span className="text-xs text-muted-foreground">Loading...</span>
    ) : null;
  }

  if (showText) {
    return (
      <span className="text-xs text-muted-foreground">
        {isOnline ? 'Online' : lastSeenText ? `Last seen ${lastSeenText}` : 'Offline'}
      </span>
    );
  }

  return isOnline ? (
    <span className="w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
  ) : null;
}
