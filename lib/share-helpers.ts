export async function createQuizShare(userId: string, quizResult: any) {
	const base =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

	const response = await fetch(`${base}/api/share`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			userId,
			type: "quiz",
			data: {
				quizTitle: quizResult.quizTitle,
				courseName: quizResult.courseName,
				level: quizResult.level,
				score: quizResult.score,
				difficulty: quizResult.difficulty,
				completedAt: quizResult.completedAt,
				userName: quizResult.userName,
				userAvatar: quizResult.userAvatar,
				customMessage: quizResult.customMessage || `I just scored ${quizResult.score}% on ${quizResult.quizTitle}! 🎯`,
			},
		}),
	})

	if (!response.ok) {
		throw new Error("Failed to create share link")
	}

	return await response.json()
}

export async function createBadgeShare(userId: string, badge: any) {
	const base =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

	const response = await fetch(`${base}/api/share`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			userId,
			type: "badge",
			data: {
				badgeName: badge.name,
				badgeIcon: badge.icon,
				badgeColor: badge.color,
				badgeDescription: badge.description,
				earnedAt: badge.earnedAt,
				userName: badge.userName,
				userAvatar: badge.userAvatar,
				customMessage: badge.customMessage || `I just earned the ${badge.name} badge on Quix! 🏆`,
			},
		}),
	})

	if (!response.ok) {
		throw new Error("Failed to create share link")
	}

	return await response.json()
}
