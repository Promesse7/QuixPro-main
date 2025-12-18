"use client";

import React, { useEffect, useRef, useState } from "react";

interface MathInputProps {
  value?: string;
  onChange?: (latex: string) => void;
  placeholder?: string;
  className?: string;
}

export const MathInput: React.FC<MathInputProps> = ({ value = "", onChange, placeholder = "Enter LaTeX...", className = "" }) => {
  const [input, setInput] = useState<string>(value);
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);
  const [katexLoaded, setKatexLoaded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadKatex() {
      try {
        // Dynamically import katex. If katex is not installed, we'll silently fallback.
        const katex = await import('katex');
        // Inject KaTeX stylesheet if not present
        if (mounted) {
          const hasCss = !!document.querySelector('link[data-katex-css]');
          if (!hasCss) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.setAttribute('data-katex-css', 'true');
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
            document.head.appendChild(link);
          }

          setKatexLoaded(true);
          try {
            const html = katex.renderToString(input || '', { throwOnError: false });
            setRenderedHtml(html);
          } catch (e) {
            setRenderedHtml(null);
          }
        }
      } catch (err) {
        // katex not available — remain functional with plain-text preview
        setKatexLoaded(false);
        setRenderedHtml(null);
      }
    }

    loadKatex();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    // Update parent
    onChange?.(input);

    // If katex is loaded, update preview
    if (katexLoaded) {
      (async () => {
        try {
          const katex = await import('katex');
          const html = katex.renderToString(input || '', { throwOnError: false });
          setRenderedHtml(html);
        } catch (e) {
          setRenderedHtml(null);
        }
      })();
    } else {
      setRenderedHtml(null);
    }
  }, [input, katexLoaded, onChange]);

  const insertAtCursor = (text: string) => {
    const ta = textareaRef.current;
    if (!ta) return setInput((s) => s + text);
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const before = input.slice(0, start);
    const after = input.slice(end);
    const next = `${before}${text}${after}`;
    setInput(next);
    // move cursor after inserted text
    requestAnimationFrame(() => {
      const pos = start + text.length;
      ta.focus();
      ta.selectionStart = pos;
      ta.selectionEnd = pos;
    });
  };

  const toolbar = [
    { label: "x^2", insert: "x^{2}" },
    { label: "\frac{}{}", insert: "\\frac{a}{b}" },
    { label: "sqrt", insert: "\\sqrt{}" },
    { label: "sum", insert: "\\sum_{i=1}^{n}" },
    { label: "int", insert: "\\int" },
    { label: "pi", insert: "\\pi" },
    { label: "theta", insert: "\\theta" },
    { label: "alpha", insert: "\\alpha" },
  ];

  return (
    <div className={`math-input-component ${className}`}> 
      <div className="mb-2 flex gap-2 flex-wrap">
        {toolbar.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => insertAtCursor(b.insert)}
            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            {b.label}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[80px] p-2 border rounded"
      />

      <div className="mt-3">
        <div className="text-xs text-muted-foreground mb-1">Preview</div>
        <div className="min-h-[40px] p-2 border rounded bg-white">
          {renderedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{input || 'Nothing to preview'}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathInput;
