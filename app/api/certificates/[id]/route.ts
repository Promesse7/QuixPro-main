import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const certificatesCol = db.collection("certificates")
    const cert = await certificatesCol.findOne({ _id: new ObjectId(params.id) })
    if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ certificate: cert })
  } catch (error) {
    console.error("Get certificate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
