"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Flame, Users, TrendingUp, Bell, Target } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RightPanelProps {
  dashboardData: any
  user: any
}

export function RightPanel({ dashboardData, user }: RightPanelProps) {
  return (
    <aside className="hidden 2xl:flex flex-col w-96 bg-gradient-to-b from-card/60 to-background backdrop-blur-xl border-l border-border/50 fixed right-0 top-0 h-screen overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* XP & Streak Section */}
          <Card className="border border-border/50 bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* XP Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">XP Points</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {dashboardData?.progressStats?.totalPoints || 0}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">650 / 1000 to next level</p>
                </div>

                {/* Streak */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/30">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold">Learning Streak</span>
                  </div>
                  <span className="text-lg font-bold text-orange-500">
                    {dashboardData?.progressStats?.streak || 0} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Courses */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Courses
            </h3>
            <div className="space-y-2">
              {["Physics S3", "Biology S2", "Mathematics S4"].map((course, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="block p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/30 hover:border-primary/50 transition-all group"
                >
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{course}</p>
                  <p className="text-xs text-muted-foreground">8 quizzes, 3 completed</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Quizzes */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Upcoming Quizzes
            </h3>
            <div className="space-y-2">
              {["Physics Unit 3", "Biology Practicals", "Math Integration"].slice(0, 3).map((quiz, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                  <p className="text-sm font-medium">{quiz}</p>
                  <Badge variant="secondary" className="text-xs mt-2">
                    In 3 days
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/quiz-selection">
                  <Target className="w-4 h-4 mr-2" />
                  Take a Quiz
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/groups">
                  <Users className="w-4 h-4 mr-2" />
                  Join Group
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/chat">
                  <Bell className="w-4 h-4 mr-2" />
                  Ask Question
                </Link>
              </Button>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Alice J.", xp: 2840 },
                { name: "Bob K.", xp: 2650 },
                { name: "You", xp: 1850, isYou: true },
              ].map((entry, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-2 rounded text-sm",
                    entry.isYou ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    <span className={entry.isYou ? "font-bold" : ""}>{entry.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">{entry.xp} XP</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  )
}
