"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type React from "react"

type Crumb = { label: string; href?: string; icon?: React.ReactNode }

export function AppBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm flex items-center gap-1 pb-4" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          {item.href ? (
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-foreground font-semibold">
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
