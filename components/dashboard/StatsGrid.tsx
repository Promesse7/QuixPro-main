'use client'

import { ArrowUpRightIcon, RocketLaunchIcon, CheckCircleIcon, UserGroupIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stat {
  id: string;
  title: string;
  value: string;
  description: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

interface StatCardProps extends Stat {
  icon: React.ElementType;
}

const iconMap: { [key: string]: React.ElementType } = {
  xp: RocketLaunchIcon,
  streak: ArrowUpRightIcon,
  level: UserGroupIcon,
  quizzes: CheckCircleIcon,
  certs: CheckCircleIcon,
  default: QuestionMarkCircleIcon,
};

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

export function StatsGrid({ stats }: { stats: Stat[] }) {
  if (!stats) return null;

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          {...stat}
          icon={iconMap[stat.id] || iconMap.default}
        />
      ))}
    </section>
  );
}
