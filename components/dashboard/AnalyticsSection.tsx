// components/dashboard/AnalyticsSection.tsx
import * as React from 'react';
import {
  ChartBarSquareIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Reusable placeholder card for analytics charts
type ChartPlaceholderProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

function ChartPlaceholder({
  title,
  description,
  icon: Icon,
}: ChartPlaceholderProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg flex flex-col transition-transform duration-200 hover:scale-[1.01]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex flex-grow items-center justify-center p-4">
        <div className="text-center text-muted-foreground text-sm">
          <p className="text-xl font-semibold text-foreground mb-2">
            {description}
          </p>
          <p>[Chart will be rendered here]</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsSection() {
  const charts: ChartPlaceholderProps[] = [
    {
      title: 'Weekly Quiz Activity',
      description: 'Quizzes attempted per day',
      icon: ChartBarSquareIcon,
    },
    {
      title: 'Subject Distribution',
      description: 'Breakdown by subject',
      icon: ChartPieIcon,
    },
    {
      title: 'Difficulty Breakdown',
      description: 'From Easy to Expert',
      icon: PresentationChartLineIcon,
    },
    {
      title: 'Chat Activity',
      description: 'Messages sent per day',
      icon: ChatBubbleOvalLeftEllipsisIcon,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Progress & Activity Analytics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {charts.map((chart, index) => (
          <ChartPlaceholder key={index} {...chart} />
        ))}
      </div>
    </section>
  );
}
