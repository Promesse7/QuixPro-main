"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Moon,
  Sun,
  Layout,
  Settings,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  Grid,
  Columns,
  Eye,
  EyeOff,
  Zap,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatLayoutConfig {
  layout: "default" | "compact" | "focused" | "split" | "grid" | "columns"
  theme: "light" | "dark" | "auto" | "system"
  fontSize: "small" | "medium" | "large" | "extra-large"
  sidebarWidth: number
  messageSpacing: "compact" | "normal" | "relaxed"
  showAvatars: boolean
  showTimestamps: boolean
  showReactions: boolean
  showThreads: boolean
  enableAnimations: boolean
  enableSounds: boolean
  autoTheme: boolean
  compactMode: boolean
  focusMode: boolean
}

interface AdaptiveChatLayoutProps {
  children: React.ReactNode
  className?: string
  onLayoutChange?: (config: ChatLayoutConfig) => void
  defaultConfig?: Partial<ChatLayoutConfig>
}

const defaultConfig: ChatLayoutConfig = {
  layout: "default",
  theme: "auto",
  fontSize: "medium",
  sidebarWidth: 320,
  messageSpacing: "normal",
  showAvatars: true,
  showTimestamps: true,
  showReactions: true,
  showThreads: true,
  enableAnimations: true,
  enableSounds: false,
  autoTheme: true,
  compactMode: false,
  focusMode: false
}

export const AdaptiveChatLayout: React.FC<AdaptiveChatLayoutProps> = ({
  children,
  className = "",
  onLayoutChange,
  defaultConfig = {}
}) => {
  const { theme, setTheme } = useTheme()
  const [config, setConfig] = useState<ChatLayoutConfig>({ ...defaultConfig, ...defaultConfig } as ChatLayoutConfig)
  const [showSettings, setShowSettings] = useState(false)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType("mobile")
      else if (width < 1024) setDeviceType("tablet")
      else setDeviceType("desktop")
    }

    detectDevice()
    window.addEventListener("resize", detectDevice)
    return () => window.removeEventListener("resize", detectDevice)
  }, [])

  // Auto-adjust layout based on device type
  useEffect(() => {
    if (config.autoTheme) {
      const hour = new Date().getHours()
      const isDarkTime = hour >= 18 || hour < 6
      setTheme(isDarkTime ? "dark" : "light")
    }
  }, [config.autoTheme, setTheme])

  // Auto-adjust layout for mobile
  useEffect(() => {
    if (deviceType === "mobile" && !config.compactMode) {
      updateConfig({ layout: "compact", compactMode: true })
    } else if (deviceType === "desktop" && config.compactMode) {
      updateConfig({ layout: "default", compactMode: false })
    }
  }, [deviceType, config.compactMode])

  const updateConfig = useCallback((updates: Partial<ChatLayoutConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onLayoutChange?.(newConfig)
  }, [config, onLayoutChange])

  // Layout classes based on config
  const layoutClasses = useMemo(() => {
    const classes = []

    // Layout type
    switch (config.layout) {
      case "compact":
        classes.push("max-w-2xl mx-auto")
        break
      case "focused":
        classes.push("max-w-4xl mx-auto")
        break
      case "split":
        classes.push("grid grid-cols-2 gap-4")
        break
      case "grid":
        classes.push("grid grid-cols-3 gap-4")
        break
      case "columns":
        classes.push("flex gap-6")
        break
      default:
        classes.push("")
    }

    // Font size
    switch (config.fontSize) {
      case "small":
        classes.push("text-sm")
        break
      case "large":
        classes.push("text-lg")
        break
      case "extra-large":
        classes.push("text-xl")
        break
      default:
        classes.push("text-base")
    }

    // Message spacing
    switch (config.messageSpacing) {
      case "compact":
        classes.push("space-y-2")
        break
      case "relaxed":
        classes.push("space-y-6")
        break
      default:
        classes.push("space-y-4")
    }

    // Focus mode
    if (config.focusMode) {
      classes.push("bg-muted/30")
    }

    return classes.join(" ")
  }, [config])

  const getDeviceIcon = useCallback(() => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }, [deviceType])

  return (
    <div className={cn("relative h-full", layoutClasses, className)}>
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 z-50 w-80 h-full bg-background border-l shadow-xl"
          >
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <h3 className="font-semibold">Chat Settings</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                  >
                    ×
                  </Button>
                </div>

                {/* Device Info */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getDeviceIcon()}
                    <span>Device: {deviceType}</span>
                  </div>
                </Card>

                {/* Layout Settings */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout
                  </Label>
                  <Select
                    value={config.layout}
                    onValueChange={(value: any) => updateConfig({ layout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="focused">Focused</SelectItem>
                      <SelectItem value="split">Split View</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="columns">Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme Settings */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="w-4 h-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="w-4 h-4 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="w-4 h-4 mr-1" />
                      System
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto theme (time-based)</Label>
                    <Switch
                      checked={config.autoTheme}
                      onCheckedChange={(checked) => updateConfig({ autoTheme: checked })}
                    />
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Size
                  </Label>
                  <Select
                    value={config.fontSize}
                    onValueChange={(value: any) => updateConfig({ fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sidebar Width */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Columns className="w-4 h-4" />
                    Sidebar Width
                  </Label>
                  <Slider
                    value={[config.sidebarWidth]}
                    onValueChange={([value]: number[]) => updateConfig({ sidebarWidth: value })}
                    min={200}
                    max={400}
                    step={20}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {config.sidebarWidth}px
                  </div>
                </div>

                {/* Message Spacing */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    Message Spacing
                  </Label>
                  <Select
                    value={config.messageSpacing}
                    onValueChange={(value: any) => updateConfig({ messageSpacing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Display Options */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Display Options
                  </Label>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Avatars</Label>
                    <Switch
                      checked={config.showAvatars}
                      onCheckedChange={(checked) => updateConfig({ showAvatars: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Timestamps</Label>
                    <Switch
                      checked={config.showTimestamps}
                      onCheckedChange={(checked) => updateConfig({ showTimestamps: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Reactions</Label>
                    <Switch
                      checked={config.showReactions}
                      onCheckedChange={(checked) => updateConfig({ showReactions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Threads</Label>
                    <Switch
                      checked={config.showThreads}
                      onCheckedChange={(checked) => updateConfig({ showThreads: checked })}
                    />
                  </div>
                </div>

                <Separator />

                {/* Performance Options */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance
                  </Label>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Animations</Label>
                    <Switch
                      checked={config.enableAnimations}
                      onCheckedChange={(checked) => updateConfig({ enableAnimations: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Sounds</Label>
                    <Switch
                      checked={config.enableSounds}
                      onCheckedChange={(checked) => updateConfig({ enableSounds: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Focus Mode</Label>
                    <Switch
                      checked={config.focusMode}
                      onCheckedChange={(checked) => updateConfig({ focusMode: checked })}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quick Actions
                  </Label>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig(defaultConfig)}
                    className="w-full"
                  >
                    Reset to Default
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConfig({ layout: "compact" })}
                    >
                      <Minimize2 className="w-3 h-3 mr-1" />
                      Compact
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConfig({ layout: "focused" })}
                    >
                      <Maximize2 className="w-3 h-3 mr-1" />
                      Focus
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
          {config.focusMode && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Focus
            </Badge>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "h-full transition-all duration-300",
        !config.enableAnimations && "transition-none"
      )}>
        {children}
      </div>

      {/* Focus Mode Overlay */}
      {config.focusMode && (
        <div className="fixed inset-0 bg-black/20 pointer-events-none z-30" />
      )}
    </div>
  )
}
