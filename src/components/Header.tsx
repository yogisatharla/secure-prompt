import React from 'react';
import { Shield } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full flex items-center justify-between py-3 sm:py-6 px-4 sm:px-8 border-b border-brand-border bg-brand-base">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-card border border-risk-pii/30 text-risk-pii shrink-0">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-brand-text uppercase">
            Secure Prompt
          </h1>
          <p className="text-[10px] sm:text-xs font-mono text-brand-muted tracking-widest uppercase">
            Redact & Rewrite
          </p>
        </div>
      </div>
      <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 rounded-full border border-risk-financial/30 bg-risk-financial/10">
        <span className="w-1.5 h-1.5 rounded-full bg-risk-financial"></span>
        <span className="text-[10px] sm:text-xs font-mono text-risk-financial uppercase tracking-wider">
          Side Panel • Active
        </span>
      </div>
    </header>
  );
};
