"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

interface StreakTrackerProps {
  streak: number;
  lastActivityDate?: Date;
}

export function StreakTracker({ streak, lastActivityDate }: StreakTrackerProps) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Card className="glass-effect border-border/50 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{streak} Day Streak</p>
              <p className="text-orange-200 text-sm">Keep learning daily!</p>
            </div>
          </div>
          <div className="text-right">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-blue-200">
              Last activity: {lastActivityDate ? new Date(lastActivityDate).toLocaleDateString() : 'Today'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          {daysOfWeek.map((day, index) => (
            <div key={day} className="flex-1 text-center">
              <div className={`
                w-full aspect-square rounded-lg flex items-center justify-center mb-1
                ${index < streak ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/30'}
              `}>
                <Flame className="w-4 h-4" />
              </div>
              <p className="text-xs text-blue-200">{day}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}