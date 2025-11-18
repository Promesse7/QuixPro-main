"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";

interface BadgeShowcaseProps {
  badges: any[];
  earnedCount: number;
}

export function BadgeShowcase({ badges, earnedCount }: BadgeShowcaseProps) {
  const displayBadges = badges.slice(0, 9);
  
  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 glow-text">
          <Award className="w-5 h-5 text-yellow-400" />
          Badges ({earnedCount}/{badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {displayBadges.map((badge, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all
                ${badge.isEarned 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50' 
                  : 'bg-white/5 border-2 border-dashed border-white/20'
                }
              `}
            >
              {badge.isEarned ? (
                <>
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <BadgeUI variant="secondary" className="text-xs px-2 py-0">
                    {badge.tier}
                  </BadgeUI>
                </>
              ) : (
                <Lock className="w-8 h-8 text-white/20" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}