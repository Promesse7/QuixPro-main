"use client"

import React, { useState } from "react"
import { MathKeyboard } from "./MathKeyboard"

interface MathInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const MathInput: React.FC<MathInputProps> = ({ value, onChange, placeholder }) => {
  const [showKeyboard, setShowKeyboard] = useState(false)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const insertSymbol = (symbol: string) => {
    const textarea = inputRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = value.substring(0, start)
    const after = value.substring(end)
    const newValue = before + symbol + after

    onChange(newValue)

    // Focus back to textarea and position cursor after inserted symbol
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + symbol.length
      textarea.selectionEnd = start + symbol.length
    }, 0)
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter LaTeX expression (e.g., \\frac{a}{b}, \\sqrt{x})"}
          className="w-full px-4 py-3 border border-border/40 rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] font-mono text-sm"
        />
      </div>

      {/* Math Keyboard Toggle */}
      <button
        onClick={() => setShowKeyboard(!showKeyboard)}
        className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
      >
        {showKeyboard ? "✕ Hide Math Keyboard" : "⌨ Show Math Keyboard"}
      </button>

      {/* Math Keyboard */}
      {showKeyboard && <MathKeyboard onInsert={insertSymbol} />}

      {/* Help Text */}
      <div className="text-[11px] text-muted-foreground/60 space-y-1 px-2">
        <p className="font-semibold">LaTeX Examples:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>{"\\frac{1}{2}"} - Fractions</li>
          <li>{"\\sqrt{x} or \\sqrt[n]{x}"} - Square roots and nth roots</li>
          <li>{"\\int, \\sum, \\prod"} - Integral, sum, product symbols</li>
          <li>{"\\alpha, \\beta, \\gamma"} - Greek letters</li>
          <li>{"x^2, x_i"} - Superscripts and subscripts</li>
        </ul>
      </div>
    </div>
  )
}
