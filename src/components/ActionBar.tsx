import React, { useState } from 'react';
import { Copy, Download, Check, FileDown } from 'lucide-react';

interface ActionBarProps {
  content: string;
  censored?: any[];
}

export const ActionBar: React.FC<ActionBarProps> = ({ content, censored }) => {
  const [copied, setCopied] = useState(false);
  const [downloadedCensored, setDownloadedCensored] = useState(false);
  const [downloadedSafe, setDownloadedSafe] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCensored = () => {
    let censoredText = '';
    if (censored && Array.isArray(censored) && censored.length > 0) {
      censoredText = censored
        .map((segment) => (segment.type === 'redacted' ? '[REDACTED]' : segment.content))
        .join('');
    } else {
      censoredText = content;
    }

    downloadTextFile(censoredText, 'censored-prompt.txt');
    setDownloadedCensored(true);
    setTimeout(() => setDownloadedCensored(false), 2000);
  };

  const handleDownloadSafe = () => {
    downloadTextFile(content, 'safe-prompt.txt');
    setDownloadedSafe(true);
    setTimeout(() => setDownloadedSafe(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 bg-brand-panel p-4 rounded-xl border border-brand-border mt-4">
      <button
        onClick={handleCopy}
        type="button"
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-brand-border/30 hover:bg-brand-border/60 text-brand-text text-sm font-mono font-medium tracking-wide transition-all border border-brand-border cursor-pointer active:scale-[0.98]"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-risk-project" />
            <span className="text-risk-project font-bold">COPIED!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-brand-muted" />
            <span>COPY SAFE PROMPT</span>
          </>
        )}
      </button>

      <button
        onClick={handleDownloadCensored}
        type="button"
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-brand-border/30 hover:bg-brand-border/60 text-brand-text text-sm font-mono font-medium tracking-wide transition-all border border-brand-border cursor-pointer active:scale-[0.98]"
      >
        {downloadedCensored ? (
          <>
            <Check className="w-4 h-4 text-risk-financial" />
            <span className="text-risk-financial font-bold">DOWNLOADED!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-brand-muted" />
            <span>DOWNLOAD CENSORED FILE</span>
          </>
        )}
      </button>

      <button
        onClick={handleDownloadSafe}
        type="button"
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-brand-border/30 hover:bg-brand-border/60 text-brand-text text-sm font-mono font-medium tracking-wide transition-all border border-brand-border cursor-pointer active:scale-[0.98]"
        title="Download safe prompt as .txt"
      >
        {downloadedSafe ? (
          <>
            <Check className="w-4 h-4 text-risk-pii" />
            <span className="text-risk-pii font-bold">SAVED!</span>
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 text-brand-muted" />
            <span>SAVE SAFE FILE</span>
          </>
        )}
      </button>
    </div>
  );
};
