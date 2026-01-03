"use client"

import React, { useState } from 'react'
import {
    FolderOpen,
    Image,
    FileText,
    Link as LinkIcon,
    Download,
    ExternalLink,
    File,
    FileImage,
    FileVideo,
    FileAudio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'
import type { SharedResource } from '@/hooks/useChatContextData'

interface SharedResourcesHubProps {
    resources: SharedResource[]
    onDownload?: (resource: SharedResource) => void
    onOpenExternal?: (resource: SharedResource) => void
    className?: string
}

type ResourceTab = 'all' | 'files' | 'images' | 'links' | 'math'

export function SharedResourcesHub({
    resources,
    onDownload,
    onOpenExternal,
    className = ""
}: SharedResourcesHubProps) {
    const [activeTab, setActiveTab] = useState<ResourceTab>('all')

    // Filter resources by type
    const filterResources = (tab: ResourceTab): SharedResource[] => {
        if (tab === 'all') return resources
        return resources.filter(r => r.type === tab)
    }

    // Count by type
    const counts = {
        all: resources.length,
        files: resources.filter(r => r.type === 'file').length,
        images: resources.filter(r => r.type === 'image').length,
        links: resources.filter(r => r.type === 'link').length,
        math: resources.filter(r => r.type === 'math').length
    }

    const filteredResources = filterResources(activeTab)

    const tabs: { id: ResourceTab; label: string; icon: typeof File }[] = [
        { id: 'all', label: 'All', icon: FolderOpen },
        { id: 'files', label: 'Files', icon: FileText },
        { id: 'images', label: 'Images', icon: Image },
        { id: 'links', label: 'Links', icon: LinkIcon }
    ]

    return (
        <CollapsibleSection
            title="Shared Resources"
            icon={<FolderOpen className="w-3.5 h-3.5 text-green-500" />}
            count={resources.length}
            accentColor="green-500"
            className={className}
        >
            <div className="px-4 space-y-3">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const count = counts[tab.id]
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-colors text-xs font-medium",
                                    activeTab === tab.id
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {count > 0 && (
                                    <span className="text-[10px] opacity-60">({count})</span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Resources list */}
                {filteredResources.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No {activeTab === 'all' ? 'shared resources' : activeTab} yet</p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {filteredResources.map((resource) => (
                            <ResourceItem
                                key={resource._id}
                                resource={resource}
                                onDownload={onDownload ? () => onDownload(resource) : undefined}
                                onOpenExternal={onOpenExternal ? () => onOpenExternal(resource) : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CollapsibleSection>
    )
}

// Individual resource item
function ResourceItem({
    resource,
    onDownload,
    onOpenExternal
}: {
    resource: SharedResource
    onDownload?: () => void
    onOpenExternal?: () => void
}) {
    // Get appropriate icon for file type
    const getResourceIcon = () => {
        switch (resource.type) {
            case 'image':
                return { icon: FileImage, color: 'text-purple-500 bg-purple-500/10' }
            case 'link':
                return { icon: LinkIcon, color: 'text-blue-500 bg-blue-500/10' }
            case 'math':
                return { icon: () => <span className="text-xs font-mono font-bold">∑</span>, color: 'text-orange-500 bg-orange-500/10' }
            default:
                // Try to determine from file name
                const ext = resource.name.split('.').pop()?.toLowerCase()
                if (['pdf'].includes(ext || '')) {
                    return { icon: FileText, color: 'text-red-500 bg-red-500/10' }
                }
                if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) {
                    return { icon: FileVideo, color: 'text-pink-500 bg-pink-500/10' }
                }
                if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
                    return { icon: FileAudio, color: 'text-green-500 bg-green-500/10' }
                }
                return { icon: File, color: 'text-muted-foreground bg-muted/50' }
        }
    }

    // Format file size
    const formatSize = (bytes?: number) => {
        if (!bytes) return ''
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    // Format date
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const iconInfo = getResourceIcon()
    const IconComponent = iconInfo.icon

    return (
        <div className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
            {/* Icon or preview */}
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                iconInfo.color
            )}>
                {resource.preview && resource.type === 'image' ? (
                    <img
                        src={resource.preview}
                        alt={resource.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <IconComponent className="w-5 h-5" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{resource.name}</p>
                <p className="text-[11px] text-muted-foreground">
                    {resource.uploadedByName || resource.uploadedBy}
                    {resource.size && <span> • {formatSize(resource.size)}</span>}
                    <span> • {formatDate(resource.uploadedAt)}</span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onOpenExternal && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onOpenExternal}
                        className="h-7 w-7"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                )}
                {onDownload && resource.type !== 'link' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDownload}
                        className="h-7 w-7"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </Button>
                )}
            </div>
        </div>
    )
}
