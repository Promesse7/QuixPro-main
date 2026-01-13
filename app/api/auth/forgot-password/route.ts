import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const db = await getDatabase()
        const usersCol = db.collection("users")

        const user = await usersCol.findOne({ email: email.toLowerCase() })

        if (!user) {
            // For security, do not reveal if user does not exist
            return NextResponse.json({ message: "If an account exists, a reset link has been sent" })
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000) // 1 hour

        await usersCol.updateOne(
            { _id: user._id },
            {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordExpires: expires,
                },
            }
        )

        // Simulate sending email
        // In a real app, use nodemailer or an email service
        const resetUrl = `${request.nextUrl.origin}/auth/reset-password?token=${token}`

        console.log("==========================================")
        console.log("PASSWORD RESET LINK FOR:", email)
        console.log(resetUrl)
        console.log("==========================================")

        return NextResponse.json({ message: "Reset link sent" })
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
