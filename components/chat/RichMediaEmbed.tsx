"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, 
  Play, 
  FileText, 
  Image as ImageIcon, 
  Music,
  Video,
  Download,
  Eye,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface EmbedData {
  title?: string
  description?: string
  image?: string
  url: string
  type: "youtube" | "link" | "image" | "document" | "video" | "audio"
  duration?: string
  size?: string
  thumbnail?: string
}

interface RichMediaEmbedProps {
  url: string
  type?: "youtube" | "link" | "image" | "document" | "video" | "audio"
  className?: string
  compact?: boolean
  autoplay?: boolean
}

export const RichMediaEmbed: React.FC<RichMediaEmbedProps> = ({
  url,
  type,
  className = "",
  compact = false,
  autoplay = false
}) => {
  const [embedData, setEmbedData] = useState<EmbedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-detect type if not provided
  const detectedType = type || (() => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return "image"
    if (url.match(/\.(mp4|webm|ogg)$/i)) return "video"
    if (url.match(/\.(mp3|wav|ogg)$/i)) return "audio"
    if (url.match(/\.(pdf|doc|docx|txt)$/i)) return "document"
    return "link"
  })()

  // Fetch embed data
  useEffect(() => {
    const fetchEmbedData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (detectedType === "youtube") {
          const videoId = extractYouTubeVideoId(url)
          if (videoId) {
            const response = await fetch(
              `https://noembed.com/embed?url=${encodeURIComponent(url)}`
            )
            const data = await response.json()
            
            setEmbedData({
              title: data.title || "YouTube Video",
              description: data.description,
              image: data.thumbnail_url,
              url,
              type: "youtube",
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            })
          }
        } else if (detectedType === "link") {
          const response = await fetch(
            `https://noembed.com/embed?url=${encodeURIComponent(url)}`
          )
          const data = await response.json()
          
          setEmbedData({
            title: data.title || "Link Preview",
            description: data.description,
            image: data.thumbnail_url,
            url,
            type: "link"
          })
        } else {
          setEmbedData({
            url,
            type: detectedType as any
          })
        }
      } catch (err) {
        setError("Failed to load preview")
        console.error("Embed fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchEmbedData()
    }
  }, [url, detectedType])

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleDownload = () => {
    window.open(url, "_blank")
  }

  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("p-4 border-dashed", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ExternalLink className="w-4 h-4" />
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
            {url}
          </a>
        </div>
      </Card>
    )
  }

  // YouTube Embed
  if (detectedType === "youtube" && embedData) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        {!compact && (
          <div className="relative aspect-video bg-black">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(url)}?autoplay=1&rel=0`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={embedData.thumbnail}
                  alt={embedData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={handlePlay}
                    className="rounded-full w-16 h-16"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                {embedData.title}
              </h4>
              {embedData.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {embedData.description}
                </p>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              YouTube
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className="text-xs"
            >
              <Play className="w-3 h-3 mr-1" />
              {isPlaying ? "Playing" : "Play"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </a>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Image Embed
  if (detectedType === "image") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative group">
          <img
            src={url}
            alt="Shared image"
            className="w-full h-auto max-h-96 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(url, "_blank")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Size
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Video Embed
  if (detectedType === "video") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <video
          controls
          className="w-full max-h-96"
          preload="metadata"
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      </Card>
    )
  }

  // Audio Embed
  if (detectedType === "audio") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Audio Message</h4>
            <p className="text-xs text-muted-foreground">
              Click to play audio file
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <audio controls className="w-full mt-3">
          <source src={url} />
          Your browser does not support the audio tag.
        </audio>
      </Card>
    )
  }

  // Document Embed
  if (detectedType === "document") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Document</h4>
            <p className="text-xs text-muted-foreground">
              Click to view document
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    )
  }

  // Link Preview
  if (detectedType === "link" && embedData) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        {embedData.image && (
          <div className="h-32 overflow-hidden">
            <img
              src={embedData.image}
              alt={embedData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                {embedData.title}
              </h4>
              {embedData.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {embedData.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {new URL(embedData.url).hostname}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs"
            >
              <a href={embedData.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Fallback
  return (
    <Card className={cn("p-4 border-dashed", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <ExternalLink className="w-4 h-4" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
          {url}
        </a>
      </div>
    </Card>
  )
}
