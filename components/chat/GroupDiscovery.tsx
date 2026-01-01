"use client"

import React, { useState, useEffect } from 'react'
import { Search, Users, Hash, Loader2, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Group {
    id: string
    name: string
    description: string
    subject: string
    level: string
    memberCount: number
    isJoined?: boolean
}

export default function GroupDiscovery() {
    const [groups, setGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [selectedLevel, setSelectedLevel] = useState('all')

    // Mock subjects (replace with dynamic later if needed)
    const subjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'History', 'Geography', 'Computer Science']
    const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6']

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (selectedSubject !== 'all') params.append('subject', selectedSubject)
                if (selectedLevel !== 'all') params.append('level', selectedLevel)

                const response = await fetch(`/api/groups/public?${params}`)
                if (response.ok) {
                    const data = await response.json()
                    setGroups(data.groups || [])
                } else {
                    // Mock fallback for now 
                    setGroups([])
                }
            } catch (error) {
                console.error('Failed to fetch groups', error)
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchGroups, 300)
        return () => clearTimeout(timeout)
    }, [searchTerm, selectedSubject, selectedLevel])

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Discover Groups</h1>
                    <p className="text-muted-foreground mt-1">Join public study groups and communities.</p>
                </div>
                <Button asChild className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 rounded-xl px-5 h-11">
                    <Link href="/chat/groups/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-border/50 h-11"
                    />
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[180px] h-11 bg-background border-border/50">
                        <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[150px] h-11 bg-background border-border/50">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-40 rounded-2xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-24 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-medium">No groups found</h3>
                    <p className="text-muted-foreground mt-2">Try changing your filters or create a new group.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={group.id}
                            className="group relative bg-card hover:bg-card/80 border border-border/50 hover:border-primary/30 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">
                                    {group.subject}
                                </Badge>
                            </div>

                            <div className="mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Hash className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 truncate pr-16">{group.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{group.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Users className="w-3.5 h-3.5 mr-1" />
                                    {group.memberCount} members
                                </div>
                                <Button size="sm" variant="ghost" className="hover:bg-primary hover:text-primary-foreground group-hover:translate-x-1 transition-all">
                                    Join Group <ArrowRight className="w-3 h-3 ml-1.5" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
