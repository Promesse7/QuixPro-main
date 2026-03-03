"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  MessageSquare, 
  Code, 
  FileText,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Brain,
  Target
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AISuggestion {
  id: string
  type: "reply" | "question" | "action" | "resource" | "summary" | "translation" | "explanation"
  content: string
  context?: string
  confidence: number
  category: "general" | "technical" | "educational" | "collaboration" | "productivity"
  icon: React.ReactNode
  priority: "low" | "medium" | "high"
  metadata?: {
    source?: string
    relatedTopics?: string[]
    estimatedTime?: string
    difficulty?: "easy" | "medium" | "hard"
  }
}

interface AISuggestionsProps {
  message?: string
  context?: string
  onSuggestionSelect?: (suggestion: AISuggestion) => void
  onDismiss?: (suggestionId: string) => void
  className?: string
  maxSuggestions?: number
  categories?: string[]
  enabled?: boolean
  compact?: boolean
}

const suggestionCategories = {
  general: { icon: <MessageSquare className="w-4 h-4" />, color: "blue" },
  technical: { icon: <Code className="w-4 h-4" />, color: "green" },
  educational: { icon: <BookOpen className="w-4 h-4" />, color: "purple" },
  collaboration: { icon: <Users className="w-4 h-4" />, color: "orange" },
  productivity: { icon: <Zap className="w-4 h-4" />, color: "red" }
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  message = "",
  context = "",
  onSuggestionSelect,
  onDismiss,
  className = "",
  maxSuggestions = 5,
  categories = Object.keys(suggestionCategories),
  enabled = true,
  compact = false
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())

  // Generate AI suggestions based on context
  const generateSuggestions = useCallback(async (inputMessage: string, inputContext: string) => {
    setIsLoading(true)
    
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const generatedSuggestions: AISuggestion[] = []
      
      // Reply suggestions
      if (inputMessage.length > 0) {
        generatedSuggestions.push(
          {
            id: "reply-1",
            type: "reply",
            content: "That's an interesting point! Could you elaborate on that?",
            confidence: 0.9,
            category: "general",
            icon: <MessageSquare className="w-4 h-4" />,
            priority: "high"
          },
          {
            id: "reply-2", 
            type: "reply",
            content: "I understand what you're saying. Here's my perspective on this...",
            confidence: 0.85,
            category: "general",
            icon: <MessageSquare className="w-4 h-4" />,
            priority: "medium"
          }
        )
      }
      
      // Question suggestions
      if (inputContext.includes("question") || inputMessage.includes("?")) {
        generatedSuggestions.push(
          {
            id: "question-1",
            type: "question",
            content: "What specific aspect would you like me to clarify?",
            confidence: 0.95,
            category: "educational",
            icon: <Lightbulb className="w-4 h-4" />,
            priority: "high",
            metadata: {
              difficulty: "easy",
              estimatedTime: "2 min"
            }
          }
        )
      }
      
      // Action suggestions
      generatedSuggestions.push(
        {
          id: "action-1",
          type: "action",
          content: "Let me help you organize this into a structured plan",
          confidence: 0.8,
          category: "productivity",
          icon: <Target className="w-4 h-4" />,
          priority: "medium",
          metadata: {
            estimatedTime: "5 min"
          }
        },
        {
          id: "action-2",
          type: "action", 
          content: "I can create a summary of our discussion so far",
          confidence: 0.75,
          category: "productivity",
          icon: <FileText className="w-4 h-4" />,
          priority: "low"
        }
      )
      
      // Resource suggestions
      if (inputMessage.toLowerCase().includes("learn") || inputMessage.toLowerCase().includes("study")) {
        generatedSuggestions.push(
          {
            id: "resource-1",
            type: "resource",
            content: "Here are some relevant resources for this topic",
            confidence: 0.85,
            category: "educational",
            icon: <BookOpen className="w-4 h-4" />,
            priority: "medium",
            metadata: {
              source: "Educational Database",
              relatedTopics: ["learning", "study tips"],
              difficulty: "medium"
            }
          }
        )
      }
      
      // Technical suggestions
      if (inputMessage.toLowerCase().includes("code") || inputMessage.toLowerCase().includes("programming")) {
        generatedSuggestions.push(
          {
            id: "technical-1",
            type: "explanation",
            content: "Let me explain this technical concept in simpler terms",
            confidence: 0.9,
            category: "technical",
            icon: <Code className="w-4 h-4" />,
            priority: "high",
            metadata: {
              difficulty: "medium",
              estimatedTime: "3 min"
            }
          }
        )
      }
      
      // Collaboration suggestions
      generatedSuggestions.push(
        {
          id: "collaboration-1",
          type: "action",
          content: "Would you like me to help you collaborate with others on this?",
          confidence: 0.7,
          category: "collaboration",
          icon: <Users className="w-4 h-4" />,
          priority: "low"
        }
      )
      
      // Filter by categories and dismissed suggestions
      const filteredSuggestions = generatedSuggestions
        .filter(s => categories.includes(s.category))
        .filter(s => !dismissedSuggestions.has(s.id))
        .filter(s => selectedCategory ? s.category === selectedCategory : true)
        .sort((a, b) => {
          // Sort by priority first, then by confidence
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const aPriority = priorityOrder[a.priority]
          const bPriority = priorityOrder[b.priority]
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority
          }
          
          return b.confidence - a.confidence
        })
        .slice(0, maxSuggestions)
      
      setSuggestions(filteredSuggestions)
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [categories, dismissedSuggestions, selectedCategory, maxSuggestions])

  // Generate suggestions when message or context changes
  useEffect(() => {
    if (enabled && (message.length > 0 || context.length > 0)) {
      const timeout = setTimeout(() => {
        generateSuggestions(message, context)
      }, 500) // Debounce
      
      return () => clearTimeout(timeout)
    } else {
      setSuggestions([])
    }
  }, [message, context, enabled, generateSuggestions])

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AISuggestion) => {
    onSuggestionSelect?.(suggestion)
    
    // Track usage for learning
    console.log("AI suggestion selected:", suggestion.id, suggestion.type)
  }, [onSuggestionSelect])

  // Handle suggestion dismissal
  const handleDismiss = useCallback((suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]))
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    onDismiss?.(suggestionId)
  }, [onDismiss])

  // Get category icon and color
  const getCategoryInfo = useCallback((category: string) => {
    return suggestionCategories[category as keyof typeof suggestionCategories] || 
           { icon: <Bot className="w-4 h-4" />, color: "gray" }
  }, [])

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, AISuggestion[]> = {}
    suggestions.forEach(suggestion => {
      if (!groups[suggestion.category]) {
        groups[suggestion.category] = []
      }
      groups[suggestion.category].push(suggestion)
    })
    return groups
  }, [suggestions])

  if (!enabled) return null

  if (compact) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {suggestions.slice(0, 3).map((suggestion) => (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionSelect(suggestion)}
            className="text-xs h-7"
          >
            {suggestion.content.slice(0, 50)}...
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">AI Suggestions</h3>
          {isLoading && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
        </div>
        
        {/* Category filter */}
        <div className="flex gap-1">
          {categories.map(category => {
            const categoryInfo = getCategoryInfo(category)
            const isActive = selectedCategory === category
            const hasSuggestions = groupedSuggestions[category]?.length > 0
            
            return (
              <Button
                key={category}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(isActive ? null : category)}
                disabled={!hasSuggestions}
                className="h-6 px-2 text-xs"
              >
                {categoryInfo.icon}
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {groupedSuggestions[category]?.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-4">
                    {groupedSuggestions[category].length}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Generating suggestions...</span>
          </div>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No suggestions available</p>
          <p className="text-xs">Start typing to see AI suggestions</p>
        </div>
      ) : (
        <ScrollArea className="max-h-64">
          <div className="space-y-3">
            <AnimatePresence>
              {suggestions.map((suggestion) => {
                const categoryInfo = getCategoryInfo(suggestion.category)
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="group relative p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {categoryInfo.icon}
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", `border-${categoryInfo.color}-200 text-${categoryInfo.color}-700`)}
                            >
                              {suggestion.type}
                            </Badge>
                            {suggestion.priority === "high" && (
                              <Badge variant="secondary" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-foreground mb-2 line-clamp-2">
                            {suggestion.content}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{Math.round(suggestion.confidence * 100)}% confidence</span>
                            </div>
                            
                            {suggestion.metadata?.estimatedTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{suggestion.metadata.estimatedTime}</span>
                              </div>
                            )}
                            
                            {suggestion.metadata?.difficulty && (
                              <Badge variant="outline" className="text-xs">
                                {suggestion.metadata.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="h-6 w-6 p-0"
                          >
                            <Sparkles className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(suggestion.id)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </Card>
  )
}
