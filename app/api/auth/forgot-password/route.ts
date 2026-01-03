import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import crypto from "crypto"
import { sendEmail, generatePasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        const db = await getDatabase()
        const usersCol = db.collection("users")

        const user = await usersCol.findOne({ email: email.toLowerCase() })

        if (!user) {
            // For security, do not reveal if user does not exist
            return NextResponse.json({ 
                message: "If an account exists, a reset link has been sent to your email address",
                success: true 
            })
        }

        // Check if there's already a recent reset request (rate limiting)
        const recentReset = user.resetPasswordExpires && 
            user.resetPasswordExpires > new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        
        if (recentReset) {
            return NextResponse.json({ 
                message: "A reset link was recently sent. Please check your email or wait before requesting another.",
                success: true 
            })
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000) // 1 hour

        await usersCol.updateOne(
            { _id: user._id },
            {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordExpires: expires,
                    resetPasswordRequested: new Date(),
                },
            }
        )

        // Generate reset URL
        const resetUrl = `${request.nextUrl.origin}/auth/reset-password?token=${token}`

        // Send email
        const emailResult = await sendEmail({
            to: user.email,
            subject: "Reset Your QuixPro Password",
            html: generatePasswordResetEmail(resetUrl, user.name || user.email.split('@')[0])
        })

        if (!emailResult.success) {
            console.error("Failed to send reset email:", emailResult.error)
            // Fallback to console logging for development
            console.log("==========================================")
            console.log("PASSWORD RESET LINK FOR:", user.email)
            console.log(resetUrl)
            console.log("==========================================")
        }

        return NextResponse.json({ 
            message: "If an account exists, a reset link has been sent to your email address",
            success: true 
        })
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
