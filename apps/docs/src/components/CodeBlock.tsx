import { useState, ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  preview?: ReactNode;
}

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function CodeBlock({ code, preview }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(preview ? 'preview' : 'code');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--docs-border)] overflow-hidden bg-[var(--docs-bg-secondary)]">
      {/* Tab bar */}
      {preview && (
        <div className="flex items-center justify-between border-b border-[var(--docs-border)] px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'preview'
                  ? 'text-[var(--docs-text)]'
                  : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)]'
              }`}
            >
              Preview
              {activeTab === 'preview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--docs-accent)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'code'
                  ? 'text-[var(--docs-text)]'
                  : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)]'
              }`}
            >
              Code
              {activeTab === 'code' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--docs-accent)]" />
              )}
            </button>
          </div>
          {activeTab === 'code' && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)] transition-colors"
              aria-label="Copy code"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {activeTab === 'preview' && preview ? (
        <div className="p-6 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10">
          <div className="flex items-center justify-center min-h-[200px]">
            {preview}
          </div>
        </div>
      ) : (
        <div className="relative">
          {!preview && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)] transition-colors z-10"
              aria-label="Copy code"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          )}
          <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-[var(--docs-text)]">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
