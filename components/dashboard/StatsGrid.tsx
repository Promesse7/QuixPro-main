// components/dashboard/StatsGrid.tsx
import { ArrowUpRightIcon, ChatBubbleBottomCenterTextIcon, RocketLaunchIcon, UserGroupIcon, ShareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you have a shadcn/ui-like Card component

// Reusing your suggested card structure but adapting for a dashboard overview
interface StatCardProps {
  title: string;
  value: string;
  description: string; // e.g., "vs. last month"
  icon: React.ElementType;
  changeType?: 'positive' | 'negative' | 'neutral'; // For styling the description/arrow
}

const StatCard = ({ title, value, description, icon: Icon, changeType = 'neutral' }: StatCardProps) => {
  const changeColorClass = changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card className="flex flex-col h-full bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg transition-transform duration-200 hover:scale-[1.01]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className={`text-xs mt-2 ${changeColorClass} flex items-center gap-1`}>
          {changeType === 'positive' && <ArrowUpRightIcon className="h-4 w-4 inline" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export function StatsGrid() {
  // Explicitly type the 'stats' array to ensure type checking
  const stats: StatCardProps[] = [
    {
      title: 'Total XP Earned',
      value: '12,450 XP',
      description: '+18.5% vs. last month',
      icon: RocketLaunchIcon,
      changeType: 'positive',
    },
    {
      title: 'Unread Messages',
      value: '12',
      description: 'from 3 chats',
      icon: ChatBubbleBottomCenterTextIcon,
      changeType: 'neutral',
    },
    {
      title: 'Quizzes Completed',
      value: '23',
      description: '+5 since last week',
      icon: CheckCircleIcon,
      changeType: 'positive',
    },
    {
      title: 'Quix Sites Interactions',
      value: '2,100',
      description: 'Comments & reactions',
      icon: UserGroupIcon,
      changeType: 'positive',
    },
    {
      title: 'Resources Shared',
      value: '58',
      description: 'via Quix Links',
      icon: ShareIcon,
      changeType: 'positive',
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </section>
  );
}
