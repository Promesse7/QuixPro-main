import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const result = await db.collection("results").findOne({ _id: new ObjectId(params.id) })
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ result })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


