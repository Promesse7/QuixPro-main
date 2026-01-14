import { ObjectId } from "mongodb"

export interface SharedContent {
	_id?: ObjectId
	shareId: string
	userId: string
	type: "quiz" | "badge" | "certificate" | "story"
	data: {
		quizTitle?: string
		courseName?: string
		level?: string
		score?: number
		difficulty?: string
		completedAt?: Date
		badgeName?: string
		badgeIcon?: string
		badgeColor?: string
		badgeDescription?: string
		earnedAt?: Date
		certificateTitle?: string
		certificateCourse?: string
		certificateLevel?: string
		certificateDate?: Date
		userName?: string
		userAvatar?: string
		customMessage?: string
	}
	createdAt: Date
	expiresAt?: Date
	views: number
	clicks: number
}
