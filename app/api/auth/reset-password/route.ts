import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
        }

        const db = await getDatabase()
        const usersCol = db.collection("users")

        const user = await usersCol.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 12)

        await usersCol.updateOne(
            { _id: user._id },
            {
                $set: { passwordHash },
                $unset: {
                    resetPasswordToken: "",
                    resetPasswordExpires: "",
                },
            }
        )

        return NextResponse.json({ message: "Password reset successful" })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
