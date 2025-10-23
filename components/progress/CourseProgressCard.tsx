"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

interface CourseProgressProps {
  userId: string;
  courseId: string;
  courseName: string;
}

export function CourseProgressCard({ userId, courseId, courseName }: CourseProgressProps) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [userId, courseId]);

  const fetchProgress = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/user/progress?userId=${userId}&courseId=${courseId}`);
      const data = await res.json();
      setProgress(data.progress[0]);
    } catch (error) {
      console.error('Progress fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-800 rounded-lg h-48" />;
  if (!progress) return null;

  return (
    <Card className="glass-effect border-border/50 hover:glow-effect transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            {courseName}
          </CardTitle>
          <Badge variant="secondary">
            {progress.completedUnits?.length || 0} / {progress.totalUnits || 0} units
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-white font-semibold">{Math.round(progress.overallProgress || 0)}%</span>
          </div>
          <Progress value={progress.overallProgress || 0} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
            <div className="font-bold text-white">{progress.totalXPEarned || 0}</div>
            <div className="text-muted-foreground text-xs">XP Earned</div>
          </div>
          <div>
            <Target className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <div className="font-bold text-white">{Math.round(progress.averageScore || 0)}%</div>
            <div className="text-muted-foreground text-xs">Avg Score</div>
          </div>
          <div>
            <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <div className="font-bold text-white">{Math.round((progress.timeSpent || 0) / 60)}h</div>
            <div className="text-muted-foreground text-xs">Time Spent</div>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/course/${courseId}`}>
            Continue Learning
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}