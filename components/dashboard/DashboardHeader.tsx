"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, Plus, Filter } from "lucide-react"
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type DashboardHeaderProps = {
  title: string
  description?: string
  breadcrumbItems?: {
    label: string
    href?: string
    icon?: React.ReactNode
    isLoading?: boolean
  }[]
  actions?: React.ReactNode
  className?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
}

export function DashboardHeader({
  title,
  description,
  breadcrumbItems = [],
  actions,
  className,
  showSearch = false,
  onSearch,
}: DashboardHeaderProps) {
  const pathname = usePathname()
  const defaultBreadcrumb = [
    {
      label: title,
      href: pathname,
    },
  ]

  return (
    <header className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-full sm:w-[200px] md:w-[300px]"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
          
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          {actions || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create New</span>
            </Button>
          )}
        </div>
      </div>
      
      <AppBreadcrumb items={breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumb} />
    </header>
  )
}

// Skeleton loader for the header
export function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-[200px] bg-muted rounded-md animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
          <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
      <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
    </div>
  )
}
