"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Eye,
  Globe,
  User,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import Link from "next/link"

// Mock story data
const mockStoryData = {
  "1": {
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
    publishedDate: "2024-01-10",
    content: `
# The Legend of King Gihanga

Long ago, in the misty highlands of what would become Rwanda, there lived a young man named Gihanga. His name, meaning "the founder," would prove prophetic, for he was destined to establish one of Africa's most enduring kingdoms.

## The Early Years

Gihanga was born into a time of great upheaval. The land was divided among many small chieftains, each ruling their own territory with little regard for their neighbors. Wars were frequent, and the people lived in constant fear of raids and conflicts.

From an early age, Gihanga showed remarkable wisdom and leadership. He possessed a rare gift for bringing people together, settling disputes with fairness and compassion. His reputation for justice spread throughout the region, and people began to seek him out to resolve their conflicts.

## The Vision of Unity

One day, while meditating on a hilltop overlooking the beautiful valleys below, Gihanga had a vision. He saw the scattered tribes united under one rule, living in peace and prosperity. The land would be called "Rwanda," meaning "the land that stretches far," and it would be a place where all people could thrive.

Inspired by this vision, Gihanga began his mission to unite the tribes. He traveled from village to village, not as a conqueror, but as a peacemaker. He spoke of the benefits of unity: shared resources, mutual protection, and the strength that comes from working together.

## The Sacred Drum

Central to Gihanga's authority was the sacred drum, Karinga. Legend says that this drum was given to him by the gods themselves, and its sound could be heard across the entire kingdom. When Karinga was beaten, it called all the people to gather, and its rhythm became the heartbeat of the nation.

The drum was more than just an instrument; it was a symbol of the king's divine right to rule and the unity of all Rwandans. It was said that as long as Karinga remained in the hands of a righteous ruler, the kingdom would prosper.

## Building the Kingdom

Under Gihanga's leadership, Rwanda flourished. He established a system of governance that balanced central authority with local autonomy. Each region maintained its cultural traditions while contributing to the greater good of the kingdom.

Gihanga also introduced innovations in agriculture and cattle-raising that increased prosperity throughout the land. He encouraged trade between different regions and established markets where people could exchange goods and ideas.

## The Legacy

King Gihanga ruled for many years, and his reign was remembered as a golden age of peace and prosperity. When he finally passed away, he left behind not just a kingdom, but a legacy of unity, justice, and wisdom that would guide Rwanda for generations to come.

The story of Gihanga reminds us that true leadership comes not from force, but from the ability to inspire others to work together toward a common goal. His vision of a united Rwanda continues to inspire the nation to this day.

## Lessons from the Legend

The legend of King Gihanga teaches us several important lessons:

1. **Unity is Strength**: When people work together, they can achieve far more than they could alone.
2. **Leadership Through Service**: True leaders serve their people, not the other way around.
3. **Vision and Persistence**: Great achievements require both a clear vision and the determination to see it through.
4. **Respect for Tradition**: While embracing change, it's important to honor and preserve cultural heritage.

The story of Gihanga is more than just a tale from the past; it's a guide for building a better future. His example shows us that with wisdom, compassion, and determination, we can overcome any challenge and create a society where all people can thrive.
    `,
  },
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const story = mockStoryData[params.id as keyof typeof mockStoryData]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!story) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Story not found</h2>
          <p className="text-muted-foreground mb-4">The story you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/stories">Back to Stories</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getLanguageFlag = (language: string) => {
    return language === "rw" ? "🇷🇼" : "🇬🇧"
  }

  const getLanguageName = (language: string) => {
    return language === "rw" ? "Kinyarwanda" : "English"
  }

  const handleToggleAudio = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control text-to-speech
    if (!isPlaying) {
      // Start audio
      console.log("Starting audio playback")
    } else {
      // Stop audio
      console.log("Stopping audio playback")
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // In a real app, this would update the backend
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would update the backend
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={readingProgress} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <div className="glass-effect border-b border-border/50 sticky top-0 z-40 mt-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/stories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stories
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleToggleAudio} className={isPlaying ? "text-primary" : ""}>
                {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBookmark} className={isBookmarked ? "text-primary" : ""}>
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Story Header */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-3xl glow-text">{story.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>by {story.author}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{story.category}</Badge>
                  <Badge variant="outline">
                    {getLanguageFlag(story.language)} {getLanguageName(story.language)}
                  </Badge>
                  {story.featured && <Badge variant="default">Featured</Badge>}
                </div>

                <p className="text-lg text-muted-foreground">{story.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{story.readTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{story.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>Published {new Date(story.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${isLiked ? "text-red-400" : ""}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                      <span>{story.likes + (isLiked ? 1 : 0)}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Story Content */}
          <Card className="glass-effect border-border/50">
            <CardContent className="pt-8">
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: story.content
                      .split("\n")
                      .map((line) => {
                        if (line.startsWith("# ")) {
                          return `<h1 class="text-3xl font-bold glow-text mb-6 mt-8">${line.substring(2)}</h1>`
                        }
                        if (line.startsWith("## ")) {
                          return `<h2 class="text-2xl font-semibold glow-text mb-4 mt-6">${line.substring(3)}</h2>`
                        }
                        if (line.trim() === "") {
                          return "<br>"
                        }
                        if (line.match(/^\d+\./)) {
                          return `<p class="mb-4 ml-4">${line}</p>`
                        }
                        return `<p class="mb-4 text-pretty">${line}</p>`
                      })
                      .join(""),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Stories */}
          <Card className="glass-effect border-border/50 mt-8">
            <CardHeader>
              <CardTitle className="glow-text">More Stories Like This</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Queen Nyiramasuhuko's Wisdom</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The inspiring story of a wise queen who brought peace and prosperity...
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Biography
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/stories/3">Read</Link>
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold mb-2">The Brave Warrior Rwabugiri</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The epic tale of Rwanda's greatest warrior king and his legendary battles...
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Biography
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/stories/5">Read</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
