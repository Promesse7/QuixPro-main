// components/dashboard/ActivityFeed.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle, Award, MessageSquare, Users, HelpCircle, Megaphone,
  BookOpen, Trophy, Target, TrendingUp, Calendar, Clock
} from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

// Component for a single activity item
interface ActivityItemProps {
  type: 'quiz_completed' | 'certificate_earned' | 'new_message' | 'group_joined' | 'answer_received' | 'post_updated' | 'general' | 'streak_milestone' | 'score_improvement';
  description: string;
  time: string;
  link?: string; // Optional link to the activity details
  score?: number; // Optional score for quiz activities
  subject?: string; // Optional subject for quiz activities
  difficulty?: string; // Optional difficulty for quiz activities
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
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'certificate_earned':
      return <Award className="h-5 w-5 text-yellow-500" />;
    case 'streak_milestone':
      return <Trophy className="h-5 w-5 text-orange-500" />;
    case 'score_improvement':
      return <TrendingUp className="h-5 w-5 text-blue-500" />;
    case 'new_message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'group_joined':
      return <Users className="h-5 w-5 text-purple-500" />;
    case 'answer_received':
      return <HelpCircle className="h-5 w-5 text-orange-500" />;
    case 'post_updated':
      return <Megaphone className="h-5 w-5 text-indigo-500" />;
    case 'general':
    default:
      return <BookOpen className="h-5 w-5 text-muted-foreground" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    case 'expert': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ActivityItem = ({ type, description, time, link, score, subject, difficulty }: ActivityItemProps) => {
  const content = (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{description}</p>
        
        {/* Additional details for quiz activities */}
        {(score || subject || difficulty) && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {score && (
              <Badge className={`text-xs ${getScoreColor(score)}`}>
                {score}%{score >= 70 ? ' 🎉' : ''}
              </Badge>
            )}
            {subject && (
              <Badge variant="outline" className="text-xs">
                {subject}
              </Badge>
            )}
            {difficulty && (
              <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{timeSince(time)}</p>
        </div>
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
  if (!activities || activities.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Learning Timeline</h2>
        <Card className="border border-border/50 shadow-xl p-6">
          <CardContent className="p-0 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity yet. Start taking quizzes to see your learning journey!</p>
            <Link href="/quiz" className="inline-block mt-4">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                Take Your First Quiz
              </Badge>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Learning Timeline</h2>
        <Badge variant="outline" className="text-xs">
          {activities.length} activities
        </Badge>
      </div>
      <Card className="border border-border/50 shadow-xl p-4">
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] pr-4">
            <ul className="divide-y divide-border -mx-3">
              {activities.map((activity, index) => (
                <li key={index} className="py-2 first:pt-0 last:pb-0">
                  <ActivityItem {...activity} />
                </li>
              ))}
            </ul>
          </ScrollArea>
          {activities.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/activity" className="text-primary hover:underline text-sm">
                View All Activity
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
