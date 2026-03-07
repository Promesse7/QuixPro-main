# 🚀 QuixPro Quick Start Guide

## 🎯 Ready to Start Fresh?

Here's your complete renewal plan with step-by-step instructions to recreate QuixPro better than before!

---

## 📋 Step 1: Create New Project

```bash
# Create fresh Next.js project
npx create-next-app@latest quixpro-renewed --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to new project
cd quixpro-renewed

# Open in VS Code
code .
```

## 📦 Step 2: Install Dependencies

```bash
# Core dependencies
npm install @next-auth/mongodb @next-auth/prisma-adapter
npm install mongoose bcryptjs jsonwebtoken
npm install prisma @prisma/client

# UI dependencies  
npm install @radix-ui/react-slot @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install @radix-ui/react-select @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react framer-motion

# Forms & validation
npm install react-hook-form @hookform/resolvers zod
npm install @hookform/devtools

# Charts & analytics
npm install recharts date-fns
npm install @tanstack/react-query

# Real-time & communication
npm install socket.io socket.io-client
npm install webrtc-adapter

# Development tools
npm install -D @types/node @types/bcryptjs
npm install -D prettier eslint-config-prettier
```

## ⚙️ Step 3: Configure Project

### **package.json scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🗃️ Step 4: Database Setup

### **prisma/schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  email         String    @unique
  name          String
  avatar        String?
  role          Role      @default(STUDENT)
  level         String?
  school        String?
  points        Int       @default(0)
  streak        Int       @default(0)
  preferences    Json?
  gamification  Json?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Quiz {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  description   String
  subject       String
  difficulty    Difficulty @default(EASY)
  duration      Int        // in minutes
  questions     Question[]
  createdBy     String    @map("createdBy") @db.ObjectId
  isPublic      Boolean   @default(false)
  tags          String[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Question {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        QuestionType
  text        String
  options     String[]
  correctAnswer String
  explanation String?
  points      Int       @default(1)
  media       Media?
  order       Int
}

model QuizAttempt {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  userId          String    @map("userId") @db.ObjectId
  quizId          String    @map("quizId") @db.ObjectId
  score           Int
  totalQuestions   Int
  correctAnswers   Int
  timeSpent       Int       // in seconds
  completedAt      DateTime   @default(now())
  feedback        Json?
}

enum Role {
  STUDENT
  TEACHER  
  ADMIN
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  FILL_BLANK
  ESSAY
}
```

## 🔐 Step 5: Authentication Setup

### **src/lib/auth.ts**
```typescript
import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './mongodb'

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Add your authentication logic here
        const user = await authenticateUser(credentials.email, credentials.password)
        return user ? user : null
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      return {
        ...token,
        role: user.role,
        level: user.level,
      }
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
  },
}

export default NextAuth(authOptions)
```

## 🎨 Step 6: UI Components Setup

### **src/components/ui/button.tsx**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
```

## 📊 Step 7: Core Pages Setup

### **src/app/dashboard/page.tsx**
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to QuixPro</h1>
        <p className="text-muted-foreground">Your learning journey starts here</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
            <CardDescription>Your achievement score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Streak</CardTitle>
            <CardDescription>Days of continuous learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quizzes Completed</CardTitle>
            <CardDescription>Your progress track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Level</CardTitle>
            <CardDescription>Current learning level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beginner</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Button size="lg" className="w-full">
          Start Your First Quiz
        </Button>
      </div>
    </div>
  )
}
```

## 🚀 Step 8: Run Development

```bash
# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 🎯 Step 9: First Features to Build

### **Priority Order:**
1. **Authentication** - Login/signup pages
2. **Dashboard** - User overview and stats
3. **Quiz System** - Take quizzes feature
4. **User Profile** - Profile management
5. **Results Page** - View quiz results
6. **Leaderboard** - Competition features

### **Quick Implementation:**
```bash
# Create auth pages
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/signup

# Create API routes
mkdir -p src/app/api/auth
mkdir -p src/app/api/users
mkdir -p src/app/api/quizzes

# Start building
npm run dev
```

## 🔧 Environment Setup

### **.env.local**
```env
# Database
DATABASE_URL="mongodb://localhost:27017/quixpro"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@quixpro.rw"

# File upload (optional)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

## 📱 Mobile App Considerations

### **PWA Setup**
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: true,
  buildExcludes: [/middleware-manifest.json$/],
})

module.exports = withPWA({
  // Your Next.js config
})
```

## 🎓 Rwanda-Specific Features

### **Curriculum Alignment**
```typescript
interface RwandaCurriculum {
  primary: {
    subjects: ['Mathematics', 'English', 'Kinyarwanda', 'Science', 'Social Studies'];
    levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  };
  lowerSecondary: {
    subjects: ['Mathematics', 'English', 'Kinyarwanda', 'Physics', 'Chemistry', 'Biology'];
    levels: ['S1', 'S2', 'S3'];
  };
  upperSecondary: {
    subjects: ['Mathematics', 'English', 'Kinyarwanda', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History'];
    levels: ['S4', 'S5', 'S6'];
  };
}
```

## 🚀 Deploy to Production

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

---

## 🎉 You're Ready!

**What you have:**
- ✅ Complete project structure
- ✅ Modern tech stack configured
- ✅ Authentication system ready
- ✅ Database schema defined
- ✅ UI components set up
- ✅ Development environment ready

**Next steps:**
1. Follow the step-by-step guide above
2. Build features in priority order
3. Test thoroughly
4. Deploy to production

**You're now ready to build an amazing educational platform for Rwanda! 🇷🇼🎓**

---

## 📞 Need Help?

- Check `PROJECT_ARCHITECTURE.md` for detailed technical specs
- Review `PROJECT_RENEWAL.md` for comprehensive planning
- Follow the step-by-step instructions in this guide
- Start with the basics and add complexity gradually

**Happy coding! 🚀**
