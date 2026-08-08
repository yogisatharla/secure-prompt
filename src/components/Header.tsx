import React from 'react';
import { Shield } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full flex items-center justify-between py-6 px-8 border-b border-brand-border bg-brand-base">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-card border border-risk-pii/30 text-risk-pii">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-mono tracking-wide text-brand-text uppercase">
            Secure Prompt
          </h1>
          <p className="text-xs font-mono text-brand-muted tracking-widest uppercase">
            Redact & Rewrite
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-risk-financial/30 bg-risk-financial/10">
        <span className="w-1.5 h-1.5 rounded-full bg-risk-financial"></span>
        <span className="text-xs font-mono text-risk-financial uppercase tracking-wider">
          Self-Hosted • Nothing Stored
        </span>
      </div>
    </header>
  );
};
