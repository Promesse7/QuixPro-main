"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

type Crumb = { label: string; href?: string }

export function AppBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <ChevronRight className="h-4 w-4 opacity-60" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
