'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  GraduationCap,
  MapPin,
  BookOpen,
  UserPlus,
  Loader2
} from 'lucide-react'
import PeerCard from './PeerCard'
import { usePeerSearch } from '@/hooks/usePeerDiscovery'

interface User {
  id: string
  name: string
  email: string
  level?: string
  school?: string
  avatar?: string
}

interface SearchFilters {
  level?: string
  school?: string
  course?: string
  onlyAvailable?: boolean
}

interface PeerSearchProps {
  onConnect?: (userId: string) => void
  onViewProfile?: (userId: string) => void
  showFilters?: boolean
  placeholder?: string
  maxResults?: number
}

export default function PeerSearch({
  onConnect,
  onViewProfile,
  showFilters = true,
  placeholder = "Search by name or email...",
  maxResults = 20
}: PeerSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<User[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  const { search, loading } = usePeerSearch()

  const handleSearch = async () => {
    if (!query.trim()) return

    setHasSearched(true)
    try {
      const searchResults = await search(query, filters)
      setResults(searchResults.slice(0, maxResults))
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  const updateFilter = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button onClick={handleSearch} disabled={!query.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>

            {showFilters && (
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Search Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Education Level</label>
                  <Select
                    value={filters.level || ''}
                    onValueChange={(value) => updateFilter('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">School</label>
                  <Select
                    value={filters.school || ''}
                    onValueChange={(value) => updateFilter('school', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Schools" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Schools</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="online">Online Learning</SelectItem>
                      <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select
                    value={filters.course || ''}
                    onValueChange={(value) => updateFilter('course', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Select
                    value={filters.onlyAvailable ? 'true' : ''}
                    onValueChange={(value) => updateFilter('onlyAvailable', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Users</SelectItem>
                      <SelectItem value="true">Available Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {filters.level && (
                    <Badge variant="secondary" className="gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Level: {filters.level}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('level', '')}
                      />
                    </Badge>
                  )}
                  {filters.school && (
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      School: {filters.school}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('school', '')}
                      />
                    </Badge>
                  )}
                  {filters.course && (
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      Course: {filters.course}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('course', '')}
                      />
                    </Badge>
                  )}
                  {filters.onlyAvailable && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      Available Only
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('onlyAvailable', false)}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Search Results {results.length > 0 && `(${results.length})`}
            </h3>
            {results.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Found {results.length} peer{results.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {results.length === 0 && !loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Check spelling and try different keywords</p>
                  <p>• Use fewer or different filters</p>
                  <p>• Try searching by email instead of name</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {results.map((user) => (
                <PeerCard
                  key={user.id}
                  user={user}
                  onConnect={onConnect}
                  onViewProfile={onViewProfile}
                  compact
                />
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Quick Search Suggestions */}
      {!hasSearched && !query && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Search by:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Full name or partial name</li>
                  <li>• Email address</li>
                  <li>• School name</li>
                  <li>• Course or subject</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Filter results by:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Education level</li>
                  <li>• School or institution</li>
                  <li>• Course of study</li>
                  <li>• Availability status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
