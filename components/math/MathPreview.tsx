"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface MathPreviewProps {
  latex: string
  className?: string
}

export const MathPreview: React.FC<MathPreviewProps> = ({ latex, className = "" }) => {
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const katex = await import("katex")
        if (!mounted) return

        const rendered = katex.renderToString(latex || "", {
          throwOnError: false,
          displayMode: true,
          macros: {
            "\\frac": "{\\displaystyle\\frac",
            "\\dfrac": "{\\displaystyle\\frac",
          },
        })
        setHtml(rendered)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rendering error")
        setHtml(null)
      }
    })()

    return () => {
      mounted = false
    }
  }, [latex])

  if (error) {
    return (
      <div
        className={`bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive ${className}`}
      >
        <p className="font-semibold mb-1">LaTeX Error:</p>
        <pre className="text-xs overflow-auto max-h-24">{latex}</pre>
      </div>
    )
  }

  if (html) {
    return <div className={`math-preview ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return <pre className={`whitespace-pre-wrap text-sm text-muted-foreground font-mono ${className}`}>{latex}</pre>
}
