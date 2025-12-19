"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, Eye, Heart, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface DiscoverStoriesProps {
  stories: any[]
  loading: boolean
}

export default function DiscoverStories({ stories, loading }: DiscoverStoriesProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-black/20 to-transparent">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Inspiring Stories
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Learn from the journeys of African scientists, leaders, and innovators
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all group overflow-hidden h-full">
                  {/* Story Image/Preview */}
                  <div className="h-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/60" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-0">
                        {story.category || "Biography"}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                        {story.readingLevel || "All Levels"}
                      </Badge>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-3">
                      {story.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{story.readingTime || 5} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{story.views || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{story.likes || 0}</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-0 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500"
                    >
                      <Link href={`/stories/${story._id || story.id}`}>
                        Read Story
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-lg"
          >
            <Link href="/stories">
              View All Stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
