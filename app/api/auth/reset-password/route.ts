import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { sendEmail, generatePasswordResetConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
        }

        // Password validation
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        if (!passwordRegex.test(password)) {
            return NextResponse.json({ 
                error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" 
            }, { status: 400 })
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
                $set: { 
                    passwordHash,
                    passwordUpdatedAt: new Date(),
                },
                $unset: {
                    resetPasswordToken: "",
                    resetPasswordExpires: "",
                    resetPasswordRequested: "",
                },
            }
        )

        // Send confirmation email
        const emailResult = await sendEmail({
            to: user.email,
            subject: "Password Reset Successful - QuixPro",
            html: generatePasswordResetConfirmationEmail(user.name || user.email.split('@')[0])
        })

        if (!emailResult.success) {
            console.error("Failed to send confirmation email:", emailResult.error)
        }

        return NextResponse.json({ 
            message: "Password reset successful. You can now log in with your new password.",
            success: true 
        })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
