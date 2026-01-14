"use client"

import React, { useState, useEffect } from 'react'
import { Search, Users, School, GraduationCap, MessageCircle, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  school: string
  level: string
  role: string
  isOnline?: boolean
  lastActive?: string
}

interface FilterOptions {
  schools: Array<{ value: string; label: string }>
  levels: Array<{ value: string; label: string }>
}

interface UserSearchProps {
  onUserSelect?: (user: User) => void
  className?: string
}

export default function UserSearch({ onUserSelect, className }: UserSearchProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filters, setFilters] = useState<FilterOptions>({ schools: [], levels: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [pagination, setPagination] = useState({ total: 0, limit: 20, skip: 0, hasMore: false })
  const [loadingMore, setLoadingMore] = useState(false)

  // Load filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await fetch('/api/users/filters')
        if (!response.ok) {
          // Silently fail or use default empty filters, non-critical
          setFilters({ schools: [], levels: [] })
          return
        }
        const data = await response.json()
        setFilters(data || { schools: [], levels: [] })
      } catch (error) {
        console.error('Failed to load filters:', error)
        setFilters({ schools: [], levels: [] })
      }
    }
    loadFilters()
  }, [])

  // Load users
  const loadUsers = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setUsers([])
        setPagination(prev => ({ ...prev, skip: 0 }))
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        search: searchTerm,
        school: selectedSchool,
        level: selectedLevel,
        limit: '20',
        skip: reset ? '0' : pagination.skip.toString()
      })

      const response = await fetch(`/api/users/search?${params}`)

      if (!response.ok) {
        // Fallback for mocked environment if API fails
        if (process.env.NODE_ENV === 'development') {
          // Mock data fallback
          setUsers([])
          setPagination({ total: 0, limit: 20, skip: 0, hasMore: false })
          setLoading(false)
          setLoadingMore(false)
          return
        }
        throw new Error('Failed to load users')
      }

      const data = await response.json()

      if (reset) {
        setUsers(data.users || [])
      } else {
        setUsers(prev => [...prev, ...(data.users || [])])
      }

      setPagination({
        total: data.pagination?.total || 0,
        limit: data.pagination?.limit || 20,
        skip: data.pagination?.skip || 0,
        hasMore: data.pagination?.hasMore || false
      })
    } catch (error) {
      console.error('Failed to load users:', error)
      if (reset) {
        setUsers([])
        setPagination({ total: 0, limit: 20, skip: 0, hasMore: false })
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Initial load and search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers(true)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedSchool, selectedLevel])

  const handleLoadMore = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.limit }))
    loadUsers(false)
  }

  const handleUserClick = (user: User) => {
    onUserSelect?.(user)
  }

  return (
    <div className={cn("space-y-6 max-w-4xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:ring-primary/20 transition-all h-12"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-[160px] h-12 bg-background/50 border-border/50">
                <School className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {filters.schools.map(school => (
                  <SelectItem key={school.value} value={school.value}>
                    {school.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[140px] h-12 bg-background/50 border-border/50">
                <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {filters.levels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-muted/20 animate-pulse rounded-xl border border-border/40" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-xl border border-border/40 border-dashed">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No students found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting tour filters to find more people.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="group relative p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{user.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-background/50">{user.level}</Badge>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{user.school}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 hover:bg-primary hover:text-primary-foreground">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {pagination.hasMore && !loading && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-background/50 backdrop-blur-sm"
            >
              {loadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Load More
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
