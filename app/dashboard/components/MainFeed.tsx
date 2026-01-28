"use client"

import { useState } from "react"
import { PostComposer } from "./PostComposer"
import { FeedCard } from "./FeedCard"
import { ActivityCard } from "./ActivityCard"
import { QuizCard } from "./QuizCard"
import { GroupPreview } from "./GroupPreview"
import { Badges } from "@/components/dashboard/Badges"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MainFeedProps {
  dashboardData: any
}

export function MainFeed({ dashboardData }: MainFeedProps) {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <main className="flex-1 lg:ml-72 lg:mr-96 max-w-4xl">
      <ScrollArea className="h-screen">
        <div className="p-6 space-y-6">
          {/* Feed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border/50 rounded-xl p-1">
              <TabsTrigger value="feed" className="rounded-lg">
                Your Feed
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-lg">
                Recent
              </TabsTrigger>
              <TabsTrigger value="trending" className="rounded-lg">
                Trending
              </TabsTrigger>
              <TabsTrigger value="following" className="rounded-lg">
                Following
              </TabsTrigger>
            </TabsList>

            {/* Post Composer */}
            <div className="mt-6">
              <PostComposer />
            </div>

            {/* Your Feed Tab */}
            <TabsContent value="feed" className="space-y-4 mt-6">
              {/* Badges Component */}
              {dashboardData?.badges && (
                <Badges 
                  badges={dashboardData.badges} 
                  earnedCount={dashboardData.earnedBadgesCount || 0}
                />
              )}

              {/* Quiz Activity Cards */}
              {dashboardData?.recommendedQuizzes?.slice(0, 2).map((quiz: any) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}

              {/* Activity Feed */}
              {dashboardData?.activities?.map((activity: any, idx: number) => (
                <ActivityCard key={idx} activity={activity} />
              ))}

              {/* Certificates */}
              {dashboardData?.achievements?.slice(0, 1).map((achievement: any) => (
                <FeedCard
                  key={achievement.id}
                  type="certificate"
                  title={achievement.title}
                  description={achievement.description}
                  author="Platform"
                  timestamp="Just now"
                  icon="award"
                />
              ))}

              {/* Group Updates */}
              <GroupPreview groupName="Physics S3" members={24} newPosts={3} />
            </TabsContent>

            {/* Recent Tab */}
            <TabsContent value="recent" className="space-y-4 mt-6">
              <p className="text-muted-foreground text-center py-8">Recent activity coming soon</p>
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending" className="space-y-4 mt-6">
              <p className="text-muted-foreground text-center py-8">Trending content coming soon</p>
            </TabsContent>

            {/* Following Tab */}
            <TabsContent value="following" className="space-y-4 mt-6">
              <p className="text-muted-foreground text-center py-8">Follow users to see their activity</p>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </main>
  )
}
