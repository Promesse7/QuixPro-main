"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface MathKeyboardProps {
  onInsert: (symbol: string) => void
}

const MATH_SYMBOLS = {
  Fractions: ["\\frac{}{)", "\\dfrac{}{}"],
  Roots: ["\\sqrt{}", "\\sqrt[3]{}", "\\sqrt[n]{}"],
  Calculus: ["\\int", "\\iint", "\\iiint", "\\oint", "\\sum", "\\prod", "\\lim"],
  "Greek Letters": ["\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon", "\\theta", "\\pi", "\\sigma", "\\omega"],
  Logic: ["\\forall", "\\exists", "\\neg", "\\land", "\\lor", "\\Rightarrow", "\\Leftrightarrow"],
  Sets: ["\\cup", "\\cap", "\\subset", "\\subseteq", "\\emptyset", "\\in", "\\notin"],
  Relations: ["\\leq", "\\geq", "\\approx", "\\equiv", "\\neq", "\\sim"],
  Operators: ["+", "-", "\\times", "\\div", "\\pm", "\\mp", "\\cdot", "\\ast"],
  Accents: ["\\hat{}", "\\tilde{}", "\\bar{}", "\\vec{}", "\\dot{}", "\\ddot{}"],
  Brackets: ["\\left(\\right)", "\\left[\\right]", "\\left\\{\\right\\}", "\\lvert\\rvert", "\\lVert\\rVert"],
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  return (
    <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
      {Object.entries(MATH_SYMBOLS).map(([category, symbols]) => (
        <div key={category}>
          <h4 className="text-xs font-bold text-muted-foreground/70 mb-2 uppercase tracking-wider">{category}</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {symbols.map((symbol, idx) => (
              <Button
                key={`${category}-${idx}`}
                onClick={() => onInsert(symbol)}
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs font-mono hover:bg-primary/10 hover:text-primary transition-all"
                title={`Insert ${symbol}`}
              >
                {symbol.length > 8 ? symbol.substring(0, 8) + "..." : symbol}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
