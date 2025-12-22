// components/dashboard/SocialSignals.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SocialSignalsData {
    unreadMessages: number;
    groupUpdates: number;
}

export function SocialSignals({ data }: { data: SocialSignalsData }) {
    const { unreadMessages, groupUpdates } = data;
    const hasNotifications = unreadMessages > 0 || groupUpdates > 0;

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellIcon className="h-5 w-5"/>
                        <span>Stay Connected</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasNotifications ? (
                        <div className="space-y-3">
                            {unreadMessages > 0 && (
                                <Link href="/chat" className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
                                        <span className="font-semibold">Unread Messages</span>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground">{unreadMessages}</span>
                                </Link>
                            )}
                            {groupUpdates > 0 && (
                                <Link href="/groups" className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <UserGroupIcon className="h-6 w-6 text-purple-400" />
                                        <span className="font-semibold">Group Updates</span>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground">{groupUpdates}</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted-foreground">No new notifications.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
