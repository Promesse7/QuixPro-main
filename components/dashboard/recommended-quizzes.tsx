"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Star, Play, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Quiz } from "@/models"

interface QuizData {
	_id?: string
	id?: string
	title: string
	subject: string
	level: string
	description: string
	questions: any[] | number
	duration: number
	difficulty: string
	rating?: number
	reason?: string
}

// Fallback data in case API fails
const fallbackQuizzes = [
	{
		_id: "rec-1",
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
		_id: "rec-2",
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
		_id: "rec-3",
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
	const [quizzes, setQuizzes] = useState<QuizData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Function to get random 4 quizzes
	const getRandomQuizzes = (quizArray: QuizData[], count: number = 4): QuizData[] => {
		const shuffled = [...quizArray].sort(() => 0.5 - Math.random())
		return shuffled.slice(0, count)
	}

	useEffect(() => {
		async function fetchRecommendedQuizzes() {
			try {
				setIsLoading(true)
				// Fetch more quizzes to have a pool to randomize from
				const response = await fetch("/api/quiz?limit=20")

				if (!response.ok) {
					throw new Error("Failed to fetch recommended quizzes")
				}

				const data = await response.json()
				const allQuizzes = data.quizzes || []
				// Get 4 random quizzes from the fetched pool
				const randomQuizzes = getRandomQuizzes(allQuizzes.length > 0 ? allQuizzes : fallbackQuizzes as QuizData[])
				setQuizzes(randomQuizzes)
			} catch (err) {
				console.error("Error fetching recommended quizzes:", err)
				setError("Failed to load recommendations")
				// Use fallback data if API fails - get 4 random from fallback
				const randomFallback = getRandomQuizzes(fallbackQuizzes as QuizData[])
				setQuizzes(randomFallback)
			} finally {
				setIsLoading(false)
			}
		}

		fetchRecommendedQuizzes()
	}, [])

	return (
		<Card className="glass-effect border-border/50">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center space-x-2 glow-text">
							<Brain className="h-5 w-5" />
							<span>Recommended for You</span>
						</CardTitle>
						<CardDescription>
							Personalized quiz suggestions based on your progress
						</CardDescription>
					</div>
					<Button variant="ghost" size="sm">
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{quizzes.map((quiz) => (
							<Card key={quiz.id || quiz._id} className="p-0">
								<div className="flex flex-col h-full">
									<div className="p-4 flex-1">
										<div className="flex items-start gap-3">
											<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
												<Brain className="h-6 w-6 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold">{quiz.title}</h4>
												<p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
												<div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
													<div className="flex items-center gap-1"><Brain className="h-3 w-3" /> <span>{Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions || 0} questions</span></div>
													<div className="flex items-center gap-1"><Clock className="h-3 w-3" /> <span>{quiz.duration || 0} min</span></div>
													<Badge variant="outline" className="text-xs">{quiz.subject}</Badge>
												</div>
											</div>
										</div>
									</div>
									<div className="p-4 border-t">
										<Button size="sm" className="w-full">Start <Play className="ml-2 h-4 w-4" /></Button>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
