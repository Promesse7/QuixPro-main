"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Star, Play, ChevronRight, ArrowRight } from "lucide-react"
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
			{isLoading ? (
				<div className="col-span-full py-20 text-center bg-card/40 backdrop-blur-md rounded-3xl border border-dashed border-border/50">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
						<Brain className="w-5 h-5 animate-pulse" />
						<span className="text-sm font-bold uppercase tracking-wider">Loading recommendations...</span>
					</div>
				</div>
			) : error ? (
				<div className="col-span-full py-10 text-center text-destructive font-medium">{error}</div>
			) : (
				quizzes.map((quiz) => (
					<Card key={quiz.id || quiz._id} className="group overflow-hidden border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 rounded-[2rem]">
						<div className="flex flex-col h-full relative">
							<div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
								<div className="bg-primary/20 backdrop-blur-md p-2 rounded-xl">
									<ArrowRight className="w-5 h-5 text-primary" />
								</div>
							</div>

							<div className="p-8 flex-1">
								<div className="flex flex-col gap-6">
									<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
										<Brain className="h-8 w-8 text-white" />
									</div>
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1 rounded-lg">
												{quiz.subject}
											</Badge>
											<Badge variant="outline" className="text-muted-foreground border-border/50 font-medium px-3 py-1 rounded-lg italic">
												{quiz.difficulty || 'Medium'}
											</Badge>
										</div>
										<h4 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
											{quiz.title}
										</h4>
										<p className="text-muted-foreground text-base leading-relaxed line-clamp-2 italic font-medium">
											{quiz.description}
										</p>

										<div className="flex items-center gap-6 pt-4 border-t border-border/30">
											<div className="flex items-center gap-2 group-hover:text-primary transition-colors">
												<div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10">
													<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
												</div>
												<span className="text-sm font-bold">{Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions || 0} Quests</span>
											</div>
											<div className="flex items-center gap-2 group-hover:text-primary transition-colors">
												<div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10">
													<Clock className="h-4 w-4 text-primary" />
												</div>
												<span className="text-sm font-bold lowercase">{quiz.duration || 0} min</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="p-6 pt-0">
								<Button className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
									Start Quiz
									<Play className="ml-2 h-5 w-5 fill-current" />
								</Button>
							</div>
						</div>
					</Card>
				))
			)}
		</div>
	)
}
