// components/dashboard/ActivityFeed.tsx
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircleIcon, ChatBubbleOvalLeftEllipsisIcon, UsersIcon, BookOpenIcon,
  MegaphoneIcon, QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Component for a single activity item
interface ActivityItemProps {
  type: 'quiz_completed' | 'new_message' | 'group_joined' | 'answer_received' | 'post_updated' | 'general' | 'certificate_earned';
  description: string;
  time: string;
  link?: string; // Optional link to the activity details
}

const timeSince = (date: string | Date): string => {
  const aDate = new Date(date);
  const seconds = Math.floor((new Date().getTime() - aDate.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

const getActivityIcon = (type: ActivityItemProps['type']) => {
  switch (type) {
    case 'quiz_completed':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'certificate_earned':
      return <BookOpenIcon className="h-5 w-5 text-yellow-500" />;
    case 'new_message':
      return <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-blue-500" />;
    case 'group_joined':
      return <UsersIcon className="h-5 w-5 text-purple-500" />;
    case 'answer_received':
      return <QuestionMarkCircleIcon className="h-5 w-5 text-orange-500" />;
    case 'post_updated':
      return <MegaphoneIcon className="h-5 w-5 text-indigo-500" />;
    case 'general':
    default:
      return <MegaphoneIcon className="h-5 w-5 text-muted-foreground" />;
  }
};

const ActivityItem = ({ type, description, time, link }: ActivityItemProps) => {
  const content = (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(type)}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground leading-snug">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeSince(time)}</p>
      </div>
    </div>
  );

  return link ? (
    <Link href={link} className="block hover:bg-muted/50 rounded-2xl p-3 -m-3 transition-all duration-300">
      {content}
    </Link>
  ) : (
    <div className="p-3">
      {content}
    </div>
  );
};

export function ActivityFeed({ activities }: { activities: ActivityItemProps[] }) {
  if (!activities) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Learning Timeline</h2>
      <Card className="border border-border/50 shadow-xl p-4">
        <CardContent className="p-0">
          <ul className="divide-y divide-border -mx-3"> {/* Added negative margin to counteract Card padding */}
            {activities.map((activity, index) => (
              <li key={index} className="py-2 first:pt-0 last:pb-0">
                <ActivityItem {...activity} />
              </li>
            ))}
          </ul>
          {/* Optional: "View All" link */}
          <div className="mt-4 text-center">
            <Link href="/activity" className="text-primary hover:underline text-sm">
              View All Activity
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
