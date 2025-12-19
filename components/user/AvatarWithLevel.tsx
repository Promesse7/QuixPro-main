'use client'

import React from 'react'
import Image from 'next/image'

type Props = {
	size?: number
	src?: string
	alt?: string
	totalXP?: number
	className?: string
}

function getLevelFromXP(xp: number | undefined) {
	const total = xp || 0
	if (total >= 2500) return { label: 'Expert', color: 'from-yellow-400 via-amber-400 to-yellow-500 animate-pulse' }
	if (total >= 1000) return { label: 'Achiever', color: 'from-purple-500 to-fuchsia-600' }
	if (total >= 500) return { label: 'Challenger', color: 'from-green-500 to-emerald-600' }
	if (total >= 100) return { label: 'Learner', color: 'from-blue-500 to-cyan-500' }
	return { label: 'Beginner', color: 'from-gray-400 to-gray-500' }
}

export default function AvatarWithLevel({ size = 56, src, alt = 'User avatar', totalXP = 0, className = '' }: Props) {
	const ring = getLevelFromXP(totalXP)
	const ringSize = size + 8
	return (
		<div className={`relative inline-flex items-center justify-center ${className}`} title={`${ring.label} • ${totalXP} XP`}>
			<div
				className={`rounded-full p-[2px] bg-gradient-to-r ${ring.color}`}
				style={{ width: ringSize, height: ringSize }}
			>
				<div className="rounded-full bg-background w-full h-full flex items-center justify-center overflow-hidden">
					{src ? (
						<Image src={src} alt={alt} width={size} height={size} className="rounded-full object-cover" />
					) : (
						<div
							className="rounded-full bg-muted flex items-center justify-center text-muted-foreground"
							style={{ width: size, height: size }}
						>
							<span className="text-sm font-semibold">U</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
