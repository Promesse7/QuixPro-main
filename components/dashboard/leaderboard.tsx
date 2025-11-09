"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface LeaderboardStudent {
  id: string
  name: string
  level: string
  totalPoints: number
  averageScore: number
  completedQuizzes: number
  certificates: number
  rank: number
  avatar?: string
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-white" />
    case 2:
      return <Medal className="h-5 w-5 text-white/80" />
    case 3:
      return <Award className="h-5 w-5 text-white/60" />
    default:
      return <Trophy className="h-4 w-4 text-white/40" />
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-white" />
    case "down":
      return <TrendingUp className="h-4 w-4 text-white/50 rotate-180" />
    default:
      return <div className="h-4 w-4" />
  }
}

export function Leaderboard() {
  const [selectedLevel, setSelectedLevel] = useState("S3")
  const [selectedExam, setSelectedExam] = useState("Mathematics S3 Mid-Term")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardStudent[]>([])
  const [overallData, setOverallData] = useState<LeaderboardStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)

    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        const baseUrl = getBaseUrl();

        // Fetch level-specific leaderboard
        const levelResponse = await fetch(`${baseUrl}/api/leaderboard?level=${selectedLevel}&limit=20`)
        const levelData = await levelResponse.json()

        // Fetch overall leaderboard
        const overallResponse = await fetch(`${baseUrl}/api/leaderboard?limit=50`)
        const overallDataResult = await overallResponse.json()

        if (levelResponse.ok) {
          // Transform data to match component's expected format
          const formattedLevelData = levelData.leaderboard.map((user, index) => ({
            id: user.id,
            name: user.name,
            level: user.level,
            totalPoints: user.progress?.totalPoints || 0,
            averageScore: user.progress?.averageScore || 0,
            completedQuizzes: user.progress?.quizzesTaken || 0,
            certificates: 0,
            streak: 0,
            rank: index + 1,
            avatar: user.image
          }));
          setLeaderboardData(formattedLevelData)
        }

        if (overallResponse.ok) {
          // Transform data to match component's expected format
          const formattedOverallData = overallDataResult.leaderboard.map((user, index) => ({
            id: user.id,
            name: user.name,
            level: user.level,
            totalPoints: user.progress?.totalPoints || 0,
            averageScore: user.progress?.averageScore || 0,
            completedQuizzes: user.progress?.quizzesTaken || 0,
            certificates: 0,
            streak: 0,
            rank: index + 1,
            avatar: user.image
          }));
          setOverallData(formattedOverallData)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        // Fallback to empty arrays
        setLeaderboardData([])
        setOverallData([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [selectedLevel])

  const userLevelRank = leaderboardData.find((student) => student.id === currentUser?.id)
  const userOverallRank = overallData.find((student) => student.id === currentUser?.id)

  if (loading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 glow-text">
            <Trophy className="h-5 w-5" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription>See how you rank among your peers</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 glow-text">
          <Trophy className="h-5 w-5" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription>See how you rank among your peers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="level" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-effect">
            <TabsTrigger value="level" className="text-xs">
              My Level
            </TabsTrigger>
            <TabsTrigger value="exam" className="text-xs">
              By Exam
            </TabsTrigger>
            <TabsTrigger value="overall" className="text-xs">
              Overall
            </TabsTrigger>
          </TabsList>

          <TabsContent value="level" className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32 glass-effect">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                  <SelectItem value="P4">P4</SelectItem>
                  <SelectItem value="P5">P5</SelectItem>
                  <SelectItem value="P6">P6</SelectItem>
                  <SelectItem value="S1">S1</SelectItem>
                  <SelectItem value="S2">S2</SelectItem>
                  <SelectItem value="S3">S3</SelectItem>
                  <SelectItem value="S4">S4</SelectItem>
                  <SelectItem value="S5">S5</SelectItem>
                  <SelectItem value="S6">S6</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="glow-effect">
                Your Rank: #{userLevelRank?.rank || "N/A"}
              </Badge>
            </div>

            <div className="space-y-3">
              {leaderboardData.length > 0 ? (
                leaderboardData.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      student.id === currentUser?.id
                        ? "bg-primary/20 border border-primary/30 glow-effect"
                        : "bg-accent/10 hover:bg-accent/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getRankIcon(student.rank)}
                      <span className="font-bold text-sm w-6">#{student.rank}</span>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.completedQuizzes} quizzes • {student.averageScore}% avg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{student.totalPoints}</p>
                      <div className="flex items-center space-x-1">{getTrendIcon("up")}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No students found for {selectedLevel}</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exam" className="space-y-4">
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="glass-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics S3 Mid-Term">Mathematics S3 Mid-Term</SelectItem>
                <SelectItem value="English S3 Final">English S3 Final</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-center py-8 text-muted-foreground">Exam-specific rankings coming soon!</div>
          </TabsContent>

          <TabsContent value="overall" className="space-y-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-bold">Your Overall Rank</span>
              </div>
              <div className="text-2xl font-bold glow-text">#{userOverallRank?.rank || "N/A"}</div>
              <p className="text-sm text-muted-foreground">Out of all students</p>
            </div>

            <div className="space-y-3">
              {overallData.slice(0, 10).map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    student.id === currentUser?.id
                      ? "bg-primary/20 border border-primary/30 glow-effect"
                      : "bg-accent/10 hover:bg-accent/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getRankIcon(student.rank)}
                    <span className="font-bold text-sm w-6">#{student.rank}</span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {student.level}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{student.totalPoints}</p>
                    <div className="flex items-center space-x-1">{getTrendIcon("up")}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
