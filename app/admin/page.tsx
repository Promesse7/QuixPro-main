"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  FileText,
  Globe,
  Database,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from '@/lib/getBaseUrl';

interface AdminStats {
  totalUsers: number
  totalQuizzes: number
  totalCertificates: number
  activeUsers: number
  completionRate: number
  averageScore: number
}

interface DatabaseUser {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [levels, setLevels] = useState<Array<{ name: string }>>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalQuizzes: 0,
    totalCertificates: 0,
    activeUsers: 0,
    completionRate: 0,
    averageScore: 0,
  })
  const [recentUsers, setRecentUsers] = useState<DatabaseUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Load levels from DB for display
    ;(async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/levels`)
        if (res.ok) {
          const data = await res.json()
          setLevels(data.levels || [])
        }
      } catch (err) {
        console.error("Failed to load levels", err)
      }
    })()

    const fetchAdminData = async () => {
      try {
        setLoading(true)

        // Fetch leaderboard data to get user stats
        const baseUrlForLeaderboard = getBaseUrl();
        const response = await fetch(`${baseUrlForLeaderboard}/api/leaderboard?limit=100`);
        const data = await response.json()

        if (response.ok && data.leaderboard) {
          const users = data.leaderboard

          // Calculate stats from real data
          const totalUsers = users.length
          const totalQuizzes = users.reduce((sum: number, user: any) => sum + (user.completedQuizzes || 0), 0)
          const totalCertificates = users.reduce((sum: number, user: any) => sum + (user.certificates || 0), 0)
          const averageScore = users.reduce((sum: number, user: any) => sum + (user.averageScore || 0), 0) / totalUsers

          setStats({
            totalUsers,
            totalQuizzes,
            totalCertificates,
            activeUsers: Math.floor(totalUsers * 0.3), // Estimate 30% active
            completionRate: 78.5, // Mock for now
            averageScore: Math.round(averageScore),
          })

          // Set recent users (first 3)
          setRecentUsers(
            users.slice(0, 3).map((user: any) => ({
              id: user.id,
              name: user.name,
              email: `${user.name.toLowerCase().replace(" ", ".")}@student.rw`,
              role: "student",
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
        // Fallback to mock data
        setStats({
          totalUsers: 1247,
          totalQuizzes: 156,
          totalCertificates: 892,
          activeUsers: 234,
          completionRate: 78.5,
          averageScore: 82.3,
        })
        setRecentUsers([
          { id: "1", name: "Aline Uwimana", email: "aline.uwimana@student.rw", role: "student" },
          { id: "2", name: "Jean Baptiste", email: "jean.baptiste@student.rw", role: "student" },
          { id: "3", name: "Marie Claire", email: "marie.claire@student.rw", role: "student" },
        ])
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.role === "admin") {
      fetchAdminData()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <p className="text-gray-400">Loading admin dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <p className="text-gray-400">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-500/30">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage the Qouta learning platform</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-green-400 text-sm">+12% this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Quizzes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalQuizzes}</p>
                  <p className="text-green-400 text-sm">+8 this week</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Certificates Issued</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCertificates}</p>
                  <p className="text-green-400 text-sm">+45 today</p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
                  <p className="text-green-400 text-sm">+2.1% improvement</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                  Add New User
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-green-400" />
                      Recent Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUsers.map((dbUser) => (
                        <div
                          key={dbUser.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{dbUser.name}</p>
                            <p className="text-gray-400 text-sm">{dbUser.email}</p>
                          </div>
                          <Badge
                            className={
                              dbUser.role === "admin"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : dbUser.role === "teacher"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : "bg-green-500/20 text-green-400 border-green-500/30"
                            }
                          >
                            {dbUser.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Students</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.87)} (87%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Teachers</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.12)} (12%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Admins</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.01)} (1%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Level Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Primary (P1-P6)</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.4)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Lower Sec (S1-S3)</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.35)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Upper Sec (S4-S6)</span>
                        <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.25)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Content Management</h2>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0">
                    Add Quiz
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    Add Story
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Quiz Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Mathematics S2</p>
                          <p className="text-gray-400 text-sm">15 questions • 89% completion</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Physics S3</p>
                          <p className="text-gray-400 text-sm">20 questions • 76% completion</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">English P6</p>
                          <p className="text-gray-400 text-sm">12 questions • Draft</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Draft</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Stories Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">King Gihanga</p>
                          <p className="text-gray-400 text-sm">Biography • 1.2k views</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">The Wise Rabbit</p>
                          <p className="text-gray-400 text-sm">Folktale • 856 views</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Queen Nyirakigali</p>
                          <p className="text-gray-400 text-sm">Biography • Under review</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Review</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Quiz Completion Rate</span>
                        <span className="text-white font-semibold">{stats.completionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Average Score</span>
                        <span className="text-white font-semibold">{stats.averageScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Daily Active Users</span>
                        <span className="text-white font-semibold">{stats.activeUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Stories Read Today</span>
                        <span className="text-white font-semibold">127</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Subject Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Mathematics</span>
                        <span className="text-white font-semibold">87.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">English</span>
                        <span className="text-white font-semibold">84.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Science</span>
                        <span className="text-white font-semibold">79.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Kinyarwanda</span>
                        <span className="text-white font-semibold">91.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* System */}
          <TabsContent value="system">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">System Management</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Connection Status</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Storage Used</span>
                        <span className="text-white font-semibold">2.4 GB / 10 GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Last Backup</span>
                        <span className="text-white font-semibold">2 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-400" />
                      Rwanda Education Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-gray-400 mb-2">Configured Levels:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {levels.map((lvl) => (
                            <Badge key={lvl.name} className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {lvl.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    Update Settings
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Platform Name</span>
                        <span className="text-white font-semibold">Qouta</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Default Language</span>
                        <span className="text-white font-semibold">English</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Time Zone</span>
                        <span className="text-white font-semibold">CAT (UTC+2)</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                        Update Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Two-Factor Auth</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Session Timeout</span>
                        <span className="text-white font-semibold">24 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Password Policy</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Strong</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0">
                        Security Audit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}