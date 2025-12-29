"use client"

import React, { useState, useEffect } from 'react'
import { Search, Users, School, GraduationCap, MessageCircle, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

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
          throw new Error('Failed to load filters')
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
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users')
      }

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
      // Set empty state on error
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
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedSchool, selectedLevel])

  const handleLoadMore = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.limit }))
    loadUsers(false)
  }

  const handleUserClick = (user: User) => {
    onUserSelect?.(user)
  }

  const startChat = (user: User, e: React.MouseEvent) => {
    e.stopPropagation()
    onUserSelect?.(user)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Users to Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <School className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Schools" />
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
            </div>
            <div className="flex-1">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Levels" />
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
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {searchTerm || selectedSchool !== 'all' || selectedLevel !== 'all' 
              ? `Search Results (${pagination.total})`
              : `Top Users (${pagination.total})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {user.school}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.level}
                        </Badge>
                        {user.role && (
                          <Badge variant="default" className="text-xs">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => startChat(user, e)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {pagination.hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2"
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Load More Users
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
