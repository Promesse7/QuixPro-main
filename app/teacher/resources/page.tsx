"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, Plus, ArrowLeft, FileText, Video, Link as LinkIcon, Search } from "lucide-react"
import Link from "next/link"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { getCurrentUser } from "@/lib/auth"
import { getBaseUrl } from "@/lib/getBaseUrl"

interface Resource {
  id: string
  title: string
  type: 'document' | 'video' | 'link' | 'quiz'
  description: string
  subject: string
  level: string
  downloadUrl?: string
  url?: string
  createdAt: string
}

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      fetchResources()
    }
  }, [])

  const fetchResources = async () => {
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/teacher/resources?teacherId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      case 'link': return <LinkIcon className="h-5 w-5" />
      case 'quiz': return <BookOpen className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'video': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'link': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'quiz': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <AppBreadcrumb items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Teacher Dashboard', href: '/teacher' },
              { label: 'Resources' }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">Teaching Resources</h1>
                <p className="text-muted-foreground">Access and manage your teaching materials</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="glow-effect">
                  <Link href="/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button asChild className="glow-effect">
                  <Link href="/teacher/resources/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="glass-effect border-border/50 hover:glow-effect transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg glow-text mb-2">{resource.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.level}
                          </Badge>
                          <Badge className={`text-xs ${getTypeColor(resource.type)}`}>
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        {resource.downloadUrl ? (
                          <a href={resource.downloadUrl} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        ) : resource.url ? (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Open
                          </a>
                        ) : (
                          <Link href={resource.url || '#'}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'No Resources Found' : 'No Resources Yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms.'
                    : 'Start building your resource library with teaching materials.'
                  }
                </p>
                {!searchTerm && (
                  <Button asChild className="glow-effect">
                    <Link href="/teacher/resources/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Resource
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
