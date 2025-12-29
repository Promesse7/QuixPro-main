"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppBreadcrumb } from '@/components/app/AppBreadcrumb'
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Search, 
  Settings, 
  Bell, 
  Activity,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  UserPlus,
  Video,
  Phone,
  BookOpen
} from 'lucide-react'

export default function ChatIndexPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Chat' }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">Quix Chat Hub</h1>
                <p className="text-muted-foreground">Connect, collaborate, and communicate</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="glow-effect">
                  <Link href="/dashboard">
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border/50">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="rounded-b-none"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'direct' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('direct')}
              className="rounded-b-none"
            >
              Direct Messages
            </Button>
            <Button
              variant={activeTab === 'classrooms' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('classrooms')}
              className="rounded-b-none"
            >
              Classrooms
            </Button>
            <Button
              variant={activeTab === 'groups' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('groups')}
              className="rounded-b-none"
            >
              Study Groups
            </Button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-effect border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/chat/discover">
                    <CardContent className="p-4 text-center">
                      <UserPlus className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-semibold mb-1">Discover Users</h3>
                      <p className="text-sm text-muted-foreground">Find and connect</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="glass-effect border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/chat/direct">
                    <CardContent className="p-4 text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-semibold mb-1">Direct Chat</h3>
                      <p className="text-sm text-muted-foreground">1-on-1 conversations</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="glass-effect border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/chat/classrooms">
                    <CardContent className="p-4 text-center">
                      <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <h3 className="font-semibold mb-1">Classrooms</h3>
                      <p className="text-sm text-muted-foreground">Teacher-led groups</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="glass-effect border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/chat/groups">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <h3 className="font-semibold mb-1">Study Groups</h3>
                      <p className="text-sm text-muted-foreground">Student groups</p>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">New message in Direct Chat</p>
                          <p className="text-xs text-muted-foreground">John Doe • 2 min ago</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">New classroom assignment</p>
                          <p className="text-xs text-muted-foreground">Mathematics S3 • 1 hour ago</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Study group created</p>
                          <p className="text-xs text-muted-foreground">Chemistry Revision • 3 hours ago</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                        <p className="text-2xl font-bold glow-text">12</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Classrooms</p>
                        <p className="text-2xl font-bold glow-text">5</p>
                      </div>
                      <GraduationCap className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Study Groups</p>
                        <p className="text-2xl font-bold glow-text">8</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                        <p className="text-2xl font-bold glow-text">24</p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'direct' && (
            <div className="space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Direct Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Start a Direct Chat</h3>
                    <p className="text-muted-foreground mb-6">
                      Find users and start 1-on-1 conversations
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild className="glow-effect">
                        <Link href="/chat/discover">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Discover Users
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/chat/direct">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          My Conversations
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Classroom Chats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Teacher-Led Classrooms</h3>
                    <p className="text-muted-foreground mb-6">
                      Join your classroom discussions and get updates from teachers
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild className="glow-effect">
                        <Link href="/chat/classrooms">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Browse Classrooms
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Study Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Study Together</h3>
                    <p className="text-muted-foreground mb-6">
                      Create or join study groups for collaborative learning
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild className="glow-effect">
                        <Link href="/groups">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Group
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/chat/groups">
                          <Users className="h-4 w-4 mr-2" />
                          Browse Groups
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
