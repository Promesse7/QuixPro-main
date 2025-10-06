"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Heart, Eye, Volume2, Loader2 } from "lucide-react"
import Link from "next/link"

// Fallback stories data in case API fails
const fallbackStories = [
  {
    id: "1",
    title: "The Legend of King Gihanga",
    author: "Traditional Rwandan Folklore",
    category: "Biography",
    language: "en",
    readTime: 8,
    description: "Discover the legendary founder of Rwanda and his remarkable journey to establish the kingdom.",
    tags: ["History", "Royalty", "Foundation"],
    likes: 245,
    views: 1200,
    featured: true,
    coverImage: "/story-gihanga.jpg",
  },
  {
    id: "2",
    title: "Ubwiyunge bw'Inyambo",
    author: "Amakuru y'u Rwanda",
    category: "Folktale",
    language: "rw",
    readTime: 6,
    description: "Inkuru y'inyambo zitangaje kandi zifite ubwoba mu mateka y'u Rwanda.",
    tags: ["Inyambo", "Ubwoba", "Gakondo"],
    likes: 189,
    views: 890,
    featured: false,
    coverImage: "/story-inyambo.jpg",
  },
  {
    id: "3",
    title: "Queen Nyiramasuhuko's Wisdom",
    author: "Historical Chronicles",
    category: "Biography",
    language: "en",
    readTime: 12,
    description: "The inspiring story of a wise queen who brought peace and prosperity to her people.",
    tags: ["Leadership", "Wisdom", "Peace"],
    likes: 312,
    views: 1450,
    featured: true,
    coverImage: "/story-queen.jpg",
  },
  {
    id: "4",
    title: "Inkuru y'Ubwoba bw'Ishyamba",
    author: "Sebasoni Ntahobari",
    category: "Folktale",
    language: "rw",
    readTime: 10,
    description: "Inkuru y'ubwoba ishimishije yerekeye inyamaswa z'ishyamba n'abantu.",
    tags: ["Ishyamba", "Inyamaswa", "Ubwoba"],
    likes: 156,
    views: 720,
    featured: false,
    coverImage: "/story-forest.jpg",
  },
  {
    id: "5",
    title: "The Brave Warrior Rwabugiri",
    author: "Rwandan Historical Society",
    category: "Biography",
    language: "en",
    readTime: 15,
    description: "The epic tale of Rwanda's greatest warrior king and his legendary battles.",
    tags: ["Warrior", "Battles", "Courage"],
    likes: 428,
    views: 2100,
    featured: true,
    coverImage: "/story-warrior.jpg",
  },
  {
    id: "6",
    title: "Umugani w'Impyisi n'Intama",
    author: "Imigani Gakondo",
    category: "Folktale",
    language: "rw",
    readTime: 5,
    description: "Umugani ushimishije w'impyisi n'intama ukubiyemo amagambo menshi.",
    tags: ["Impyisi", "Intama", "Ubwenge"],
    likes: 203,
    views: 980,
    featured: false,
    coverImage: "/story-animals.jpg",
  },
]

// Interface for story data
interface Story {
  id: string;
  title: string;
  author?: string;
  category: string;
  language?: string;
  readTime?: number;
  readingTime?: number;
  description: string;
  content?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  featured?: boolean;
  coverImage?: string;
  imageUrl?: string;
  readingLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function StoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [showFeatured, setShowFeatured] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/stories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories')
        }
        
        const data = await response.json()
        
        // Transform API data to match the expected format
        const formattedStories = data.stories.map((story: any) => ({
          id: story.id,
          title: story.title,
          author: story.author || 'Unknown Author',
          category: story.category || 'General',
          language: story.language || 'en',
          readTime: story.readingTime || 5,
          description: story.description,
          tags: story.tags || [],
          likes: story.likes || Math.floor(Math.random() * 300) + 50,
          views: story.views || Math.floor(Math.random() * 1500) + 200,
          featured: story.featured || false,
          coverImage: story.imageUrl || '/placeholder.jpg',
        }))
        
        setStories(formattedStories)
      } catch (err) {
        console.error('Error fetching stories:', err)
        setError('Failed to load stories. Using demo data instead.')
        setStories(fallbackStories)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStories()
  }, [])

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.author && story.author.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || (story.category && story.category.toLowerCase() === selectedCategory)
    const matchesLanguage = selectedLanguage === "all" || (story.language && story.language === selectedLanguage)
    const matchesFeatured = !showFeatured || story.featured

    return matchesSearch && matchesCategory && matchesLanguage && matchesFeatured
  })

  const getLanguageFlag = (language: string) => {
    return language === "rw" ? "🇷🇼" : "🇬🇧"
  }

  const getLanguageName = (language: string) => {
    return language === "rw" ? "Kinyarwanda" : "English"
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary glow-text" />
              <h1 className="text-4xl font-bold glow-text">Stories & Biographies</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore Rwanda's rich cultural heritage through engaging stories, folktales, and biographies
            </p>
          </div>

          {/* Filters */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Stories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-effect border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                      <SelectItem value="folktale">Folktale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="glass-effect border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="rw">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter</label>
                  <Button
                    variant={showFeatured ? "default" : "outline"}
                    onClick={() => setShowFeatured(!showFeatured)}
                    className="w-full glass-effect"
                  >
                    Featured Only
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Stories */}
          {!showFeatured && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold glow-text mb-6">Featured Stories</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStories
                  .filter((story) => story.featured)
                  .slice(0, 3)
                  .map((story) => (
                    <Card
                      key={story.id}
                      className="glass-effect border-border/50 hover:glow-effect transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/60" />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg glow-text line-clamp-2">{story.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{story.category}</Badge>
                              <Badge variant="outline" className="text-xs">
                                {getLanguageFlag(story.language)} {getLanguageName(story.language)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-3">{story.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{story.readTime} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{story.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{story.likes}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {story.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button asChild className="flex-1 glow-effect">
                            <Link href={`/stories/${story.id}`}>Read Story</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="glass-effect bg-transparent">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Stories */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold glow-text">{showFeatured ? "Featured Stories" : "All Stories"}</h2>
              <Badge variant="secondary">{filteredStories.length} stories</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStories.map((story) => (
                <Card
                  key={story.id}
                  className="glass-effect border-border/50 hover:glow-effect transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg glow-text line-clamp-2">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">by {story.author}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {story.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getLanguageFlag(story.language)}
                          </Badge>
                          {story.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">{story.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{story.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{story.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{story.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild size="sm" className="flex-1 glow-effect">
                        <Link href={`/stories/${story.id}`}>Read</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="glass-effect bg-transparent">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find more stories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
