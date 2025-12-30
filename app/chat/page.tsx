"use client"

import React from 'react'
import { MessageCircle, Search, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ChatIndexPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background via-muted/20 to-primary/5 min-h-0 overflow-y-auto">
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

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none italic bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Quix Chat
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
            Connect with classmates, join study groups, and collaborate on your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/chat/discover" className="group">
            <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all hover:shadow-2xl hover:-translate-y-1 text-left shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base flex items-center mb-1">
                Find People
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground leading-snug">Search for students by school or level</p>
            </div>
          </Link>

          <Link href="/chat/groups" className="group">
            <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all hover:shadow-2xl hover:-translate-y-1 text-left shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base flex items-center mb-1">
                Join Groups
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground leading-snug">Participate in public study groups</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
