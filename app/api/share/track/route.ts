import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
	try {
		const { shareId } = await request.json()
		if (!shareId) {
			return NextResponse.json({ error: "shareId is required" }, { status: 400 })
		}
		const db = await getDatabase()
		await db.collection("shared_content").updateOne({ shareId }, { $inc: { clicks: 1 } })
		return NextResponse.json({ success: true })
	} catch (e) {
		console.error("Track click error:", e)
		return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
	}
}


