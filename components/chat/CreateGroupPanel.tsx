"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, X, Check, Loader2, Plus, Hash, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { database } from '@/lib/firebaseClient'
import { ref, push, set, serverTimestamp } from 'firebase/database'
import { getCurrentUser } from '@/lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface User {
    _id: string
    name: string
    email: string
    image?: string
    school?: string
    level?: string
}

export function CreateGroupPanel() {
    const router = useRouter()
    const currentUser = getCurrentUser()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [subject, setSubject] = useState('')
    const [level, setLevel] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const subjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'History', 'Geography', 'Computer Science']
    const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6']

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults([])
            return
        }

        const searchUsers = async () => {
            setIsSearching(true)
            try {
                const response = await fetch(`/api/users/search?search=${encodeURIComponent(searchTerm)}&limit=10`)
                if (response.ok) {
                    const data = await response.json()
                    // Filter out current user and already selected users
                    const filtered = data.users.filter((u: User) =>
                        u._id !== currentUser?.id && !selectedUsers.some(s => s._id === u._id)
                    )
                    setSearchResults(filtered)
                }
            } catch (err) {
                console.error('Search error:', err)
            } finally {
                setIsSearching(false)
            }
        }

        const timeoutId = setTimeout(searchUsers, 500)
        return () => clearTimeout(timeoutId)
    }, [searchTerm, currentUser?.id, selectedUsers])

    const toggleUserSelection = (user: User) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))
        } else {
            setSelectedUsers([...selectedUsers, user])
            setSearchTerm('')
            setSearchResults([])
        }
    }

    const handleCreateGroup = async () => {
        if (!name || !subject || !level || !currentUser) {
            setError('Please fill in all required fields.')
            return
        }

        setIsCreating(true)
        setError(null)

        try {
            const groupsRef = ref(database, 'groups')
            const newGroupRef = push(groupsRef)
            const groupId = newGroupRef.key

            const members: Record<string, any> = {
                [currentUser.id]: {
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    role: 'owner',
                    joinedAt: serverTimestamp()
                }
            }

            selectedUsers.forEach(user => {
                members[user._id] = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: 'member',
                    joinedAt: serverTimestamp()
                }
            })

            const groupData = {
                id: groupId,
                name,
                description,
                subject,
                level,
                createdBy: currentUser.id,
                createdAt: serverTimestamp(),
                memberCount: selectedUsers.length + 1,
                isPublic: true,
                members,
                lastMessage: {
                    text: `Group ${name} created`,
                    senderName: 'System',
                    timestamp: serverTimestamp()
                }
            }

            await set(newGroupRef, groupData)

            router.push(`/chat/groups/${groupId}`)
        } catch (err) {
            console.error('Group creation error:', err)
            setError('Failed to create group. Please try again.')
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="flex-1 h-full bg-background flex flex-col max-w-4xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-card/30 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl h-10 w-10">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Create Study Group</h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Start a new collaboration</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {/* Basic Info */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">General Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/70 ml-1">Group Name *</label>
                            <Input
                                placeholder="e.g. S3 Advanced Calculus"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/70 ml-1">Subject *</label>
                                <Select value={subject} onValueChange={setSubject}>
                                    <SelectTrigger className="h-11 rounded-xl border-border/50 bg-muted/20">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/70 ml-1">Level *</label>
                                <Select value={level} onValueChange={setLevel}>
                                    <SelectTrigger className="h-11 rounded-xl border-border/50 bg-muted/20">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Levels</SelectItem>
                                        {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/70 ml-1">Description (Optional)</label>
                        <Textarea
                            placeholder="What is this group about? What are the study goals?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all"
                        />
                    </div>
                </section>

                {/* User Selection */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Add Members</h2>
                            {selectedUsers.length > 0 && <span className="text-[10px] text-blue-500 font-bold">{selectedUsers.length} selected</span>}
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-10 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all"
                        />
                    </div>

                    <AnimatePresence>
                        {isSearching && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-card border border-border/50 rounded-2xl p-2 space-y-1 shadow-xl"
                            >
                                {searchResults.map(user => (
                                    <button
                                        key={user._id}
                                        onClick={() => toggleUserSelection(user)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                                    >
                                        <Avatar className="h-10 w-10 border border-border/50">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold tracking-tight truncate">{user.name}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-all">
                                            <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Selected Users Chips */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                        <AnimatePresence>
                            {selectedUsers.map(user => (
                                <motion.div
                                    key={user._id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="px-3 py-1.5 h-auto rounded-full gap-2 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                                    >
                                        <Avatar className="h-5 w-5 border-none">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback className="bg-blue-500/20 text-blue-600 text-[8px] font-bold">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-[11px] font-bold text-blue-700">{user.name}</span>
                                        <button
                                            onClick={() => toggleUserSelection(user)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {error && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                        <X className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border bg-card/10 backdrop-blur-md sticky bottom-0 z-20">
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="h-12 flex-1 rounded-xl text-sm font-bold uppercase tracking-widest"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateGroup}
                        disabled={isCreating || !name || !subject}
                        className="h-12 flex-[2] rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            'Establish Group'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
