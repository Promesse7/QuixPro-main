import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-db"
import { UserMigrationManager } from "@/lib/userMigration"
import { emailToUniqueId } from "@/lib/identifiers"
import { firebaseAdmin } from "@/lib/services/firebase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Login attempt for email: ${email}`)
    
    let user: any = null;
    try {
      user = await authenticateUser(email, password);
      console.log('Authentication result:', user ? 'User found' : 'Invalid credentials');
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: "Authentication service unavailable" }, 
        { status: 503 }
      );
    }

    if (!user) {
      console.log('Trying user migration for email:', email);
      try {
        const newUser = await UserMigrationManager.getUserByEmail(email);
        console.log('Migration check result:', newUser ? 'User found in migration' : 'User not found in migration');
        
        if (newUser) {
          user = {
            uniqueUserId: newUser.uniqueUserId || emailToUniqueId(email),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            profile: newUser.profile,
          }
        }
      } catch (migrationError) {
        console.error('User migration check failed:', migrationError);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Always enforce standardized uniqueUserId
    user.uniqueUserId = emailToUniqueId(user.email)

    // Generate Firebase custom token
    const token = await firebaseAdmin.createCustomToken(user.uniqueUserId, {
      email: user.email,
      role: user.role,
      name: user.name
    })

    return NextResponse.json({ user, token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
