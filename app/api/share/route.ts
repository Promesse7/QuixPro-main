import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import type { SharedContent } from "@/models/SharedContent"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { userId, type, data } = body || {}

		if (!userId || !type || !data) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		const db = await getDatabase()
		const sharedContentCol = db.collection("shared_content")

		const shareId = uuidv4()
		const doc: SharedContent = {
			shareId,
			userId,
			type,
			data,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			views: 0,
			clicks: 0,
		}

		const insert = await sharedContentCol.insertOne(doc as any)
		const base =
			process.env.NEXT_PUBLIC_BASE_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
		const shareUrl = `${base}/share/${shareId}`

		return NextResponse.json({ success: true, shareId, shareUrl, _id: insert.insertedId })
	} catch (e) {
		console.error("Share creation error:", e)
		return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const shareId = searchParams.get("shareId")
		if (!shareId) {
			return NextResponse.json({ error: "shareId is required" }, { status: 400 })
		}
		const db = await getDatabase()
		const col = db.collection("shared_content")
		const content = await col.findOne({ shareId })
		if (!content) {
			return NextResponse.json({ error: "Shared content not found" }, { status: 404 })
		}
		if (content.expiresAt && new Date() > new Date(content.expiresAt)) {
			return NextResponse.json({ error: "This share link has expired" }, { status: 410 })
		}
		await col.updateOne({ shareId }, { $inc: { views: 1 }, $set: { lastViewedAt: new Date() } })
		return NextResponse.json({ success: true, content })
	} catch (e) {
		console.error("Share retrieval error:", e)
		return NextResponse.json({ error: "Failed to retrieve shared content" }, { status: 500 })
	}
}
