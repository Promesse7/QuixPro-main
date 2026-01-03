"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Play, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

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
	unit?: {
		_id: string
		name: string
	}
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
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						{quizzes.map((quiz) => (
							<Card key={quiz.id || quiz._id} className="group relative overflow-hidden border-border/40 hover:border-primary/40 transition-all hover:shadow-md bg-card/40 backdrop-blur-sm">
								<div className="flex flex-col h-full">
									<div className="p-3.5 flex-1">
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
												<Brain className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors">{quiz.title}</h4>
												{quiz.unit?.name && (
													<p className="text-[11px] text-muted-foreground mt-0.5 truncate">{quiz.unit.name}</p>
												)}
												<p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{quiz.description}</p>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-2 mt-4">
											<div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
												<Brain className="h-3 w-3" />
												<span>{Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions || 0} Qs</span>
											</div>
											<div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
												<Clock className="h-3 w-3" />
												<span>{quiz.duration || 0}m</span>
											</div>
											<Badge variant="secondary" className="text-[10px] px-2 py-0 h-4 font-normal bg-primary/5 text-primary-foreground/80 border-none truncate max-w-[80px]">
												{quiz.subject}
											</Badge>
										</div>
									</div>
									<div className="p-3 border-t border-border/40 bg-muted/5">
										<Button size="sm" className="w-full h-8 text-xs font-medium rounded-lg shadow-sm hover:shadow-primary/20">
											Start Quiz <Play className="ml-1.5 h-3 w-3" />
										</Button>
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
