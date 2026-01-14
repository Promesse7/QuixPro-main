import React, { useEffect, useState } from 'react';

interface RenderedContentProps {
  content: string;
}

const RenderedContent: React.FC<RenderedContentProps> = ({ content }) => {
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);

  useEffect(() => {
    const renderContent = async () => {
      try {
        const katex = await import('katex');
        // Inject KaTeX stylesheet if not present
        const hasCss = !!document.querySelector('link[data-katex-css]');
        if (!hasCss) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.setAttribute('data-katex-css', 'true');
          link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
          document.head.appendChild(link);
        }
        const html = katex.renderToString(content, { throwOnError: false });
        setRenderedHtml(html);
      } catch (e) {
        // If katex is not available, just show plain text
        setRenderedHtml(null);
      }
    };

    renderContent();
  }, [content]);

  if (renderedHtml) {
    return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
  }

  // Fallback to plain text
  return <p>{content}</p>;
};

export default RenderedContent;
