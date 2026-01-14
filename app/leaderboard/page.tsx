"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, Star, TrendingUp, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PageTransition, StaggerContainer, fadeInUp } from "@/components/ui/page-transition"

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
    <PageTransition className="min-h-screen bg-background">
      <DashboardHeader user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button asChild variant="ghost" size="sm" className="hover:scale-105 transition-smooth">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">See how you rank among your peers and compete for the top spots!</p>
          </motion.div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: <Trophy className="h-5 w-5" />,
                title: "Your Level Ranking",
                description: `Among ${selectedLevel} students`,
                rank: currentUser?.rank,
                details: `${currentUser?.score} points • ${currentUser?.average}% average`,
                badge: `${currentUser?.quizzes} quizzes completed`,
              },
              {
                icon: <Star className="h-5 w-5" />,
                title: "Overall Ranking",
                description: "Among all students",
                rank: overallRank?.rank,
                details: `${overallRank?.score} total points`,
                badge: `${overallRank?.level} Level`,
              },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4, scale: 1.02 }}>
                <Card className="border-border hover:border-primary/30 transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                        {card.icon}
                      </motion.div>
                      <span>{card.title}</span>
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                        className="text-3xl font-bold mb-2"
                      >
                        #{card.rank}
                      </motion.div>
                      <p className="text-sm text-muted-foreground mb-4">{card.details}</p>
                      <Badge variant="outline">{card.badge}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Trophy className="h-6 w-6" />
                  </motion.div>
                  <span>Rankings</span>
                </CardTitle>
                <CardDescription>Complete leaderboard rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="level" className="transition-smooth">
                      My Level ({selectedLevel})
                    </TabsTrigger>
                    <TabsTrigger value="overall" className="transition-smooth">
                      Overall Rankings
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
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
                        {mockLeaderboardData.levelRankings.S3.slice(0, 20).map((student, index) => (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                              student.name === "Aline Uwimana"
                                ? "bg-primary/20 border border-primary/30"
                                : "bg-accent/10 hover:bg-accent/20"
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-[80px]">
                              <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                                {getRankIcon(student.rank)}
                              </motion.div>
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
                              <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.03, type: "spring" }}
                                className="font-bold text-lg"
                              >
                                {student.score}
                              </motion.p>
                              <div className="flex items-center justify-end space-x-1">
                                {getTrendIcon(student.trend)}
                                <span className="text-xs text-muted-foreground">points</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Similar animations for overall tab ... */}
                    <TabsContent value="overall" className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">All Students</h3>
                        <Badge variant="outline" className="glow-effect">
                          {mockLeaderboardData.overallRankings.length} students
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {mockLeaderboardData.overallRankings.slice(0, 50).map((student, index) => (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                              student.name === "Aline Uwimana"
                                ? "bg-primary/20 border border-primary/30"
                                : "bg-accent/10 hover:bg-accent/20"
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-[80px]">
                              <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                                {getRankIcon(student.rank)}
                              </motion.div>
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
                              <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.03, type: "spring" }}
                                className="font-bold text-lg"
                              >
                                {student.score}
                              </motion.p>
                              <div className="flex items-center justify-end space-x-1">
                                {getTrendIcon(student.trend)}
                                <span className="text-xs text-muted-foreground">points</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
