"use client"

import React from 'react'
import { MessageCircle, Search, Users, ArrowRight, Sparkles, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ChatIndexPage() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 md:p-12 bg-gradient-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full text-center space-y-12 relative z-10"
      >
        {/* Hero Icon */}
        <motion.div 
          className="relative mx-auto w-32 h-32 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[40px] blur-3xl animate-pulse" />
          <motion.div 
            className="relative w-full h-full rounded-[32px] bg-gradient-to-br from-primary via-primary/90 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 group cursor-pointer"
            whileHover={{ rotate: 12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <MessageCircle className="w-16 h-16 text-white transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
            <motion.div 
              className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full border-4 border-background shadow-xl flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Hero Text */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Smart Collaboration Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground/90 selection:bg-primary/30">
              Your Study{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Nexus
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Connect with peers, collaborate on projects, and master your subjects together in real-time.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/chat/discover" className="group">
            <motion.div 
              className="h-full p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col items-start text-left relative overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Search className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
              
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-xl flex items-center text-foreground/90 group-hover:text-primary transition-colors mb-3">
                  Find Study Peers
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Discover and connect with students across different schools, years, and study interests.
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 relative z-10">
                Start exploring
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          </Link>

          <Link href="/chat/groups" className="group">
            <motion.div 
              className="h-full p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col items-start text-left relative overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 relative z-10"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
              
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-xl flex items-center text-foreground/90 group-hover:text-primary transition-colors mb-3">
                  Public Lounges
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Join active subject-based study groups and collaborate with motivated learners.
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 relative z-10">
                Browse lounges
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground/90">50+</div>
            <div className="text-sm text-muted-foreground">Active Subjects</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground/90">1K+</div>
            <div className="text-sm text-muted-foreground">Study Partners</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground/90">24/7</div>
            <div className="text-sm text-muted-foreground">Live Support</div>
          </div>
        </motion.div>

        {/* Footer Badge */}
        <motion.div 
          className="pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              End-to-end encrypted learning
            </p>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
