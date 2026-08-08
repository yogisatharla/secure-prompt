import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-brand-muted">
      <div className="w-16 h-16 mb-6 rounded-full bg-brand-base flex items-center justify-center border border-brand-border">
        <ShieldAlert className="w-8 h-8 opacity-50" />
      </div>
      <p className="text-sm font-mono uppercase tracking-wider mb-2">No scan performed yet</p>
      <p className="text-sm opacity-70">Paste a prompt and click Scan & Rewrite to analyze.</p>
    </div>
  );
};
