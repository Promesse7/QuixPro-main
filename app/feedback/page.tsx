"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Star, TrendingUp, BarChart3, ThumbsUp, Send, Eye, CheckCircle } from "lucide-react"

// Mock feedback data
const mockQuizFeedback = [
  {
    id: "1",
    quizTitle: "Rwanda History & Culture",
    subject: "Social Studies",
    difficulty: "Easy",
    rating: 4,
    feedback: "Great quiz! The questions about traditional ceremonies were very informative.",
    clarity: 5,
    relevance: 4,
    date: "2024-01-15",
    helpful: 12,
    status: "reviewed",
  },
  {
    id: "2",
    quizTitle: "Advanced Calculus",
    subject: "Mathematics",
    difficulty: "Expert",
    rating: 3,
    feedback: "Some questions were unclear. The integration problems need better explanations.",
    clarity: 2,
    relevance: 4,
    date: "2024-01-14",
    helpful: 8,
    status: "pending",
  },
]

const mockStoryFeedback = [
  {
    id: "1",
    storyTitle: "The Legend of Gihanga",
    category: "Folklore",
    rating: 5,
    feedback: "Beautiful storytelling! This helped me understand Rwandan culture better.",
    engagement: 5,
    accuracy: 5,
    date: "2024-01-13",
    helpful: 15,
    status: "reviewed",
  },
]

const mockAnalytics = {
  totalFeedback: 156,
  averageRating: 4.2,
  improvementRate: 23,
  topIssues: [
    { issue: "Question Clarity", count: 45, percentage: 29 },
    { issue: "Difficulty Level", count: 32, percentage: 21 },
    { issue: "Content Accuracy", count: 28, percentage: 18 },
    { issue: "Technical Issues", count: 25, percentage: 16 },
  ],
}

export default function FeedbackPage() {
  const [newFeedback, setNewFeedback] = useState({
    type: "",
    item: "",
    rating: 0,
    clarity: 0,
    relevance: 0,
    feedback: "",
  })

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log("Submitting feedback:", newFeedback)
    // Reset form
    setNewFeedback({
      type: "",
      item: "",
      rating: 0,
      clarity: 0,
      relevance: 0,
      feedback: "",
    })
  }

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
            } ${readonly ? "cursor-default" : ""}`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold glow-text mb-4">Student Feedback Loop</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us improve Qouta by sharing your thoughts on quizzes and stories. Your feedback directly influences
              content quality and learning experience.
            </p>
          </div>

          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-effect mb-8">
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              <TabsTrigger value="history">My Feedback</TabsTrigger>
              <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Share Your Experience</CardTitle>
                  <CardDescription>Rate and review quizzes or stories to help improve content quality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      value={newFeedback.type}
                      onValueChange={(value) => setNewFeedback({ ...newFeedback, type: value })}
                    >
                      <SelectTrigger className="glass-effect">
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newFeedback.item}
                      onValueChange={(value) => setNewFeedback({ ...newFeedback, item: value })}
                    >
                      <SelectTrigger className="glass-effect">
                        <SelectValue placeholder="Select Item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rwanda-history">Rwanda History & Culture</SelectItem>
                        <SelectItem value="advanced-calculus">Advanced Calculus</SelectItem>
                        <SelectItem value="gihanga-legend">The Legend of Gihanga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Overall Rating</label>
                      <StarRating
                        rating={newFeedback.rating}
                        onRatingChange={(rating) => setNewFeedback({ ...newFeedback, rating })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Clarity</label>
                        <StarRating
                          rating={newFeedback.clarity}
                          onRatingChange={(clarity) => setNewFeedback({ ...newFeedback, clarity })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Relevance</label>
                        <StarRating
                          rating={newFeedback.relevance}
                          onRatingChange={(relevance) => setNewFeedback({ ...newFeedback, relevance })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Detailed Feedback</label>
                      <Textarea
                        placeholder="Share your thoughts, suggestions, or report issues..."
                        value={newFeedback.feedback}
                        onChange={(e) => setNewFeedback({ ...newFeedback, feedback: e.target.value })}
                        className="glass-effect min-h-[120px]"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitFeedback}
                      className="w-full glow-effect"
                      disabled={!newFeedback.type || !newFeedback.item || !newFeedback.rating}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold glow-text">Quiz Feedback</h3>
                {mockQuizFeedback.map((feedback) => (
                  <Card key={feedback.id} className="feature-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{feedback.quizTitle}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{feedback.subject}</Badge>
                            <Badge variant="outline">{feedback.difficulty}</Badge>
                            <Badge
                              variant={feedback.status === "reviewed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {feedback.status === "reviewed" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Eye className="h-3 w-3 mr-1" />
                              )}
                              {feedback.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={feedback.rating} readonly />
                          <p className="text-xs text-muted-foreground mt-1">{feedback.date}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{feedback.feedback}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>Clarity: {feedback.clarity}/5</span>
                          <span>Relevance: {feedback.relevance}/5</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{feedback.helpful} found helpful</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <h3 className="text-xl font-semibold glow-text mt-8">Story Feedback</h3>
                {mockStoryFeedback.map((feedback) => (
                  <Card key={feedback.id} className="feature-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{feedback.storyTitle}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{feedback.category}</Badge>
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {feedback.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={feedback.rating} readonly />
                          <p className="text-xs text-muted-foreground mt-1">{feedback.date}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{feedback.feedback}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>Engagement: {feedback.engagement}/5</span>
                          <span>Accuracy: {feedback.accuracy}/5</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{feedback.helpful} found helpful</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Overview Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold glow-text">{mockAnalytics.totalFeedback}</div>
                    <div className="text-sm text-muted-foreground">Total Feedback</div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold glow-text">{mockAnalytics.averageRating}</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold glow-text">{mockAnalytics.improvementRate}%</div>
                    <div className="text-sm text-muted-foreground">Content Improved</div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Issues */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="glow-text">Top Feedback Categories</CardTitle>
                  <CardDescription>Most common issues reported by students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAnalytics.topIssues.map((issue, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{issue.issue}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{issue.count} reports</span>
                          <span className="text-sm font-medium">{issue.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={issue.percentage} className="h-2 glow-effect" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Impact Message */}
              <Card className="glass-effect border-border/50">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold glow-text mb-2">Your Voice Matters</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Thanks to student feedback like yours, we've improved over 150 pieces of content this month. Your
                    insights help create better learning experiences for all Rwandan students.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-accent/20 rounded-lg">
                      <div className="font-bold text-lg glow-text">45</div>
                      <div className="text-muted-foreground">Questions Clarified</div>
                    </div>
                    <div className="p-4 bg-accent/20 rounded-lg">
                      <div className="font-bold text-lg glow-text">23</div>
                      <div className="text-muted-foreground">Stories Enhanced</div>
                    </div>
                    <div className="p-4 bg-accent/20 rounded-lg">
                      <div className="font-bold text-lg glow-text">12</div>
                      <div className="text-muted-foreground">New Features Added</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
