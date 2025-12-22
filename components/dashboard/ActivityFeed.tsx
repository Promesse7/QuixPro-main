// components/dashboard/ActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui-like Card
import {
  CheckCircleIcon, ChatBubbleOvalLeftEllipsisIcon, UsersIcon, BookOpenIcon,
  MegaphoneIcon, QuestionMarkCircleIcon // Added QuestionMarkCircleIcon for answer_received
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Component for a single activity item
interface ActivityItemProps {
  type: 'quiz_completed' | 'new_message' | 'group_joined' | 'answer_received' | 'post_updated' | 'general';
  description: string;
  time: string;
  link?: string; // Optional link to the activity details
}

const getActivityIcon = (type: ActivityItemProps['type']) => {
  switch (type) {
    case 'quiz_completed':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'new_message':
      return <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-blue-500" />;
    case 'group_joined':
      return <UsersIcon className="h-5 w-5 text-purple-500" />;
    case 'answer_received':
      return <QuestionMarkCircleIcon className="h-5 w-5 text-orange-500" />; // Changed icon for answer_received
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
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );

  return link ? (
    <Link href={link} className="block hover:bg-accent rounded-lg p-3 -m-3 transition-colors duration-200">
      {content}
    </Link>
  ) : (
    <div className="p-3">
      {content}
    </div>
  );
};

export function ActivityFeed() {
  // Example data - replace with actual data fetched from GET /activity/feed
  const activities: ActivityItemProps[] = [
    {
      type: 'quiz_completed',
      description: 'You completed Quiz: "Trigonometry Basics"',
      time: '2 hours ago',
      link: '/quizzes/123',
    },
    {
      type: 'new_message',
      description: 'New message from Group X: "Project Deadline Approaching!"',
      time: '5 hours ago',
      link: '/quix-chat/group-x',
    },
    {
      type: 'answer_received',
      description: 'New answer on your question: "What is the capital of France?"',
      time: '1 day ago',
      link: '/quix-sites/post/456',
    },
    {
      type: 'group_joined',
      description: 'You joined Group: "A-Level Physics Enthusiasts"',
      time: '2 days ago',
      link: '/groups/789',
    },
    {
      type: 'post_updated',
      description: 'Admin updated "Welcome to Quix Studio" announcement',
      time: '3 days ago',
      link: '/quix-sites/announcements',
    },
    {
      type: 'quiz_completed',
      description: 'You completed Quiz: "Introduction to React Hooks"',
      time: '4 days ago',
      link: '/quizzes/101',
    },
    {
      type: 'new_message',
      description: 'Direct message from John Doe: "Can you help me with this problem?"',
      time: '5 days ago',
      link: '/quix-chat/john-doe',
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Learning Timeline</h2>
      <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg p-4">
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
