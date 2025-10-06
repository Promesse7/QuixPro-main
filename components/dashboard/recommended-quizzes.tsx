"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Star, Play, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Quiz } from "@/models"

// Fallback data in case API fails
const fallbackQuizzes = [
  {
    id: "rec-1",
    title: "Advanced Mathematics",
    subject: "Mathematics",
    level: "S3",
    description: "Algebra and geometry concepts for secondary level",
    questions: 20,
    duration: 25,
    difficulty: "Medium",
    rating: 4.7,
    reason: "Based on your strong math performance",
  },
  {
    id: "rec-2",
    title: "Rwandan Literature",
    subject: "Literature",
    level: "S3",
    description: "Classic and modern Rwandan literary works",
    questions: 15,
    duration: 20,
    difficulty: "Medium",
    rating: 4.5,
    reason: "Recommended for your level",
  },
  {
    id: "rec-3",
    title: "Environmental Science",
    subject: "Science",
    level: "S3",
    description: "Ecology and environmental conservation",
    questions: 18,
    duration: 22,
    difficulty: "Easy",
    rating: 4.6,
    reason: "New topic to explore",
  },
]

export function RecommendedQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendedQuizzes() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/quiz?limit=3');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommended quizzes');
        }
        
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } catch (err) {
        console.error('Error fetching recommended quizzes:', err);
        setError('Failed to load recommendations');
        // Use fallback data if API fails
        setQuizzes(fallbackQuizzes as Quiz[]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendedQuizzes();
  }, []);

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 glow-text">
              <Brain className="h-5 w-5" />
              <span>Recommended for You</span>
            </CardTitle>
            <CardDescription>Personalized quiz suggestions based on your progress</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/quiz">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <p className="text-center py-4">Loading recommendations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {(quizzes.length > 0 ? quizzes : fallbackQuizzes).map((quiz) => (
            <div key={quiz.id} className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold">{quiz.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{quiz.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Brain className="h-3 w-3" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.duration} min</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {quiz.subject}
                  </Badge>
                </div>
                <p className="text-xs text-primary mt-2">{quiz.reason}</p>
              </div>
              <Button size="sm" asChild className="glow-effect">
                <Link href={`/quiz/${quiz.id}`}>
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
