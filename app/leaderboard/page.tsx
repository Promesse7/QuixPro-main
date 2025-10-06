"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, Star, TrendingUp, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

// Extended mock data for full leaderboard page
const mockLeaderboardData = {
  levelRankings: {
    S3: Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      name: i === 0 ? "Aline Uwimana" : `Student ${i + 1}`,
      avatar: "/student-avatar.png",
      score: 1420 - i * 15,
      quizzes: 18 - Math.floor(i / 3),
      average: 85 - Math.floor(i / 2),
      level: "S3",
      rank: i + 1,
      trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same",
    })),
  },
  overallRankings: Array.from({ length: 100 }, (_, i) => ({
    id: `${i + 1}`,
    name: i === 22 ? "Aline Uwimana" : `Student ${i + 1}`,
    avatar: "/student-avatar.png",
    score: 2850 - i * 25,
    level: `S${Math.floor(Math.random() * 6) + 1}`,
    rank: i + 1,
    trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same",
  })),
}

const mockUser = {
  id: "1",
  name: "Aline Uwimana",
  email: "aline.uwimana@student.rw",
  role: "student",
  level: "S3",
  avatar: "/student-avatar.png",
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-400" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-300" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <Trophy className="h-4 w-4 text-muted-foreground" />
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-400" />
    case "down":
      return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
    default:
      return <div className="h-4 w-4" />
  }
}

export default function LeaderboardPage() {
  const [selectedLevel, setSelectedLevel] = useState("S3")
  const [activeTab, setActiveTab] = useState("level")

  const currentUser = mockLeaderboardData.levelRankings.S3.find((user) => user.name === "Aline Uwimana")
  const overallRank = mockLeaderboardData.overallRankings.find((user) => user.name === "Aline Uwimana")

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button asChild variant="ghost" size="sm" className="glow-effect">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-bold glow-text mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">See how you rank among your peers and compete for the top spots!</p>
          </div>

          {/* Your Rankings Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 glow-text">
                  <Trophy className="h-5 w-5" />
                  <span>Your Level Ranking</span>
                </CardTitle>
                <CardDescription>Among {selectedLevel} students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold glow-text mb-2">#{currentUser?.rank}</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentUser?.score} points • {currentUser?.average}% average
                  </p>
                  <Badge variant="outline" className="glow-effect">
                    {currentUser?.quizzes} quizzes completed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 glow-text">
                  <Star className="h-5 w-5" />
                  <span>Overall Ranking</span>
                </CardTitle>
                <CardDescription>Among all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold glow-text mb-2">#{overallRank?.rank}</div>
                  <p className="text-sm text-muted-foreground mb-4">{overallRank?.score} total points</p>
                  <Badge variant="outline" className="glow-effect">
                    {overallRank?.level} Level
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Leaderboard */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 glow-text">
                <Trophy className="h-6 w-6" />
                <span>Rankings</span>
              </CardTitle>
              <CardDescription>Complete leaderboard rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass-effect mb-6">
                  <TabsTrigger value="level">My Level ({selectedLevel})</TabsTrigger>
                  <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
                </TabsList>

                <TabsContent value="level" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-40 glass-effect">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P1">Primary 1</SelectItem>
                        <SelectItem value="P2">Primary 2</SelectItem>
                        <SelectItem value="P3">Primary 3</SelectItem>
                        <SelectItem value="P4">Primary 4</SelectItem>
                        <SelectItem value="P5">Primary 5</SelectItem>
                        <SelectItem value="P6">Primary 6</SelectItem>
                        <SelectItem value="S1">Secondary 1</SelectItem>
                        <SelectItem value="S2">Secondary 2</SelectItem>
                        <SelectItem value="S3">Secondary 3</SelectItem>
                        <SelectItem value="S4">Secondary 4</SelectItem>
                        <SelectItem value="S5">Secondary 5</SelectItem>
                        <SelectItem value="S6">Secondary 6</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="glow-effect">
                      {mockLeaderboardData.levelRankings.S3.length} students
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {mockLeaderboardData.levelRankings.S3.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                          student.name === "Aline Uwimana"
                            ? "bg-primary/20 border border-primary/30 glow-effect"
                            : "bg-accent/10 hover:bg-accent/20"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-[80px]">
                          {getRankIcon(student.rank)}
                          <span className="font-bold text-lg w-8">#{student.rank}</span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.quizzes} quizzes • {student.average}% average
                          </p>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-lg">{student.score}</p>
                          <div className="flex items-center justify-end space-x-1">
                            {getTrendIcon(student.trend)}
                            <span className="text-xs text-muted-foreground">points</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="overall" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">All Students</h3>
                    <Badge variant="outline" className="glow-effect">
                      {mockLeaderboardData.overallRankings.length} students
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {mockLeaderboardData.overallRankings.slice(0, 50).map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                          student.name === "Aline Uwimana"
                            ? "bg-primary/20 border border-primary/30 glow-effect"
                            : "bg-accent/10 hover:bg-accent/20"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-[80px]">
                          {getRankIcon(student.rank)}
                          <span className="font-bold text-lg w-8">#{student.rank}</span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {student.level}
                          </Badge>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-lg">{student.score}</p>
                          <div className="flex items-center justify-end space-x-1">
                            {getTrendIcon(student.trend)}
                            <span className="text-xs text-muted-foreground">points</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
