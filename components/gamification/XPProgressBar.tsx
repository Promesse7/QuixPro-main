"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp } from "lucide-react";

interface XPProgressBarProps {
  currentXP: number;
  currentLevel: number;
}

export function XPProgressBar({ currentXP, currentLevel }: XPProgressBarProps) {
  const xpForNextLevel = currentLevel * 1000;
  const xpInCurrentLevel = currentXP % 1000;
  const progressPercent = (xpInCurrentLevel / xpForNextLevel) * 100;

  return (
    <Card className="glass-effect border-border/50 glow-effect mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Level {currentLevel}</p>
              <p className="text-blue-200 text-sm">
                {xpInCurrentLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{(currentXP || 0).toLocaleString()}</p>
            <p className="text-blue-200 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {xpForNextLevel - xpInCurrentLevel} to Level {currentLevel + 1}
            </p>
          </div>
        </div>
        <div className="relative">
          <Progress value={progressPercent} className="h-4" />
          <div 
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}