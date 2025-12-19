'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, CheckCircle, Download } from 'lucide-react'

interface ShareAchievementModalProps {
	isOpen: boolean
	onClose: () => void
	achievement: {
		icon?: string
		title?: string
		subtitle?: string
		details?: string
		message?: string
		shareUrl?: string
	}
}

export default function ShareAchievementModal({
	isOpen,
	onClose,
	achievement,
}: ShareAchievementModalProps) {
	const [copied, setCopied] = useState(false)
	const shareUrl = achievement?.shareUrl || ''

	const handleCopyLink = () => {
		if (!shareUrl) return
		navigator.clipboard.writeText(shareUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleShareWhatsApp = () => {
		if (!shareUrl) return
		const text = encodeURIComponent(`${achievement?.message || 'Check out my achievement on Quix!'}\n\n${shareUrl}`)
		window.open(`https://wa.me/?text=${text}`, '_blank')
	}

	const handleShareTwitter = () => {
		if (!shareUrl) return
		const text = encodeURIComponent(achievement?.message || 'Just achieved something amazing on Quix!')
		window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank')
	}

	const handleShareLinkedIn = () => {
		if (!shareUrl) return
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
	}

	if (!isOpen) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold text-white">Share Your Achievement! 🎉</h2>
								<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
									<X className="w-5 h-5 text-white" />
								</button>
							</div>
							<p className="text-white/80">Let your friends know about your success!</p>
						</div>

						<div className="p-6 bg-white/5">
							<div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30 mb-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center text-2xl">
										{achievement?.icon || '🏆'}
									</div>
									<div className="flex-1">
										<h3 className="text-white font-bold">{achievement?.title || 'Amazing Achievement!'}</h3>
										<p className="text-white/70 text-sm">{achievement?.subtitle || ''}</p>
									</div>
								</div>
								{achievement?.details && <div className="text-white/80 text-sm">{achievement.details}</div>}
							</div>

							<div className="mb-6">
								<label className="block text-white/70 text-sm font-medium mb-2">Share Link</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={shareUrl}
										readOnly
										className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
									/>
									<button
										onClick={handleCopyLink}
										className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 text-white font-medium"
									>
										{copied ? (
											<>
												<CheckCircle className="w-4 h-4" />
												Copied!
											</>
										) : (
											<>
												<Copy className="w-4 h-4" />
												Copy
											</>
										)}
									</button>
								</div>
							</div>

							<div className="space-y-3">
								<p className="text-white/70 text-sm font-medium mb-3">Share on Social Media</p>
								<button
									onClick={handleShareWhatsApp}
									className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
								>
									<span className="text-white font-medium group-hover:text-green-300">Share on WhatsApp</span>
								</button>
								<button
									onClick={handleShareTwitter}
									className="w-full bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
								>
									<span className="text-white font-medium group-hover:text-blue-300">Share on X (Twitter)</span>
								</button>
								<button
									onClick={handleShareLinkedIn}
									className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors group"
								>
									<span className="text-white font-medium group-hover:text-blue-400">Share on LinkedIn</span>
								</button>
							</div>

							<div className="mt-4 pt-4 border-t border-white/10">
								<button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors text-white">
									<Download className="w-5 h-5" />
									Download as Image
								</button>
							</div>
						</div>

						<div className="p-6 bg-black/20 border-t border-white/10">
							<p className="text-white/60 text-xs text-center">Share your success and inspire others to learn! 🚀</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
