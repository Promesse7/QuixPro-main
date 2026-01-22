import { type NextRequest, NextResponse } from "next/server"
import MigrationManager from "@/lib/migration-manager"
import { requireFirebaseAuth } from "@/lib/firebase-middleware"

/**
 * GET /api/auth/migration-status
 * Returns migration statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await requireFirebaseAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can view migration stats
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const stats = await MigrationManager.getMigrationStats()

    return NextResponse.json({
      status: "success",
      data: {
        ...stats,
        migrationProgress: stats.totalUsers > 0 ? Math.round((stats.migratedUsers / stats.totalUsers) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("[v0] Migration status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
