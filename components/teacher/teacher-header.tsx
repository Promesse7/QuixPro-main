"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/auth"
import { Brain, Settings, LogOut, User, Bell, GraduationCap } from "lucide-react"
import Link from "next/link"

interface TeacherHeaderProps {
  teacher: {
    name: string
    email: string
    subject: string
    school: string
    avatar: string
  }
}

export function TeacherHeader({ teacher }: TeacherHeaderProps) {
  return (
    <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/teacher" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary glow-text" />
            <span className="text-2xl font-bold glow-text">Qouta</span>
            <Badge variant="secondary" className="ml-2">
              Teacher
            </Badge>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/teacher" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/teacher/quiz" className="text-muted-foreground hover:text-primary transition-colors">
              My Quizzes
            </Link>
            <Link href="/quix-editor" className="text-muted-foreground hover:text-primary transition-colors">
              Quix Editor
            </Link>
            <Link href="/teacher/classes" className="text-muted-foreground hover:text-primary transition-colors">
              Classes
            </Link>
            <Link href="/teacher/analytics" className="text-muted-foreground hover:text-primary transition-colors">
              Analytics
            </Link>
            <Link href="/teacher/resources" className="text-muted-foreground hover:text-primary transition-colors">
              Resources
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-effect" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{teacher.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{teacher.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {teacher.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{teacher.school}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/teacher/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/teacher/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
