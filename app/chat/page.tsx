"use client"

import React from 'react'
import { MessageCircle, Search, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ChatIndexPage() {
  return (
    <div className="flex-1 items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-primary/5 hidden md:flex">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl text-center space-y-8"
      >
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/5">
          <MessageCircle className="w-10 h-10 text-primary" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight glow-text">
            Welcome to Quix Chat
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Connect with classmates, join study groups, and collaborate on your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
          <Link href="/chat/discover" className="group">
            <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-semibold text-sm flex items-center">
                Find People
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Search for students by school or level</p>
            </div>
          </Link>

          <Link href="/chat/groups" className="group">
            <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 text-left">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="font-semibold text-sm flex items-center">
                Join Groups
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Participate in public study groups</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
